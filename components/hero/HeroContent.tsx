import { ArrowRight, Award, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroSocialProof from "./HeroSocialProof";
import SaveCourseButton from "./SaveCourseButton";
import type { HeroCourse } from "./types";

interface HeroContentProps {
  course: HeroCourse;
  locale: string;
}

/**
 * HeroContent displays active course title, metadata badges,
 * CTA buttons to start course / view catalog, and the social proof strip.
 */
export default function HeroContent({ course, locale }: HeroContentProps) {
  const tHero = useTranslations("hero");

  return (
    <div className="lg:col-span-7">
      {/* Category Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          {tHero("certifiedBadge")}
        </span>

        {course.type && (
          <span className="text-xs font-medium uppercase tracking-widest text-white/40">
            {course.type}
          </span>
        )}
      </div>

      {/* Headline */}
      <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {course.title}
      </h1>

      {/* Description */}
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
        {course.description || tHero("defaultDescription")}
      </p>

      {/* Metadata */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium">
        {course.level && (
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-white/70">
            <Award className="h-3.5 w-3.5 text-white/70" />
            {course.level}
          </span>
        )}

        {course.duration && (
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-white/70">
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            {course.duration}
          </span>
        )}

        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-bold text-white">
          {course.price && course.price > 0
            ? `${course.price.toLocaleString(
                locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ",
              )} DA`
            : tHero("free")}
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href={`/courses/${course.id}`}
          className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-xl hover:shadow-white/10 active:scale-95"
        >
          <span>{tHero("startNow")}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>

        <SaveCourseButton courseId={course.id} />
      </div>

      {/* Social proof strip */}
      <HeroSocialProof />
    </div>
  );
}
