"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { t } from "./i18n";
import type { Formation } from "./types";

interface FormationCurriculumProps {
  formation: Formation;
  locale: string;
}

// Bottom part of the card: the ordered list of courses/modules,
// each locked until the previous one is completed.
export default function FormationCurriculum({
  formation,
  locale,
}: FormationCurriculumProps) {
  return (
    <div className="border-t border-white/10 bg-black/40">
      <div className="px-7 py-4 flex items-center justify-between border-b border-white/5">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {t("curriculumTitle", locale)}
          </h4>
          <p className="text-[11px] text-white/40">
            {t("curriculumSubtitle", locale)}
          </p>
        </div>
        <span className="text-xs font-semibold text-white/50">
          {formation.courses.length} {t("modules", locale)}
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {formation.courses.map((course, index) => {
          const locked = index > 0 && !formation.courses[index - 1]?.completed;

          return (
            <div
              key={course.id}
              className={`flex items-center gap-4 px-7 py-4 transition ${
                locked ? "opacity-40" : "hover:bg-white/[0.03]"
              }`}
            >
              {/* Status Badge / Number */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  course.completed
                    ? "bg-brand/20 text-brand border border-brand/30"
                    : locked
                      ? "bg-white/5 text-white/30 border border-white/5"
                      : "bg-white/10 text-white border border-white/15"
                }`}
              >
                {course.completed ? (
                  <CheckCircle2 size={16} />
                ) : locked ? (
                  <Lock size={13} />
                ) : (
                  index + 1
                )}
              </div>

              {/* Course Info */}
              <div className="min-w-0 flex-1">
                <h5 className="truncate text-sm font-bold text-white">
                  {course.title}
                </h5>

                <p className="mt-0.5 truncate text-xs text-white/40">
                  {course.description || t("defaultModuleDesc", locale)}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">
                    {course.progress}%
                  </span>
                </div>
              </div>

              {/* Action CTA */}
              {locked ? (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/30">
                  <Lock size={12} />
                  <span>{t("locked", locale)}</span>
                </span>
              ) : (
                <Link
                  href={
                    course.nextLessonId
                      ? `/courses/${course.id}/lessons/${course.nextLessonId}`
                      : `/courses/${course.id}`
                  }
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    course.completed
                      ? "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      : "bg-brand text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(95,236,107,0.4)]"
                  }`}
                >
                  {course.completed
                    ? t("review", locale)
                    : course.progress > 0
                      ? t("continueArrow", locale)
                      : t("startArrow", locale)}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
