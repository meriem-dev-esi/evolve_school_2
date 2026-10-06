import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import HorizontalCourseSection from "@/components/HorizontalCourseSection";
import ContinueLearningSection from "@/components/home/ContinueLearningSection";
import EnrollmentPathSection from "@/components/home/EnrollmentPathSection";
import IntroGate from "@/components/IntroGate";
import IntroPreloader from "@/components/IntroPreloader";
import Navbar from "@/components/Navbar";
import {
  type ContinueLearning,
  type Course,
  type EnrollmentSeries,
  getContinueLearning,
  getHomePagePublicCourses,
  getUserDashboardData,
} from "@/lib/data/dashboard";
import { getRecommendedCourses } from "@/lib/data/recommendations";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations("home");
  const supabase = await createClient();

  let publicCourses = {
    beginnerCourses: [] as Course[],
    partnerCourses: [] as Course[],
    exclusiveCourses: [] as Course[],
    trendingCourses: [] as Course[],
    comingSoonCourses: [] as Course[],
  };
  let publicError: Error | null = null;

  const [publicRes, { data: authData }] = await Promise.all([
    getHomePagePublicCourses()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({ ok: false as const, error: err as Error })),
    supabase.auth.getUser(),
  ]);

  if (publicRes.ok) {
    publicCourses = publicRes.data;
  } else {
    publicError = publicRes.error;
  }

  const user = authData?.user ?? null;

  let recommendedCourses: Course[] = [];
  let watchlistCourses: Course[] = [];
  let becauseYouCompleted: Course[] = [];
  let becauseYouCompletedCourseTitle: string | null = null;
  let mostSearchedCourses: Course[] = [];
  let enrollmentPaths: EnrollmentSeries[] = [];
  let continueLearning: ContinueLearning[] = [];

  let recommendationsError: Error | null = null;
  let userDataError: Error | null = null;
  let continueDataError: Error | null = null;

  if (user) {
    const [recRes, userRes, contRes] = await Promise.allSettled([
      getRecommendedCourses(10),
      getUserDashboardData(user.id),
      getContinueLearning(user.id),
    ]);

    if (recRes.status === "fulfilled") {
      recommendedCourses = recRes.value.map((c) => ({
        ...c,
        price: null,
        practice_percentage: null,
      }));
    } else {
      recommendationsError =
        recRes.reason instanceof Error
          ? recRes.reason
          : new Error(String(recRes.reason));
    }

    if (userRes.status === "fulfilled") {
      watchlistCourses = userRes.value.watchlistCourses;
      becauseYouCompleted = userRes.value.becauseYouCompleted;
      becauseYouCompletedCourseTitle =
        userRes.value.becauseYouCompletedCourseTitle ?? null;
      enrollmentPaths = userRes.value.enrollmentPaths;
      mostSearchedCourses = userRes.value.mostSearchedCourses;
    } else {
      userDataError =
        userRes.reason instanceof Error
          ? userRes.reason
          : new Error(String(userRes.reason));
    }

    if (contRes.status === "fulfilled") {
      continueLearning = contRes.value;
    } else {
      continueDataError =
        contRes.reason instanceof Error
          ? contRes.reason
          : new Error(String(contRes.reason));
    }
  }

  return (
    <main className="min-h-dvh bg-transparent text-white">
      <IntroPreloader />

      <IntroGate>
        <Navbar />
        <Hero />
      </IntroGate>

      <div className="bg-transparent">
        {/* 1. RECOMMENDED FOR YOU */}
        <HorizontalCourseSection
          title={tHome("recommendedForYou")}
          courses={recommendedCourses}
          locale={locale}
          locked={!user}
          error={recommendationsError}
          emptyTitle={tHome("emptyStates.recommended.title")}
          emptyDescription={tHome("emptyStates.recommended.description")}
          emptyActionText={tHome("emptyStates.recommended.action")}
          emptyActionHref="/disciplines"
        />

        {/* 2. YOUR ENROLLMENT PATH */}
        <EnrollmentPathSection
          user={user}
          locale={locale}
          enrollmentPaths={enrollmentPaths}
          error={userDataError}
        />

        {/* 3. CONTINUE LEARNING */}
        <ContinueLearningSection
          user={user}
          locale={locale}
          continueLearning={continueLearning}
          error={continueDataError}
        />

        {/* 4. BECAUSE YOU COMPLETED */}
        {user && becauseYouCompleted.length > 0 && (
          <HorizontalCourseSection
            title={
              becauseYouCompletedCourseTitle
                ? `${tHome("becauseYouCompleted")} « ${becauseYouCompletedCourseTitle} »`
                : tHome("becauseYouCompleted")
            }
            courses={becauseYouCompleted}
            locale={locale}
            locked={false}
            error={userDataError}
            emptyTitle={tHome("emptyStates.becauseYouCompleted.title")}
            emptyDescription={tHome(
              "emptyStates.becauseYouCompleted.description",
            )}
            emptyActionText={tHome("emptyStates.becauseYouCompleted.action")}
            emptyActionHref="/formations"
          />
        )}

        {/* 5. BEGINNER STARTER PACK */}
        <HorizontalCourseSection
          title={tHome("beginnerStarterPack")}
          courses={publicCourses.beginnerCourses}
          locale={locale}
          error={publicError}
          emptyTitle={tHome("emptyStates.beginnerStarterPack.title")}
          emptyDescription={tHome(
            "emptyStates.beginnerStarterPack.description",
          )}
          emptyActionText={tHome("emptyStates.beginnerStarterPack.action")}
          emptyActionHref="/disciplines"
        />

        {/* 6. PARTNER COURSES ZONE */}
        <HorizontalCourseSection
          title={tHome("partnerCoursesZone")}
          courses={publicCourses.partnerCourses}
          locale={locale}
          error={publicError}
          emptyTitle={tHome("emptyStates.partnerCoursesZone.title")}
          emptyDescription={tHome("emptyStates.partnerCoursesZone.description")}
          emptyActionText={tHome("emptyStates.partnerCoursesZone.action")}
          emptyActionHref="/formations"
        />

        {/* 7. WATCHLIST */}
        <HorizontalCourseSection
          title={tHome("watchlist")}
          courses={watchlistCourses}
          locale={locale}
          locked={!user}
          error={userDataError}
          emptyTitle={tHome("emptyStates.watchlist.title")}
          emptyDescription={tHome("emptyStates.watchlist.description")}
          emptyActionText={tHome("emptyStates.watchlist.action")}
          emptyActionHref="/formations"
        />

        {/* 8. MOST SEARCHED THIS WEEK */}
        <HorizontalCourseSection
          title={tHome("mostSearchedThisWeek")}
          courses={mostSearchedCourses}
          locale={locale}
          locked={!user}
          error={userDataError}
          emptyTitle={tHome("emptyStates.mostSearchedThisWeek.title")}
          emptyDescription={tHome(
            "emptyStates.mostSearchedThisWeek.description",
          )}
          emptyActionText={tHome("emptyStates.mostSearchedThisWeek.action")}
          emptyActionHref="/formations"
        />

        {/* 9. EXCLUSIVE TO EVOLVE */}
        <HorizontalCourseSection
          title={tHome("exclusiveToEvolve")}
          courses={publicCourses.exclusiveCourses}
          locale={locale}
          error={publicError}
          emptyTitle={tHome("emptyStates.exclusiveToEvolve.title")}
          emptyDescription={tHome("emptyStates.exclusiveToEvolve.description")}
          emptyActionText={tHome("emptyStates.exclusiveToEvolve.action")}
          emptyActionHref="/formations"
        />

        {/* 10. TRENDING */}
        {publicCourses.trendingCourses.length > 0 && (
          <HorizontalCourseSection
            title={tHome("trending")}
            courses={publicCourses.trendingCourses}
            locale={locale}
            error={publicError}
            emptyTitle={tHome("emptyStates.trending.title")}
            emptyDescription={tHome("emptyStates.trending.description")}
            emptyActionText={tHome("emptyStates.trending.action")}
            emptyActionHref="/formations"
          />
        )}

        {/* 11. COMING SOON */}
        {publicCourses.comingSoonCourses.length > 0 && (
          <HorizontalCourseSection
            title={tHome("comingSoon")}
            courses={publicCourses.comingSoonCourses}
            locale={locale}
            error={publicError}
            emptyTitle={tHome("emptyStates.comingSoon.title")}
            emptyDescription={tHome("emptyStates.comingSoon.description")}
            emptyActionText={tHome("emptyStates.comingSoon.action")}
            emptyActionHref="/formations"
          />
        )}
      </div>
    </main>
  );
}
