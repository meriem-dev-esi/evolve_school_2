import {
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CourseDetail } from "./types";

interface CourseHeroHeaderProps {
  course: CourseDetail;
  totalLessons: number;
  completedLessons: number;
  courseProgress: number;
}

/**
 * CourseHeroHeader displays the course banner with certified badges,
 * title, description, aggregate progress bar, and direct instructor messaging link.
 */
export default function CourseHeroHeader({
  course,
  totalLessons,
  completedLessons,
  courseProgress,
}: CourseHeroHeaderProps) {
  return (
    <section className="mb-12">
      <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
        {/* Ambient radial glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-brand/10 blur-[80px]" />

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Formation Certifiante
          </span>
          {course.level && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {course.level}
            </span>
          )}
          {course.domain && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {course.domain}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          {course.title}
        </h1>

        {course.description && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
            {course.description}
          </p>
        )}

        {/* Meta stats & Mentor Contact */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-brand" />
              <span className="text-white font-bold">{totalLessons}</span>{" "}
              leçons
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-bold">
                {completedLessons}/{totalLessons}
              </span>{" "}
              complétées
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-sky-400" />
              <span className="text-brand font-extrabold">
                {courseProgress}%
              </span>{" "}
              complété
            </span>
          </div>

          <Link
            href={`/messages?recipient=teacher&course=${encodeURIComponent(
              course.title,
            )}`}
            className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-black hover:shadow-[0_0_15px_rgba(95,236,107,0.4)]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Contacter le formateur</span>
          </Link>
        </div>

        {/* Course Global Progress Bar */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-white/60 font-medium">
              Progression du cours
            </span>
            <span className="font-extrabold text-brand">{courseProgress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 shadow-[0_0_10px_rgba(95,236,107,0.5)] transition-all duration-700"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
