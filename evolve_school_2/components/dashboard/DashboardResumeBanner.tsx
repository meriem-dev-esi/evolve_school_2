"use client";

import { BookOpen, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { EnrolledCourseItem } from "./types";

interface DashboardResumeBannerProps {
  locale: string;
  resumeCourse: EnrolledCourseItem;
  onOpenCertificate: (course: EnrolledCourseItem) => void;
}

/**
 * DashboardResumeBanner highlights the last active course,
 * showing percentage completed, next lesson title, and action CTA.
 */
export default function DashboardResumeBanner({
  locale,
  resumeCourse,
  onOpenCertificate,
}: DashboardResumeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-lime-200 bg-gradient-to-r from-lime-50/70 via-white to-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative h-24 w-36 sm:h-28 sm:w-44 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
            {resumeCourse.image_url ? (
              <img
                src={resumeCourse.image_url}
                alt={resumeCourse.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-lime-50 text-lime-500">
                <BookOpen className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-black shadow-lg">
                <Play className="h-4 w-4 fill-black translate-x-0.5" />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-lime-100 border border-lime-200 px-2.5 py-0.5 text-[10px] font-bold text-lime-800 uppercase tracking-wider">
                En cours actuellement
              </span>
              {resumeCourse.domain && (
                <span className="rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] text-gray-600">
                  {resumeCourse.domain}
                </span>
              )}
            </div>

            <h2 className="mt-2 text-lg sm:text-xl font-bold text-gray-900 truncate">
              {resumeCourse.title}
            </h2>

            {resumeCourse.nextLesson ? (
              <p className="mt-1 text-xs text-gray-600 flex items-center gap-1.5 truncate">
                <span className="text-lime-700 font-semibold">
                  Leçon suivante :
                </span>
                <span className="truncate">
                  {resumeCourse.nextLesson.title}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                Toutes les leçons de ce cours ont été complétées avec succès !
              </p>
            )}

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${resumeCourse.progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-lime-700">
                {resumeCourse.progressPercentage}%
              </span>
              <span className="text-[11px] text-gray-400">
                ({resumeCourse.completedLessons}/{resumeCourse.totalLessons}{" "}
                leçons)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {resumeCourse.nextLesson ? (
            <Link
              href={`/${locale}/courses/${resumeCourse.id}/lessons/${resumeCourse.nextLesson.id}`}
              className="rounded-2xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-lime-300 active:scale-95 shadow-lg shadow-lime-400/30"
            >
              Continuer la leçon
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onOpenCertificate(resumeCourse)}
              className="rounded-2xl border border-lime-200 bg-lime-50 px-6 py-3 text-sm font-bold text-lime-800 transition-all hover:bg-lime-100"
            >
              Voir mon attestation 🎓
            </button>
          )}

          <Link
            href={`/${locale}/courses/${resumeCourse.id}`}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition shadow-sm"
          >
            Programme complet
          </Link>
        </div>
      </div>
    </section>
  );
}
