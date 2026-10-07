import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  level: string | null;
  domain: string | null;
  practice_percentage: number | null;
  reasons?: string[];
  is_coming_soon?: boolean | null;
  release_date?: string | null;
}

export interface EnrollmentSeries {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  level: string | null;
  domain: string | null;
  courseIds: string[];
  continueHref: string;
  completedCourses: number;
  progress: number;
}

export interface ContinueLearning {
  courseId: string;
  courseTitle: string;
  courseImage: string | null;
  lessonId: string;
  lessonTitle: string;
  lessonIndex: number;
  totalLessons: number;
  lessonPositionText: string;
  lastPosition: number;
  progress: number;
  lastActivity?: string;
}

export async function getHomePagePublicCourses() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [
    { data: beginnerCourses },
    { data: partnerCourses },
    { data: exclusiveCourses },
    { data: publishedNonComingSoon },
    { data: rawComingSoon },
    { data: recentEnrollments },
    { data: recentSearches },
  ] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage",
      )
      .eq("is_published", true)
      .eq("is_beginner", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage",
      )
      .eq("is_published", true)
      .eq("is_partner", true)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage",
      )
      .eq("is_published", true)
      .eq("is_exclusive", true)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage, created_at, is_coming_soon",
      )
      .eq("is_published", true)
      .eq("is_coming_soon", false),

    supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage, created_at, is_coming_soon",
      )
      .eq("is_published", true)
      .eq("is_coming_soon", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("enrollments")
      .select("course_id")
      .gte("enrolled_at", thirtyDaysAgo),

    supabase
      .from("search_analytics")
      .select("course_id")
      .not("course_id", "is", null)
      .gte("created_at", thirtyDaysAgo),
  ]);

  const activityCount = new Map<string, number>();
  for (const item of recentEnrollments ?? []) {
    if (item.course_id) {
      activityCount.set(
        item.course_id,
        (activityCount.get(item.course_id) ?? 0) + 3,
      );
    }
  }
  for (const item of recentSearches ?? []) {
    if (item.course_id) {
      activityCount.set(
        item.course_id,
        (activityCount.get(item.course_id) ?? 0) + 1,
      );
    }
  }

  const trendingCourses: Course[] = (publishedNonComingSoon ?? [])
    .sort((a, b) => {
      const scoreA = activityCount.get(a.id) ?? 0;
      const scoreB = activityCount.get(b.id) ?? 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return (
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
      );
    })
    .slice(0, 10);

  const trendingIds = new Set(trendingCourses.map((c) => c.id));
  const comingSoonCourses: Course[] = (rawComingSoon ?? [])
    .filter((c) => !trendingIds.has(c.id))
    .slice(0, 10);

  return {
    beginnerCourses: beginnerCourses ?? [],
    partnerCourses: partnerCourses ?? [],
    exclusiveCourses: exclusiveCourses ?? [],
    trendingCourses,
    comingSoonCourses,
  };
}

