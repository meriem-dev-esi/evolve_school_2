"use client";

import { useState } from "react";
import { ArrowUpRight, Award, BookOpen, Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  level: string | null;
  domain: string | null;
  practice_percentage: number | null;
  is_coming_soon?: boolean | null;
  release_date?: string | null;
};

type Props = {
  course: Course;
  locale: string;
};

const isPlaceholderDescription = (desc: string | null | undefined) => {
  if (!desc || !desc.trim()) return true;
  const lower = desc.trim().toLowerCase();
  return (
    lower.startsWith("description complète du cours") ||
    lower.startsWith("description complete du cours") ||
    lower.startsWith("complete description of the course") ||
    lower === "description" ||
    lower === "no description"
  );
};

export default function CourseCard({ course, locale }: Props) {
  const t = useTranslations("courseCard");
  const [imgError, setImgError] = useState(false);
  const isFree = !course.price || course.price === 0;
  const showFallbackImage = !course.image_url || imgError;

  return (
    <article className="group relative w-[310px] shrink-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-zinc-950 shadow-[0_16px_48px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-2 hover:border-brand/50 hover:shadow-[0_24px_56px_rgba(132,204,22,0.16)]">
      <div className="pointer-events-none absolute -end-16 -top-16 z-10 h-40 w-40 rounded-full bg-brand/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <Link
        href={`/courses/${course.id}`}
        prefetch={true}
        className="relative block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
      >
        <div className="relative h-48 w-full overflow-hidden bg-zinc-800">
          {!showFallbackImage && course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden course-card-fallback-gradient text-xs font-medium text-white/70">
              <div className="absolute h-36 w-36 rounded-full border border-brand/20" />
              <div className="absolute h-24 w-24 rounded-full border border-brand/20" />
              <BookOpen className="relative h-10 w-10 text-brand/90" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/5 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            {course.domain && (
              <span className="max-w-[68%] truncate rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg backdrop-blur-xl">
                {course.domain}
              </span>
            )}

            {course.practice_percentage !== null &&
              course.practice_percentage > 0 && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand/40 bg-zinc-950/75 px-2.5 py-1.5 text-[10px] font-bold text-brand shadow-lg backdrop-blur-xl">
                  <Zap className="h-3 w-3 fill-black" />
                  {course.practice_percentage}% {t("practice")}
                </span>
              )}
          </div>

          {course.level && (
            <div className="absolute bottom-4 start-4">
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-xl">
                <Award className="h-3.5 w-3.5 text-brand" />
                {course.level}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-h-[190px] flex-col p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-black">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="line-clamp-2 min-h-12 flex-1 text-[15px] font-bold leading-6 text-white transition-colors duration-200 group-hover:text-brand">
              {course.title}
            </h3>
          </div>

          {!isPlaceholderDescription(course.description) && (
            <p className="mt-3 line-clamp-2 min-h-9 text-xs leading-relaxed text-white/55">
              {course.description}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
            {course.is_coming_soon ? (
              <>
                <div>
                  <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {course.release_date
                      ? locale === "ar"
                        ? "تاريخ الإصدار"
                        : "Date de sortie"
                      : locale === "ar"
                        ? "الحالة"
                        : "Statut"}
                  </span>
                  <span className="text-xs font-semibold text-white/70">
                    {course.release_date
                      ? new Date(course.release_date).toLocaleDateString(
                          locale === "ar"
                            ? "ar-DZ"
                            : locale === "en"
                              ? "en-US"
                              : "fr-DZ",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : locale === "ar"
                        ? "قريباً"
                        : locale === "en"
                          ? "Coming Soon"
                          : "Bientôt disponible"}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/40 bg-lime-400/10 px-3.5 py-2 text-[10px] font-bold text-lime-400 shadow-sm">
                  <Clock className="h-3.5 w-3.5 text-lime-400" />
                  <span>
                    {locale === "ar"
                      ? "قريباً"
                      : locale === "en"
                        ? "Coming Soon"
                        : "Bientôt"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <div>
                  <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {t("priceLabel")}
                  </span>
                  <span className="text-base font-extrabold text-white">
                    {isFree ? (
                      <span className="text-brand">{t("free")}</span>
                    ) : (
                      `${course.price?.toLocaleString(locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ")} DA`
                    )}
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-2 text-[10px] font-bold text-brand transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-black">
                  {t("discoverCourse")}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
