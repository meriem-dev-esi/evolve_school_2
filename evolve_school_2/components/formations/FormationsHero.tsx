import { Sparkles } from "lucide-react";

interface FormationsHeroProps {
  badge: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  showProgress: boolean;
  globalProgressText: string;
  globalProgress: number;
  completedCoursesCountText: string;
}

/**
 * FormationsHero renders the animated ambient banner for the catalog,
 * displaying page headline, subtext, and authenticated learner progress.
 */
export default function FormationsHero({
  badge,
  title,
  titleGradient,
  subtitle,
  showProgress,
  globalProgressText,
  globalProgress,
  completedCoursesCountText,
}: FormationsHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 px-6 py-16 lg:px-10">
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          {title} <span className="text-gradient-brand">{titleGradient}</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          {subtitle}
        </p>

        {/* User Learning Progress Card */}
        {showProgress && (
          <div className="glass-panel mt-8 max-w-xl rounded-2xl p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/70 font-medium">
                {globalProgressText}
              </span>
              <span className="font-extrabold text-brand">
                {globalProgress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 shadow-[0_0_10px_rgba(95,236,107,0.5)] transition-all duration-700"
                style={{ width: `${globalProgress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-white/40">
              {completedCoursesCountText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
