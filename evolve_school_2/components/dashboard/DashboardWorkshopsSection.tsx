"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { WorkshopItem } from "./types";

interface DashboardWorkshopsSectionProps {
  locale: string;
  upcomingWorkshops: WorkshopItem[];
}

/**
 * DashboardWorkshopsSection displays workshops, masterclasses,
 * and quick-link reservations for the student.
 */
export default function DashboardWorkshopsSection({
  locale,
  upcomingWorkshops,
}: DashboardWorkshopsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Ateliers &amp; Masterclasses Disponibles
        </h3>
        <Link
          href={`/${locale}/ateliers`}
          prefetch={true}
          className="text-xs font-semibold text-lime-700 hover:underline flex items-center gap-1"
        >
          Voir tout le calendrier <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingWorkshops.map((workshop) => (
          <div
            key={workshop.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-lime-300 hover:shadow-lg transition-all"
          >
            <div>
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gray-100">
                {workshop.image_url ? (
                  <img
                    src={workshop.image_url}
                    alt={workshop.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sky-50 text-sky-400">
                    <Calendar className="h-8 w-8" />
                  </div>
                )}
                <span className="absolute top-2.5 start-2.5 rounded-full bg-white/90 border border-white/60 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700 backdrop-blur-md shadow-sm">
                  {workshop.domain || "Atelier Pratique"}
                </span>
              </div>

              <h4 className="mt-4 text-base font-bold text-gray-900">
                {workshop.title}
              </h4>

              {workshop.description && (
                <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
                  {workshop.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-lime-600" />{" "}
                  {workshop.duration || "Samedi 10h"}
                </span>
                <span className="font-mono font-bold text-lime-700">
                  {workshop.price
                    ? `${workshop.price.toLocaleString("fr-DZ")} DZD`
                    : "Inclus"}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              <Link
                href={`/${locale}/ateliers`}
                prefetch={true}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 hover:bg-lime-400 hover:border-lime-400 hover:text-black transition shadow-sm"
              >
                Réserver ma place
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
