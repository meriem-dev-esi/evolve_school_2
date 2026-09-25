import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import FormationsCommunityCta from "@/components/formations/FormationsCommunityCta";
import FormationsCompletionAlert from "@/components/formations/FormationsCompletionAlert";
import FormationsHero from "@/components/formations/FormationsHero";
import type { Course, Formation } from "@/components/formations/types";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import FormationsBrowser from "./FormationsBrowser";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    completed?: string;
    formation?: string;
  }>;
};

export default async function FormationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("formations");
  const tNav = await getTranslations("nav");

  const { completed: completedParam, formation: completedFormationParam } =
    await searchParams;

  const supabase = await createClient();

  // 1. Authenticated user & published series
  const [
    {
      data: { user },
    },
    { data: formations, error: formationsError },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("course_series")
      .select("id, title, description, image_url, level, domain, is_published")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  if (formationsError) {
    console.error("[Evolve] Formations error:", formationsError);
  }

  // 2. User progress & series-courses relations
  const formationIds = (formations ?? []).map((f) => f.id);

  const [
    { data: progressRows },
    { data: seriesCourses, error: seriesCoursesError },
  ] = await Promise.all([
    user
      ? supabase
          .from("lesson_progress")
          .select("lesson_id, completed, progress_percentage")
          .eq("user_id", user.id)
      : Promise.resolve({ data: [] }),

    formationIds.length > 0
      ? supabase
          .from("series_courses")
          .select("series_id, course_id, order_index")
          .in("series_id", formationIds)
          .order("order_index", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (seriesCoursesError) {
    console.error("[Evolve] Series courses error:", seriesCoursesError);
  }

  // 3. Courses & lessons details
  const courseIds = [
    ...new Set((seriesCourses ?? []).map((item) => item.course_id)),
  ];

  const [{ data: courses, error: coursesError }, { data: lessons }] =
    await Promise.all([
      courseIds.length > 0
        ? supabase
            .from("courses")
            .select(
              "id, title, description, image_url, level, domain, duration",
            )
            .in("id", courseIds)
            .eq("is_published", true)
        : Promise.resolve({ data: [], error: null }),

      courseIds.length > 0
        ? supabase
            .from("lessons")
            .select("id, course_id, order_index")
            .in("course_id", courseIds)
            .order("order_index", { ascending: true })
        : Promise.resolve({ data: [] }),
    ]);

  if (coursesError) {
    console.error("[Evolve] Courses error:", coursesError);
  }

  // 4. Create course map with calculated progress
  const courseMap = new Map<string, Course>();

  for (const course of courses ?? []) {
    const courseLessons = (lessons ?? [])
      .filter((lesson) => lesson.course_id === course.id)
      .sort((a, b) => a.order_index - b.order_index);

    const completedLessons = courseLessons.filter((lesson) =>
      (progressRows ?? []).some(
        (progress) =>
          progress.lesson_id === lesson.id && progress.completed === true,
      ),
    ).length;

    const progress =
      courseLessons.length > 0
        ? Math.round((completedLessons / courseLessons.length) * 100)
        : 0;

    const completed =
      courseLessons.length > 0 && completedLessons === courseLessons.length;

    const nextLesson =
      courseLessons.find(
        (lesson) =>
          !(progressRows ?? []).some(
            (progress) =>
              progress.lesson_id === lesson.id && progress.completed === true,
          ),
      ) ??
      courseLessons[0] ??
      null;

    courseMap.set(course.id, {
      ...course,
      progress,
      completed,
      nextLessonId: nextLesson?.id ?? null,
    });
  }

  // 5. Build formation series models
  // Guard: filter out any formation missing an id (defensive — should not
  // happen given the Supabase select, but avoids ever passing an
  // incomplete/undefined-like object down to the UI).
  const formationData: Formation[] = (formations ?? [])
    .filter((formation) => Boolean(formation?.id))
    .map((formation) => {
      const formationCourses = (seriesCourses ?? [])
        .filter((item) => item.series_id === formation.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map((item) => courseMap.get(item.course_id))
        .filter((course): course is Course => Boolean(course));

      return {
        id: formation.id,
        title: formation.title,
        description: formation.description,
        image_url: formation.image_url,
        level: formation.level,
        domain: formation.domain,
        courses: formationCourses,
      };
    });

  // 6. Compute completed series
  const completedFormationIds = formationData
    .filter(
      (formation) =>
        formation.courses.length > 0 &&
        formation.courses.every((course) => course.completed),
    )
    .map((formation) => formation.id);

  // 7. Global aggregate progress for user
  const totalFormationCourses = formationData.reduce(
    (total, formation) => total + formation.courses.length,
    0,
  );

  const completedFormationCourses = formationData.reduce(
    (total, formation) =>
      total + formation.courses.filter((course) => course.completed).length,
    0,
  );

  const globalProgress =
    totalFormationCourses > 0
      ? Math.round((completedFormationCourses / totalFormationCourses) * 100)
      : 0;

  // 8. Completed formation notification handling
  const formationWasCompleted =
    completedParam === "1" &&
    completedFormationParam &&
    completedFormationIds.includes(completedFormationParam);

  const completedFormation = completedFormationParam
    ? formationData.find((f) => f.id === completedFormationParam)
    : null;

  return (
    <div className="min-h-dvh bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Header */}
        <FormationsHero
          badge={t("badge")}
          title={t("title")}
          titleGradient={t("titleGradient")}
          subtitle={t("subtitle")}
          showProgress={Boolean(user && totalFormationCourses > 0)}
          globalProgressText={t("globalProgress")}
          globalProgress={globalProgress}
          completedCoursesCountText={t("completedCoursesCount", {
            completed: completedFormationCourses,
            total: totalFormationCourses,
          })}
        />

        {/* Completion Alert */}
        {formationWasCompleted && (
          <FormationsCompletionAlert
            completedTitle={t("completedTitle")}
            formationTitle={completedFormation?.title}
            completedDesc={t("completedDesc")}
          />
        )}

        {/* Formations Browser with Search, Filters & Cards */}
        <FormationsBrowser
          formations={formationData}
          locale={locale}
          completedFormationIds={completedFormationIds}
        />

        {/* Community Banner Call-to-Action */}
        <FormationsCommunityCta
          communityLabel={tNav("community")}
          locale={locale}
        />
      </main>

      <Footer />
    </div>
  );
}
