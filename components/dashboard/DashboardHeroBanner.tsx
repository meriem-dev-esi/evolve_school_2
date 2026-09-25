"use client";

import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { EnrolledCourseItem } from "./types";

interface DashboardHeroBannerProps {
  locale: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  userRole?: string | null;
  resumeCourse?: EnrolledCourseItem;
}

/**
 * DashboardHeroBanner displays student profile greeting, role badge,
 * and quick-action button to resume their next lesson.
 */
export default function DashboardHeroBanner({
  locale,
  userName,
  userEmail,
  userAvatar,
  userRole,
  resumeCourse,
}: DashboardHeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="absolute top-0 right-0 -me-20 -mt-20 h-80 w-80 rounded-full bg-lime-200 blur-3xl pointer-events-none opacity-35" />
      <div className="absolute bottom-0 left-1/3 -mb-20 h-60 w-60 rounded-full bg-emerald-200 blur-3xl pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-20 w-20 rounded-2xl border-2 border-lime-300 object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-lime-300 bg-gradient-to-tr from-lime-400 to-emerald-500 text-2xl font-bold text-black shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white">
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lime-200 bg-lime-50 px-3 py-0.5 text-[11px] font-semibold text-lime-800 tracking-wide">
                {userRole || "Étudiant Evolve"}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-500">
                {userEmail}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Ravi de vous revoir,{" "}
              <span className="text-lime-600">{userName}</span> 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Continuez votre parcours d&apos;excellence tech &amp; design au
              sein de la communauté algérienne.
            </p>
          </div>
        </div>

        {/* Quick Resume CTA */}
        {resumeCourse?.nextLesson && (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/${locale}/courses/${resumeCourse.id}/lessons/${resumeCourse.nextLesson.id}`}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-lime-400/30 transition-all duration-300 hover:bg-lime-300 hover:scale-[1.02] active:scale-95"
            >
              <Play className="h-4 w-4 fill-black transition-transform group-hover:scale-110" />
              <span>Reprendre ma leçon</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
