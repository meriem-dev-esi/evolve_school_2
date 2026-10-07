"use client";

import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import HorizontalCourseSection from "@/components/HorizontalCourseSection";
import SectionEmptyState from "@/components/SectionEmptyState";
import SectionErrorState from "@/components/SectionErrorState";
import SeriesCard from "@/components/SeriesCard";
import type { EnrollmentSeries } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/client";

interface Props {
  user: unknown;
  locale: string;
  enrollmentPaths: EnrollmentSeries[];
  error?: Error | null;
}

export default function EnrollmentPathSection({
  user,
  locale,
  enrollmentPaths,
  error,
}: Props) {
  const tHome = useTranslations("home");
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const userId =
      user && typeof user === "object" && "id" in user
        ? (user.id as string)
        : null;

    if (!userId) return;

    const supabase = createClient();

    const refreshData = () => {
      startTransition(() => {
        router.refresh();
      });
    };

    const channel = supabase
      .channel(`user_progress_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lesson_progress",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refreshData();
        },
      )
      .subscribe();

    const onFocus = () => {
      refreshData();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      void supabase.removeChannel(channel);
      window.removeEventListener("focus", onFocus);
    };
  }, [user, router]);

  if (error) {
    return (
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-white md:text-2xl">
            {tHome("yourEnrollmentPath")}
          </h2>
          <SectionErrorState description={error.message} />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <HorizontalCourseSection
        title={tHome("yourEnrollmentPath")}
        courses={[]}
        locale={locale}
        locked={true}
      />
    );
  }

  if (enrollmentPaths.length === 0) {
    return (
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <GraduationCap className="h-5 w-5 text-brand" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {tHome("yourEnrollmentPath")}
            </h2>
          </div>
          <SectionEmptyState
            title={tHome("emptyStates.enrollmentPath.title")}
            description={tHome("emptyStates.enrollmentPath.description")}
            actionText={tHome("emptyStates.enrollmentPath.action")}
            actionHref="/formations"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <GraduationCap className="h-5 w-5 text-brand" />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {tHome("yourEnrollmentPath")}
            </h2>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
              {enrollmentPaths.length}
            </span>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {enrollmentPaths.map((series) => (
            <SeriesCard
              key={series.id}
              series={series}
              courseCount={series.courseIds.length}
              completedCourses={series.completedCourses}
              progress={series.progress}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
