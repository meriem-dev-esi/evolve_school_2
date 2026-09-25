"use client";

import { MessageSquare, Share2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface DashboardCommunitySectionProps {
  locale: string;
}

/**
 * DashboardCommunitySection provides quick access banners to
 * direct mentor support and the student community showcase.
 */
export default function DashboardCommunitySection({
  locale,
}: DashboardCommunitySectionProps) {
  return (
    <section className="grid gap-6 md:grid-cols-2 mt-12">
      {/* Mentor direct contact */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-lime-300 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-50 text-lime-600 border border-lime-100">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">
              Besoin d&apos;aide sur un exercice ?
            </h4>
            <p className="text-xs text-gray-500">
              Vos formateurs et tuteurs sont connectés pour répondre à vos
              questions.
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-emerald-600 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Réponse moyenne : &lt; 2h
          </span>
          <Link
            href={`/${locale}/messages`}
            prefetch={true}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-lime-400 hover:border-lime-400 hover:text-black transition shadow-sm"
          >
            Ouvrir la messagerie
          </Link>
        </div>
      </div>

      {/* Community showcase */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-sky-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 border border-sky-100">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">
              Partagez vos réalisations
            </h4>
            <p className="text-xs text-gray-500">
              Publiez vos projets dans la Communauté Evolve et recueillez les
              avis de vos pairs.
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-sky-500">
            +350 projets partagés cette semaine
          </span>
          <Link
            href={`/${locale}/community`}
            prefetch={true}
            className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition shadow-sm"
          >
            Voir la communauté
          </Link>
        </div>
      </div>
    </section>
  );
}
