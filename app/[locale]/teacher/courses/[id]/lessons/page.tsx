import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DeleteLessonButton from "@/components/DeleteLessonButton";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "teacher" });
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  return {
    title: `${course?.title || t("lessonsTitle")} | Evolve Academy`,
  };
}

export default async function TeacherLessonsPage({
  params,
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "teacher" });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t("pleaseSignIn")}</h1>

          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-black"
          >
            {t("signInButton")}
          </Link>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["teacher", "admin"].includes(profile.role)) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t("accessDenied")}</h1>

          <p className="mt-3 text-white/50">{t("teacherRequired")}</p>
        </div>
      </main>
    );
  }

  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(
      "id, title, description, youtube_url, video_url, duration, order_index, is_free",
    )
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  return (
    <main className="min-h-dvh bg-black px-6 py-28 text-white lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/teacher/courses"
          className="text-sm text-white/50 transition hover:text-brand"
        >
          {t("backToCourses")}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
              {t("dashboardBadge")}
            </p>

            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              {course?.title || t("lessonsTitle")}
            </h1>

            <p className="mt-3 text-white/50">{t("lessonsSubtitle")}</p>
          </div>

          <Link
            href={`/teacher/courses/${id}/lessons/new`}
            className="rounded-full bg-brand px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            {t("addLesson")}
          </Link>
        </div>

        {error && (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-red-400">
            {t("errorPrefix")} {error.message}
          </div>
        )}

        {!error && lessons?.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold">{t("noLessonsTitle")}</h2>

            <p className="mt-3 text-white/50">{t("noLessonsSubtitle")}</p>

            <Link
              href={`/teacher/courses/${id}/lessons/new`}
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-black"
            >
              {t("addLesson")}
            </Link>
          </div>
        )}

        {!error && lessons && lessons.length > 0 && (
          <div className="mt-10 space-y-4">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                        {t("lessonIndex", { order: lesson.order_index })}
                      </span>

                      {lesson.is_free && (
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                          {t("badgeFree")}
                        </span>
                      )}

                      {lesson.youtube_url && (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                          {t("badgeYoutube")}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold">{lesson.title}</h2>

                    {lesson.description && (
                      <p className="mt-2 max-w-3xl text-sm text-white/40">
                        {lesson.description}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-white/30">
                      {t("durationLabel")}{" "}
                      {t("seconds", { seconds: lesson.duration || 0 })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/teacher/courses/${id}/lessons/${lesson.id}/edit`}
                      className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                      {t("btnEditLesson")}
                    </Link>

                    <DeleteLessonButton lessonId={lesson.id} courseId={id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
