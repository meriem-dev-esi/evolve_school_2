"use client";

import { Award, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DashboardCertificateModal from "@/components/dashboard/DashboardCertificateModal";
import type {
  EnrolledCourseItem,
  WorkshopItem,
} from "@/components/dashboard/types";

interface WorkshopCertificateSectionProps {
  workshop: WorkshopItem;
  userName: string;
  userId: string;
  enrolledAt?: string | null;
  isFinished: boolean;
}

export default function WorkshopCertificateSection({
  workshop,
  userName,
  userId,
  enrolledAt,
  isFinished,
}: WorkshopCertificateSectionProps) {
  const t = useTranslations("ateliers.enrolled.certificate");
  const [isOpen, setIsOpen] = useState(false);

  const verificationCode = `ATELIER-${workshop.id.slice(0, 4)}-${
    userId ? userId.slice(0, 4) : "EV"
  }`.toUpperCase();

  const courseItem: EnrolledCourseItem = {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    image_url: workshop.image_url,
    domain: workshop.domain ?? "Atelier",
    level: workshop.level ?? "Pratique",
    duration: workshop.duration ?? null,
    totalLessons: 1,
    completedLessons: 1,
    progressPercentage: 100,
    isCompleted: true,
    certificate: {
      verificationCode,
      issuedAt: enrolledAt || new Date().toISOString(),
    },
  };

  if (!isFinished) {
    return (
      <section
        id="workshop-certificate"
        className="mb-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 backdrop-blur-md shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5" />
              <span>{t("lockedBadge")}</span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {t("lockedTitle")}
            </h2>

            <p className="max-w-2xl text-xs md:text-sm leading-relaxed text-white/50">
              {t("lockedDescription")}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white/40 cursor-not-allowed"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{t("lockedButton")}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="workshop-certificate"
        className="mb-12 overflow-hidden rounded-3xl border-2 border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-emerald-500/10 p-6 md:p-8 shadow-[0_0_50px_rgba(95,236,107,0.15)] relative"
      >
        <div className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/20 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("badge")}</span>
            </div>

            <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white md:text-3xl">
              <span>{t("title")}</span>
              <CheckCircle2 className="h-6 w-6 text-brand" />
            </h2>

            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              {t("description", { name: userName, title: workshop.title })}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-lime-300 shadow-[0_0_25px_rgba(95,236,107,0.4)]"
            >
              <Award className="h-4 w-4" />
              <span>{t("view")}</span>
            </button>
          </div>
        </div>
      </section>

      {isOpen && (
        <DashboardCertificateModal
          course={courseItem}
          userName={userName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
