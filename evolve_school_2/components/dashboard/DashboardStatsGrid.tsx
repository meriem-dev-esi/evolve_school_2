"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Zap,
} from "lucide-react";
import type { UserStats } from "./types";

interface DashboardStatsGridProps {
  stats: UserStats;
}

/**
 * DashboardStatsGrid presents gamified learning metrics:
 * enrolled courses, completed modules/hours, streak, and verified certificates.
 */
export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Metric 1: Formations */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-lime-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Formations</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-50 text-lime-600">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">
            {stats.totalCourses}
          </span>
          <span className="text-xs text-gray-400">inscrites</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-lime-700">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
          <span>
            {stats.inProgressCount} en cours · {stats.completedCount} validées
          </span>
        </div>
      </div>

      {/* Metric 2: Lessons & Hours */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Leçons Validées
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">
            {stats.totalLessonsCompleted}
          </span>
          <span className="text-xs text-gray-400">modules</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-500">
          <Clock className="h-3.5 w-3.5" />
          <span>~{stats.totalHoursEstimated}h de pratique acquise</span>
        </div>
      </div>

      {/* Metric 3: Streak */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Série d&apos;Assiduité
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">
            {stats.streakDays}
          </span>
          <span className="text-xs text-gray-400">jours consécutifs</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-500">
          <Zap className="h-3.5 w-3.5" />
          <span>Objectif hebdo atteint à 85% 🔥</span>
        </div>
      </div>

      {/* Metric 4: Certifications */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Attestations
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">
            {stats.certificatesEarned}
          </span>
          <span className="text-xs text-gray-400">obtenues</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Certificats certifiés Evolve</span>
        </div>
      </div>
    </section>
  );
}
