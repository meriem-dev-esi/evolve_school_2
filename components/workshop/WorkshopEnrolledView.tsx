"use client";

import { Clock3, Layers3, MessageSquare, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { WorkshopItem } from "@/components/dashboard/types";
import { Link } from "@/i18n/navigation";
import type { WorkshopProjectItem, WorkshopVideoItem } from "./types";
import WorkshopCertificateSection from "./WorkshopCertificateSection";
import WorkshopProjectSubmission from "./WorkshopProjectSubmission";
import WorkshopVideoPlayer from "./WorkshopVideoPlayer";

interface WorkshopEnrolledViewProps {
  workshop: WorkshopItem;
  userName: string;
  userId: string;
  enrolledAt?: string | null;
  videos: WorkshopVideoItem[];
  existingProject?: WorkshopProjectItem | null;
}

export default function WorkshopEnrolledView({
  workshop,
  userName,
  userId,
  enrolledAt,
  videos,
  existingProject,
}: WorkshopEnrolledViewProps) {
  const t = useTranslations("ateliers.enrolled");

  return (
    <div className="space-y-10">
      {/* Workshop Hero Header */}
      <section className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="pointer-events-none absolute -end-12 -top-12 h-64 w-64 rounded-full bg-brand/10 blur-[80px]" />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            {t("enrolledBadge")}
          </span>
          {workshop.domain && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {workshop.domain}
            </span>
          )}
          {workshop.level && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {workshop.level}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          {workshop.title}
        </h1>

        {workshop.description && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
            {workshop.description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/60">
            {workshop.duration && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-brand" />
                <span className="text-white font-bold">
                  {workshop.duration}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Layers3 className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-bold">{t("handsOnFormat")}</span>
            </span>
          </div>

          <Link
            href={`/messages?workshop=${encodeURIComponent(workshop.title)}`}
            className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-black shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{t("contactMentor")}</span>
          </Link>
        </div>
      </section>

      {/* 1. Official Workshop Certificate */}
      <WorkshopCertificateSection
        workshop={workshop}
        userName={userName}
        userId={userId}
        enrolledAt={enrolledAt}
      />

      {/* 2. Workshop Video / Stream Player */}
      <WorkshopVideoPlayer
        videos={videos}
        workshopTitle={workshop.title}
        fallbackImageUrl={workshop.image_url}
      />

      {/* 3. Practical Project Submission */}
      <WorkshopProjectSubmission
        workshopId={workshop.id}
        workshopTitle={workshop.title}
        workshopDomain={workshop.domain}
        existingProject={existingProject}
        userId={userId}
      />
    </div>
  );
}
