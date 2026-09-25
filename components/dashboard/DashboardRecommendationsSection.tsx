"use client";

import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { EnrolledCourseItem } from "./types";

interface DashboardRecommendationsSectionProps {
  locale: string;
  recommendedCourses: EnrolledCourseItem[];
}

/**
 * DashboardRecommendationsSection displays curated next courses
 * to help students deepen their expertise.
 */
export default function DashboardRecommendationsSection({
  locale,
  recommendedCourses,
}: DashboardRecommendationsSectionProps) {
  if (recommendedCourses.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-lime-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-lime-700">
              Progression continue
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            Recommandé pour approfondir vos compétences
          </h3>
        </div>

        <Link
          href={`/${locale}/formations`}
          prefetch={true}
          className="text-xs font-semibold text-gray-500 hover:text-lime-600 transition flex items-center gap-1"
        >
          Consulter tout le catalogue <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {recommendedCourses.map((rec) => (
          <div
            key={rec.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:border-lime-300 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gray-100">
                {rec.image_url ? (
                  <img
                    src={rec.image_url}
                    alt={rec.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-lime-50 text-lime-500">
                    <BookOpen className="h-8 w-8" />
                  </div>
                )}
                {rec.domain && (
                  <span className="absolute top-2.5 start-2.5 rounded-full bg-white/90 border border-white/60 px-2.5 py-0.5 text-[10px] text-gray-700 backdrop-blur-md shadow-sm">
                    {rec.domain}
                  </span>
                )}
              </div>

              <h4 className="mt-4 text-base font-bold text-gray-900 line-clamp-1">
                {rec.title}
              </h4>

              {rec.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {rec.description}
                </p>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              <Link
                href={`/${locale}/courses/${rec.id}`}
                prefetch={true}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 hover:bg-lime-400 hover:border-lime-400 hover:text-black transition shadow-sm"
              >
                Découvrir le cursus
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
