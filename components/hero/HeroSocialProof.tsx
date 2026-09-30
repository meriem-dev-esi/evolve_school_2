import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HeroSocialProof() {
  const tHero = useTranslations("hero");

  return (
    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs text-white/45">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-white/80" />
        <span>{tHero("practicalNotice")}</span>
      </div>
    </div>
  );
}
