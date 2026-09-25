import { Sparkles } from "lucide-react";

interface CommunityHeaderProps {
  totalCount: number;
}

/**
 * CommunityHeader displays the showcase title, mission subtext,
 * and key metric statistics badges.
 */
export default function CommunityHeader({ totalCount }: CommunityHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          <Sparkles size={13} />
          Showcase Créatif & Tech
        </span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        La Communauté <span className="text-gradient-brand">Evolve</span>
      </h1>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
        Explorez les réalisations, portfolios, applications et designs créés par
        les talents de l'académie en Algérie.
      </p>

      {/* Community Stats Strip */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-white">{totalCount}+</div>
          <div className="text-[11px] text-white/50">Projets publiés</div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-brand">+1 200</div>
          <div className="text-[11px] text-white/50">Retours & feedbacks</div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-sky-400">95%</div>
          <div className="text-[11px] text-white/50">
            Insertion professionnelle
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-amber-400">Top 10</div>
          <div className="text-[11px] text-white/50">Projets du mois</div>
        </div>
      </div>
    </div>
  );
}
