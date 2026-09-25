"use client";

import FormationCurriculum from "./Formationcurriculum";
import FormationHeader from "./Formationheader";
import type { Formation } from "./types";

interface FormationCardProps {
  formation: Formation;
  locale: string;
  isFormationCompleted: boolean;
}

/**
 * FormationCard renders a rich formation track card including
 * its cover banner, progression stats, and sequential module playlist.
 *
 * Split into:
 * - FormationHeader: image, badges, title, overall progress + CTA
 * - FormationCurriculum: the ordered list of courses/modules
 */
export default function FormationCard({
  formation,
  locale,
  isFormationCompleted,
}: FormationCardProps) {
  // Guard: avoid crashing if the caller passes an undefined formation
  // (e.g. data still loading, or a bad key in a .map()).
  if (!formation) {
    return null;
  }

  const formationProgress =
    formation.courses.length > 0
      ? Math.round(
          formation.courses.reduce(
            (total, course) => total + course.progress,
            0,
          ) / formation.courses.length,
        )
      : 0;

  const nextCourse =
    formation.courses.find((course) => !course.completed) ?? null;

  return (
    <article className="glass-card overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-brand/30">
      <FormationHeader
        formation={formation}
        locale={locale}
        isFormationCompleted={isFormationCompleted}
        formationProgress={formationProgress}
        nextCourse={nextCourse}
      />

      <FormationCurriculum formation={formation} locale={locale} />
    </article>
  );
}