export async function getUserDashboardData(userId: string) {
  const supabase = await createClient();

  const [{ data: enrollments }, { data: watchlist }, { data: searchData }] =
    await Promise.all([
      supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", userId)
        .eq("payment_status", "paid"),

      supabase
        .from("course_watchlist")
        .select("course_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("search_analytics")
        .select("course_id")
        .not("course_id", "is", null)
        .limit(100),
    ]);

  let watchlistCourses: Course[] = [];
  let becauseYouCompleted: Course[] = [];
  let becauseYouCompletedCourseTitle: string | null = null;
  let enrollmentPaths: EnrollmentSeries[] = [];
  let mostSearchedCourses: Course[] = [];

  // Watchlist
  const watchlistIds = (watchlist ?? [])
    .map((i) => i.course_id)
    .filter(Boolean);
  if (watchlistIds.length > 0) {
    const { data: courses } = await supabase
      .from("courses")
      .select(
        "id, title, description, image_url, price, level, domain, practice_percentage",
      )
      .in("id", watchlistIds)
      .eq("is_published", true);

    const map = new Map((courses ?? []).map((c) => [c.id, c]));
    watchlistCourses = watchlistIds
      .map((id) => map.get(id))
      .filter((c): c is Course => Boolean(c));
  }

  // Enrollments & Progress
  const enrolledIds = new Set(
    (enrollments ?? []).map((i) => i.course_id).filter(Boolean),
  );
  const enrolledCourseIds = [...enrolledIds];

  if (enrolledCourseIds.length > 0) {
    const [{ data: lessons }, { data: seriesCourses }] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, course_id, order_index")
        .in("course_id", enrolledCourseIds),
      supabase
        .from("series_courses")
        .select("series_id, course_id, order_index")
        .in("course_id", enrolledCourseIds)
        .order("order_index", { ascending: true }),
    ]);

    const lessonIds = (lessons ?? []).map((l) => l.id);

    if (lessonIds.length > 0) {
      const { data: progressRows } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, progress_percentage, updated_at")
        .eq("user_id", userId)
        .in("lesson_id", lessonIds);

      const completedLessonIds = new Set(
        (progressRows ?? [])
          .filter(
            (r) => Boolean(r.completed) || (r.progress_percentage ?? 0) >= 95,
          )
          .map((r) => r.lesson_id),
      );

      const completedCourseIds = new Set<string>();
      for (const courseId of enrolledIds) {
        const courseLessons = (lessons ?? []).filter(
          (l) => l.course_id === courseId,
        );
        if (
          courseLessons.length > 0 &&
          courseLessons.every((l) => completedLessonIds.has(l.id))
        ) {
          completedCourseIds.add(courseId);
        }
      }

      if (completedCourseIds.size > 0) {
        // Pick the most recently completed course
        const sortedCompletedCourseIds = [...completedCourseIds].sort(
          (a, b) => {
            const aRows = (progressRows ?? []).filter((r) => {
              const l = (lessons ?? []).find(
                (lesson) => lesson.id === r.lesson_id,
              );
              return l?.course_id === a;
            });
            const bRows = (progressRows ?? []).filter((r) => {
              const l = (lessons ?? []).find(
                (lesson) => lesson.id === r.lesson_id,
              );
              return l?.course_id === b;
            });
            const aDate = Math.max(
              ...aRows.map((r) => new Date(r.updated_at ?? 0).getTime()),
              0,
            );
            const bDate = Math.max(
              ...bRows.map((r) => new Date(r.updated_at ?? 0).getTime()),
              0,
            );
            return bDate - aDate;
          },
        );

        const targetCourseId = sortedCompletedCourseIds[0];

        const { data: targetCourse } = await supabase
          .from("courses")
          .select("id, title, category_id, domain, level")
          .eq("id", targetCourseId)
          .maybeSingle();

        if (targetCourse) {
          becauseYouCompletedCourseTitle = targetCourse.title;

          // Exclude courses completed, enrolled or purchased by the user
          const { data: userOrders } = await supabase
            .from("orders")
            .select("course_id")
            .eq("user_id", userId)
            .in("status", ["paid", "pending"]);

          const orderCourseIds = (userOrders ?? [])
            .map((o) => o.course_id)
            .filter(Boolean);

          const excludedCourseIds = new Set<string>([
            ...enrolledIds,
            ...completedCourseIds,
            ...orderCourseIds,
          ]);

          const { data: candidateCourses } = await supabase
            .from("courses")
            .select(
              "id, title, description, image_url, price, level, domain, practice_percentage, category_id",
            )
            .eq("is_published", true)
            .eq("is_coming_soon", false);

          const availableCourses = (candidateCourses ?? []).filter(
            (c) => !excludedCourseIds.has(c.id),
          );

          const normalizeLevel = (lvl: string | null) => {
            if (!lvl) return "";
            const s = lvl.toLowerCase().trim();
            if (
              s.includes("débutant") ||
              s.includes("debutant") ||
              s.includes("beginner")
            )
              return "beginner";
            if (
              s.includes("interméd") ||
              s.includes("intermed") ||
              s.includes("intermediate")
            )
              return "intermediate";
            if (s.includes("avanc") || s.includes("advanced"))
              return "advanced";
            if (s.includes("tous") || s.includes("all")) return "all";
            return s;
          };

          const targetLevelNorm = normalizeLevel(targetCourse.level);
          const targetDomainNorm = targetCourse.domain?.toLowerCase().trim();

          const scoredCourses = availableCourses
            .map((course) => {
              let score = 0;
              if (
                targetCourse.category_id &&
                course.category_id &&
                course.category_id === targetCourse.category_id
              ) {
                score += 3;
              }
              if (
                targetDomainNorm &&
                course.domain &&
                course.domain.toLowerCase().trim() === targetDomainNorm
              ) {
                score += 2;
              }
              if (
                targetLevelNorm &&
                course.level &&
                normalizeLevel(course.level) === targetLevelNorm
              ) {
                score += 1;
              }
              return { course, score };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);

          becauseYouCompleted = scoredCourses
            .slice(0, 10)
            .map((item) => item.course);
        }
      }
    }

    // Series
    const seriesIds = [
      ...new Set((seriesCourses ?? []).map((s) => s.series_id).filter(Boolean)),
    ];
    if (seriesIds.length > 0) {
      const [
        { data: series },
        { data: allSeriesCourses },
        { data: progressRows },
      ] = await Promise.all([
        supabase
          .from("course_series")
          .select("id, title, description, image_url, level, domain")
          .in("id", seriesIds)
          .eq("is_published", true),
        supabase
          .from("series_courses")
          .select("series_id, course_id, order_index")
          .in("series_id", seriesIds)
          .order("order_index", { ascending: true }),
        supabase
          .from("lesson_progress")
          .select("lesson_id, completed, progress_percentage")
          .eq("user_id", userId),
      ]);

      const allCourseIds = [
        ...new Set(
          (allSeriesCourses ?? []).map((sc) => sc.course_id).filter(Boolean),
        ),
      ];

      const { data: allLessons } =
        allCourseIds.length > 0
          ? await supabase
              .from("lessons")
              .select("id, course_id, order_index")
              .in("course_id", allCourseIds)
              .order("order_index", { ascending: true })
          : { data: [] };

      const completedLessonIds = new Set(
        (progressRows ?? [])
          .filter(
            (row) =>
              Boolean(row.completed) || (row.progress_percentage ?? 0) >= 95,
          )
          .map((row) => row.lesson_id),
      );

      enrollmentPaths = (series ?? []).map((item) => {
        const coursesInSeries = (allSeriesCourses ?? [])
          .filter((sc) => sc.series_id === item.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map((sc) => sc.course_id);

        const completedCourseIds = new Set(
          coursesInSeries.filter((courseId) => {
            const courseLessons = (allLessons ?? []).filter(
              (lesson) => lesson.course_id === courseId,
            );
            if (courseLessons.length === 0) return false;
            return courseLessons.every((lesson) =>
              completedLessonIds.has(lesson.id),
            );
          }),
        );
        const completedCourses = completedCourseIds.size;

        const courseProgressList = coursesInSeries.map((courseId) => {
          const courseLessons = (allLessons ?? []).filter(
            (lesson) => lesson.course_id === courseId,
          );
          if (courseLessons.length === 0) return 0;
          const completedCount = courseLessons.filter((l) =>
            completedLessonIds.has(l.id),
          ).length;
          return Math.round((completedCount / courseLessons.length) * 100);
        });

        const progress =
          coursesInSeries.length > 0
            ? Math.round(
                courseProgressList.reduce((sum, p) => sum + p, 0) /
                  coursesInSeries.length,
              )
            : 0;

        const nextCourseId =
          coursesInSeries.find(
            (courseId) => !completedCourseIds.has(courseId),
          ) ?? coursesInSeries[0];
        const courseLessons = (allLessons ?? [])
          .filter((lesson) => lesson.course_id === nextCourseId)
          .sort((a, b) => a.order_index - b.order_index);
        const nextLesson =
          courseLessons.find((lesson) => !completedLessonIds.has(lesson.id)) ??
          courseLessons[0];

        return {
          ...item,
          courseIds: coursesInSeries,
          continueHref: nextCourseId
            ? nextLesson
              ? `/courses/${nextCourseId}/lessons/${nextLesson.id}`
              : `/courses/${nextCourseId}`
            : "/formations",
          completedCourses,
          progress,
        };
      });
    }
  }

  // Analytics Search
  if (searchData) {
    const counts = new Map<string, number>();
    for (const item of searchData) {
      if (!item.course_id) continue;
      counts.set(item.course_id, (counts.get(item.course_id) ?? 0) + 1);
    }

    const sortedIds = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    if (sortedIds.length > 0) {
      const { data: searchedCourses } = await supabase
        .from("courses")
        .select(
          "id, title, description, image_url, price, level, domain, practice_percentage",
        )
        .in("id", sortedIds)
        .eq("is_published", true);

      const map = new Map((searchedCourses ?? []).map((c) => [c.id, c]));
      mostSearchedCourses = sortedIds
        .map((id) => map.get(id))
        .filter((c): c is Course => Boolean(c))
        .slice(0, 10);
    }
  }

  return {
    watchlistCourses,
    becauseYouCompleted,
    becauseYouCompletedCourseTitle,
    enrollmentPaths,
    mostSearchedCourses,
  };
}

export async function getContinueLearning(
  userId: string,
): Promise<ContinueLearning[]> {
  const supabase = await createClient();

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, completed, progress_percentage, last_position, updated_at",
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (!progressRows || progressRows.length === 0) return [];

  const lessonIds = progressRows.map((r) => r.lesson_id).filter(Boolean);
  if (lessonIds.length === 0) return [];

  const { data: touchedLessons } = await supabase
    .from("lessons")
    .select("id, title, course_id, order_index")
    .in("id", lessonIds);

  if (!touchedLessons || touchedLessons.length === 0) return [];

  const courseIds = [
    ...new Set(touchedLessons.map((l) => l.course_id).filter(Boolean)),
  ];
  if (courseIds.length === 0) return [];

  const [{ data: courses }, { data: allLessons }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, image_url")
      .in("id", courseIds)
      .eq("is_published", true),
    supabase
      .from("lessons")
      .select("id, title, course_id, order_index")
      .in("course_id", courseIds)
      .order("order_index", { ascending: true }),
  ]);

  const courseMap = new Map((courses ?? []).map((c) => [c.id, c]));
  const progressMap = new Map(progressRows.map((r) => [r.lesson_id, r]));

  const lessonsByCourse = new Map<
    string,
    Array<{ id: string; title: string; course_id: string; order_index: number }>
  >();
  for (const l of allLessons ?? []) {
    if (!lessonsByCourse.has(l.course_id)) {
      lessonsByCourse.set(l.course_id, []);
    }
    lessonsByCourse.get(l.course_id)?.push(l);
  }

  const lessonToCourse = new Map(
    touchedLessons.map((l) => [l.id, l.course_id]),
  );
  const progressByCourse = new Map<string, typeof progressRows>();
  for (const r of progressRows) {
    const cId = lessonToCourse.get(r.lesson_id);
    if (cId) {
      if (!progressByCourse.has(cId)) {
        progressByCourse.set(cId, []);
      }
      progressByCourse.get(cId)?.push(r);
    }
  }

  const results: ContinueLearning[] = [];

  for (const courseId of courseIds) {
    const course = courseMap.get(courseId);
    const courseLessons = lessonsByCourse.get(courseId) ?? [];
    const courseProgressRows = progressByCourse.get(courseId) ?? [];

    if (
      !course ||
      courseLessons.length === 0 ||
      courseProgressRows.length === 0
    ) {
      continue;
    }

    const sortedCourseLessons = [...courseLessons].sort(
      (a, b) => a.order_index - b.order_index,
    );
    const totalLessons = sortedCourseLessons.length;

    const completedLessonIds = new Set(
      courseProgressRows
        .filter(
          (r) => Boolean(r.completed) || (r.progress_percentage ?? 0) >= 95,
        )
        .map((r) => r.lesson_id),
    );

    const isCourseCompleted =
      completedLessonIds.size >= totalLessons &&
      sortedCourseLessons.every((l) => completedLessonIds.has(l.id));

    const totalPercentage = Math.round(
      sortedCourseLessons.reduce((acc, l) => {
        const prog = progressMap.get(l.id);
        if (!prog) return acc;
        if (prog.completed) return acc + 100;
        return acc + (prog.progress_percentage ?? 0);
      }, 0) / totalLessons,
    );

    // Hide courses at 100%
    if (isCourseCompleted || totalPercentage >= 100) {
      continue;
    }

    const latestProgressRow = courseProgressRows[0];
    if (!latestProgressRow) continue;

    const activeLesson =
      sortedCourseLessons.find((l) => l.id === latestProgressRow.lesson_id) ??
      sortedCourseLessons[0];
    if (!activeLesson) continue;

    const lessonIndex =
      sortedCourseLessons.findIndex((l) => l.id === activeLesson.id) + 1;

    results.push({
      courseId: course.id,
      courseTitle: course.title,
      courseImage: course.image_url ?? null,
      lessonId: activeLesson.id,
      lessonTitle: activeLesson.title,
      lessonIndex,
      totalLessons,
      lessonPositionText: `Leçon ${lessonIndex}/${totalLessons}`,
      lastPosition: latestProgressRow.last_position ?? 0,
      progress: Math.min(99, Math.max(1, totalPercentage)),
      lastActivity: latestProgressRow.updated_at,
    });
  }

  results.sort((a, b) => {
    const timeA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
    const timeB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
    return timeB - timeA;
  });

  return results;
}
