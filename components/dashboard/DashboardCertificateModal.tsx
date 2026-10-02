"use client";

import { Award, Printer, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { EnrolledCourseItem } from "./types";

interface DashboardCertificateModalProps {
  course: EnrolledCourseItem;
  userName: string;
  onClose: () => void;
}

/**
 * DashboardCertificateModal renders the official verified completion certificate modal
 * with print & PDF generation options.
 */
export default function DashboardCertificateModal({
  course,
  userName,
  onClose,
}: DashboardCertificateModalProps) {
  const t = useTranslations("dashboardUi.certificateModal");
  const locale = useLocale();
  const handlePrintCertificate = () => {
    window.print();
  };

  const verificationCode = course.certificate?.verificationCode ?? "PENDING";
  const issuedDate = course.certificate?.issuedAt
    ? new Date(course.certificate.issuedAt).toLocaleDateString(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-lime-300 bg-white p-8 shadow-2xl text-gray-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 end-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label={t("close")}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b border-gray-200 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-1 text-xs font-bold text-lime-800 uppercase tracking-widest">
            <Award className="h-3.5 w-3.5" />
            {t("official")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            {t("title")}
          </h2>
          <p className="text-xs text-gray-500">{t("program")}</p>
        </div>

        {/* Certificate Body */}
        <div className="py-8 text-center space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("certifies")}
          </p>
          <h3 className="text-3xl font-extrabold text-lime-700 underline decoration-lime-300 underline-offset-8">
            {userName}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {t("completion")}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 max-w-lg mx-auto">
            <p className="text-lg font-bold text-gray-900">{course.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {course.domain || t("domain")} ·{" "}
              {t("lessons", { count: course.totalLessons })}
            </p>
          </div>
          {issuedDate && (
            <p className="text-[11px] text-gray-400">
              {t("issued", { date: issuedDate })}
            </p>
          )}
        </div>

        {/* Certificate Footer */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p className="font-mono text-[11px] text-gray-600">
              {t("verificationId", {
                code: verificationCode.toUpperCase(),
              })}
            </p>
            <p className="text-[10px] text-gray-400">{t("issuer")}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow-sm shadow-lime-400/30"
            >
              <Printer className="h-3.5 w-3.5" />
              {t("print")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
