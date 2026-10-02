import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface CommunityHeaderProps {
  locale: string;
  totalCount: number;
  totalLikes?: number;
  totalComments?: number;
  totalCategories?: number;
}

/**
 * CommunityHeader displays the showcase title, mission subtext,
 * and dynamic real statistics from the platform.
 */
export default function CommunityHeader({
  locale,
  totalCount,
  totalLikes = 0,
  totalComments = 0,
  totalCategories = 0,
}: CommunityHeaderProps) {
  const t = useTranslations("community");
  const numberFormatLocale =
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US";

  return (
    <div className="border-b border-white/10 pb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          <Sparkles size={13} />
          {t("badge")}
        </span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        {t("title")}
      </h1>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
        {t("intro")}
      </p>

      {/* Community Stats Strip (Real platform data) */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-white">
            {new Intl.NumberFormat(numberFormatLocale).format(totalCount)}
          </div>
          <div className="text-[11px] text-white/50">{t("stats.projects")}</div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-brand">
            {totalLikes > 0
              ? `+${new Intl.NumberFormat(numberFormatLocale).format(totalLikes)}`
              : "0"}
          </div>
          <div className="text-[11px] text-white/50">{t("stats.likes")}</div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-sky-400">
            {new Intl.NumberFormat(numberFormatLocale).format(totalComments)}
          </div>
          <div className="text-[11px] text-white/50">{t("stats.comments")}</div>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10">
          <div className="text-lg font-black text-amber-400">
            {new Intl.NumberFormat(numberFormatLocale).format(totalCategories)}
          </div>
          <div className="text-[11px] text-white/50">
            {t("stats.categories")}
          </div>
        </div>
      </div>
    </div>
  );
}
