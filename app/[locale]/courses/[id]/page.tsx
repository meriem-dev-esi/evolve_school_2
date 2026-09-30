import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CourseCertificateSection from "@/components/course/CourseCertificateSection";
import CourseHeroHeader from "@/components/course/CourseHeroHeader";
import CourseLessonsList from "@/components/course/CourseLessonsList";
import type {
  CourseDetail,
  LessonItem,
  LessonProgressItem,
} from "@/components/course/types";
import type { EnrolledCourseItem } from "@/components/dashboard/types";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import { verifyChargilyPayment } from "@/lib/data/course-payment";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams?: Promise<{
    payment?: string;
    completed?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("title, description, image_url, price, level, domain")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return { title: "Formation — Evolve Academy" };
  }

  return {
    title: `${course.title} — Evolve Academy`,
    description:
      course.description ||
      `Suivez le cours ${course.title} sur Evolve Academy.`,
    openGraph: {
      title: `${course.title} | Evolve Academy`,
      description:
        course.description || `Formation ${course.domain || "créative"}.`,
      images: course.image_url ? [{ url: course.image_url }] : [],
    },
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { payment, completed } = (await searchParams) || {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/courses/${id}/checkout`);
  }

  // Check whether this course belongs to a formation series
  const { data: seriesCourse } = await supabase
    .from("series_courses")
    .select("series_id, order_index")
    .eq("course_id", id)
    .maybeSingle();

  // Formation prerequisite locking
  if (seriesCourse && seriesCourse.order_index > 1) {
    const { data: previousCourse } = await supabase
      .from("series_courses")
      .select("course_id")
      .eq("series_id", seriesCourse.series_id)
      .eq("order_index", seriesCourse.order_index - 1)
      .maybeSingle();

    if (previousCourse) {
      const { data: previousLessons } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", previousCourse.course_id);

      if (previousLessons && previousLessons.length > 0) {
        const previousLessonIds = previousLessons.map((l) => l.id);
        const { data: completedLessons } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("completed", true)
          .in("lesson_id", previousLessonIds);

        if (completedLessons?.length !== previousLessons.length) {
          redirect(`/${locale}/formations`);
        }
      }
    }
  }

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (courseError || !course) {
    console.error("[Evolve] Course page error:", id, courseError);
    notFound();
  }
  // Fetch user profile name for certificate
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const userName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Étudiant Evolve";

  // Check enrollment payment status
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, payment_status, chargily_checkout_id")
    .eq("user_id", user.id)
    .eq("course_id", id)
    .maybeSingle();

  let isPaid = enrollment?.payment_status === "paid";

  if (
    !isPaid &&
    enrollment?.chargily_checkout_id &&
    (payment === "success" || enrollment.payment_status === "pending")
  ) {
    const verified = await verifyChargilyPayment(
      enrollment.id,
      enrollment.chargily_checkout_id,
    );
    if (verified) isPaid = true;
  }

  // Fetch lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, title, description, duration, order_index, is_free")
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  if (lessonsError) {
    throw new Error(lessonsError.message);
  }

  const lessonList = (lessons ?? []) as LessonItem[];
  const lessonIds = lessonList.map((l) => l.id);

  // Fetch student progress
  const { data: progress } =
    lessonIds.length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, progress_percentage, completed, last_position")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds)
      : { data: [] };

  const progressList = (progress ?? []) as LessonProgressItem[];
  const completedLessons = progressList.filter((item) => item.completed).length;
  const totalLessons = lessonList.length;
  const courseProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isCompleted = completedLessons === totalLessons && totalLessons > 0;

  const courseDetail: CourseDetail = {
    id: course.id,
    title: course.title,
    description: course.description,
    image_url: course.image_url,
    price: course.price,
    level: course.level,
    domain: course.domain,
  };

  const enrolledCourseItem: EnrolledCourseItem = {
    id: course.id,
    title: course.title,
    description: course.description,
    image_url: course.image_url,
    domain: course.domain ?? null,
    level: course.level ?? null,
    duration: course.duration ?? null,
    totalLessons,
    completedLessons,
    progressPercentage: courseProgress,
    isCompleted,
    certificate: isCompleted
      ? {
          verificationCode:
            `${course.id.slice(0, 4)}-${user.id.slice(0, 4)}`.toUpperCase(),
          issuedAt: new Date().toISOString(),
        }
      : null,
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 pt-28 pb-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/formations"
            className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Retour aux formations</span>
          </Link>

          {payment === "success" && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand/10 p-4 text-sm font-medium text-brand">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>
                Paiement validé avec succès ! Votre accès complet aux leçons est
                débloqué.
              </span>
            </div>
          )}

          {isCompleted && (
            <CourseCertificateSection
              courseItem={enrolledCourseItem}
              userName={userName}
              autoOpen={completed === "1"}
            />
          )}

          <CourseHeroHeader
            course={courseDetail}
            totalLessons={totalLessons}
            completedLessons={completedLessons}
            courseProgress={courseProgress}
          />

          <CourseLessonsList
            courseId={id}
            lessonList={lessonList}
            progressList={progressList}
            isPaid={isPaid}
          />
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
