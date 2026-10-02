"use client";

import { Award, CheckCircle2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DashboardCertificateModal from "@/components/dashboard/DashboardCertificateModal";
import type { EnrolledCourseItem } from "@/components/dashboard/types";

interface CourseCertificateSectionProps {
  courseItem: EnrolledCourseItem;
  userName: string;
  autoOpen?: boolean;
}

export default function CourseCertificateSection({
  courseItem,
  userName,
  autoOpen = false,
}: CourseCertificateSectionProps) {
  const t = useTranslations("courseUi.certificate");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  if (!courseItem.isCompleted) {
    return null;
  }

  return (
    <>
      <section className="mb-10 overflow-hidden rounded-3xl border-2 border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-emerald-500/10 p-6 md:p-8 shadow-[0_0_50px_rgba(95,236,107,0.15)] relative">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/20 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("badge")}</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl flex items-center gap-2.5">
              <span>{t("title")}</span>
              <CheckCircle2 className="h-6 w-6 text-brand" />
            </h2>

            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              {t("description", { name: userName })}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
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
