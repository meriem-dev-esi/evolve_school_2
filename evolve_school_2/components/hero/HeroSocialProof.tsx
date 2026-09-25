import { CheckCircle2, Star } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * HeroSocialProof renders the social proof strip:
 * learner avatars, 4.9/5 star ratings, and hands-on project badges.
 */
export default function HeroSocialProof() {
  const tHero = useTranslations("hero");

  return (
    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs text-white/45">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5 rtl:space-x-reverse">
          <span className="inline-block h-6 w-6 rounded-full border-2 border-canvas bg-white/20 text-center text-xs font-bold leading-6 text-white">
            A
          </span>
          <span className="inline-block h-6 w-6 rounded-full border-2 border-canvas bg-white/30 text-center text-xs font-bold leading-6 text-white">
            M
          </span>
          <span className="inline-block h-6 w-6 rounded-full border-2 border-canvas bg-white/40 text-center text-xs font-bold leading-6 text-white">
            Y
          </span>
        </div>
        <span className="font-medium text-white/70">
          {tHero("learnersCount")}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-white/80">{tHero("rating")}</span>
        <span>{tHero("reviewsCount")}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-white/80" />
        <span>{tHero("practicalNotice")}</span>
      </div>
    </div>
  );
}
