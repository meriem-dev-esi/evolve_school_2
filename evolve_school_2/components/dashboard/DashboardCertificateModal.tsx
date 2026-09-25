"use client";

import { Award, Printer, X } from "lucide-react";
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
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-lime-300 bg-white p-8 shadow-2xl text-gray-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 end-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b border-gray-200 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-1 text-xs font-bold text-lime-800 uppercase tracking-widest">
            <Award className="h-3.5 w-3.5" />
            Certificat Officiel Evolve Academy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Attestation d&apos;Accomplissement
          </h2>
          <p className="text-xs text-gray-500">
            Programme de formation certifiant · Evolve Academy Algérie
          </p>
        </div>

        {/* Certificate Body */}
        <div className="py-8 text-center space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ce certificat atteste que
          </p>
          <h3 className="text-3xl font-extrabold text-lime-700 underline decoration-lime-300 underline-offset-8">
            {userName}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            a complété avec succès 100% du cursus d&apos;apprentissage intensif
            et validé l&apos;ensemble des modules pratiques de :
          </p>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 max-w-lg mx-auto">
            <p className="text-lg font-bold text-gray-900">{course.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {course.domain || "Technologie & Design"} · {course.totalLessons}{" "}
              leçons validées
            </p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p className="font-mono text-[11px] text-gray-600">
              ID de vérification : EVOLVE-
              {course.id.substring(0, 8).toUpperCase()}-
              {Math.floor(Date.now() / 1000000)}
            </p>
            <p className="text-[10px] text-gray-400">
              Délivré par le Comité Académique Evolve Alger
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow-sm shadow-lime-400/30"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimer / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
