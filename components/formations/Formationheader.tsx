"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { t } from "./i18n";
import type { Formation } from "./types";

interface FormationHeaderProps {
  formation: Formation;
  locale: string;
  isFormationCompleted: boolean;
  formationProgress: number;
  nextCourse: Formation["courses"][number] | null;
}

// Top part of the card: cover image, badges, title, description
// and the overall track progress bar + CTA.
export default function FormationHeader({
  formation,
  locale,
  isFormationCompleted,
  formationProgress,
  nextCourse,
}: FormationHeaderProps) {
  return (
    <div className="grid md:grid-cols-[280px_1fr]">
      {/* Image */}
      <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950">
        {formation.image_url ? (
          <img
            src={formation.image_url}
            alt={formation.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <Layers3 size={54} className="text-brand/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
          {formation.domain && (
            <span className="rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
              {formation.domain}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-7 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {formation.level && (
              <span className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/80">
                <Award size={12} className="text-brand" />
                {formation.level}
              </span>
            )}

            {isFormationCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2.5 py-0.5 text-[10px] font-bold text-brand">
                <CheckCircle2 size={12} />
                {t("completed", locale)}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-extrabold text-white tracking-tight">
            {formation.title}
          </h3>

          {formation.description && (
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">
              {formation.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-brand" />
              {formation.courses.length} {t("courses", locale)}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-sky-400" />
              {t("fullTrack", locale)}
            </span>
          </div>
        </div>

        {/* Formation Progress & Action */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60 font-medium">
              {t("trackProgress", locale)}
            </span>
            <span className="font-extrabold text-brand">
              {formationProgress}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 shadow-[0_0_8px_rgba(95,236,107,0.5)] transition-all duration-500"
              style={{ width: `${formationProgress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-white/40">
              {formation.courses.filter((c) => c.completed).length} /{" "}
              {formation.courses.length} {t("completedModules", locale)}
            </span>

            {nextCourse && !isFormationCompleted && (
              <Link
                href={
                  nextCourse.nextLessonId
                    ? `/courses/${nextCourse.id}/lessons/${nextCourse.nextLessonId}`
                    : `/courses/${nextCourse.id}`
                }
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(95,236,107,0.5)]"
              >
                <span>
                  {nextCourse.progress > 0
                    ? t("continue", locale)
                    : t("start", locale)}
                </span>
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
