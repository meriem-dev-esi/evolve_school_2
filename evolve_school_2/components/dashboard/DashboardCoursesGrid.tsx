"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Play,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { EnrolledCourseItem } from "./types";

interface DashboardCoursesGridProps {
  locale: string;
  filteredCourses: EnrolledCourseItem[];
  totalCoursesCount: number;
  onOpenCertificate: (course: EnrolledCourseItem) => void;
}

/**
 * DashboardCoursesGrid renders the list of enrolled courses with progress bars,
 * badges, and direct action triggers (play lesson / open certificate).
 */
export default function DashboardCoursesGrid({
  locale,
  filteredCourses,
  totalCoursesCount,
  onOpenCertificate,
}: DashboardCoursesGridProps) {
  if (filteredCourses.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-50 border border-lime-100 text-lime-600">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">
          {totalCoursesCount === 0
            ? "Vous n'êtes inscrit à aucune formation pour le moment"
            : "Aucune formation ne correspond à votre recherche"}
        </h3>
        <p className="mt-2 max-w-md mx-auto text-xs text-gray-500">
          {totalCoursesCount === 0
            ? "Explorez nos cursus certifiants conçus par des experts du marché algérien et international."
            : "Modifiez vos filtres ou effectuez une recherche différente."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/${locale}/formations`}
            className="rounded-xl bg-lime-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow-sm shadow-lime-400/30"
          >
            Découvrir les formations
          </Link>
          <Link
            href={`/${locale}/ateliers`}
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            Voir les ateliers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredCourses.map((course) => (
        <div
          key={course.id}
          className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400 hover:shadow-xl hover:shadow-lime-400/20"
        >
          <div>
            {/* Cover Image & Category Badges */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lime-50 to-emerald-100 text-lime-500">
                  <Layers className="h-10 w-10" />
                </div>
              )}

              <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
                {course.domain && (
                  <span className="rounded-full bg-white/90 border border-white/60 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700 backdrop-blur-md shadow-sm">
                    {course.domain}
                  </span>
                )}
                {course.level && (
                  <span className="rounded-full bg-lime-500/90 border border-lime-400/40 px-2.5 py-0.5 text-[10px] font-bold text-black backdrop-blur-md shadow-sm">
                    {course.level}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 end-3">
                <span className="rounded-full bg-white/90 border border-white/60 px-2.5 py-0.5 text-[10px] font-mono text-gray-700 backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <Clock className="h-3 w-3 text-lime-600" />
                  {course.duration || "Formation certifiante"}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-lime-600 transition-colors line-clamp-1">
                {course.title}
              </h3>

              {course.description && (
                <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Progress bar */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-mono font-bold text-lime-700">
                    {course.progressPercentage}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      course.isCompleted
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-lime-400 to-emerald-500"
                    }`}
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    {course.completedLessons} / {course.totalLessons} leçons
                  </span>
                  {course.isCompleted && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Validé
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Actions */}
          <div className="p-6 pt-0 border-t border-gray-100 mt-4">
            {course.isCompleted ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCertificate(course)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-lime-200 bg-lime-50 py-2.5 text-xs font-bold text-lime-800 transition hover:bg-lime-100"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Attestation</span>
                </button>
                <Link
                  href={`/${locale}/courses/${course.id}`}
                  prefetch={true}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
                >
                  Revoir
                </Link>
              </div>
            ) : course.nextLesson ? (
              <Link
                href={`/${locale}/courses/${course.id}/lessons/${course.nextLesson.id}`}
                prefetch={true}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-2.5 text-xs font-bold text-black transition hover:bg-lime-300 active:scale-95 shadow-sm shadow-lime-400/30"
              >
                <Play className="h-3 w-3 fill-black" />
                <span>Continuer ({course.nextLesson.order_index})</span>
              </Link>
            ) : (
              <Link
                href={`/${locale}/courses/${course.id}`}
                prefetch={true}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition shadow-sm"
              >
                <span>Ouvrir le cours</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
