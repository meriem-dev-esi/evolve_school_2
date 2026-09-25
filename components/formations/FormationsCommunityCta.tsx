import { ArrowRight, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface FormationsCommunityCtaProps {
  communityLabel: string;
  locale: string;
}

// Bandeau en bas de la page /formations invitant à rejoindre la communauté.
export default function FormationsCommunityCta({
  communityLabel,
  locale,
}: FormationsCommunityCtaProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 border border-brand/30 text-brand">
          <Users size={22} />
        </span>

        <p className="max-w-xl text-sm text-white/60">
          {locale === "ar"
            ? "انضم إلى مجتمعنا للتواصل مع متعلمين آخرين وتبادل الخبرات."
            : locale === "en"
              ? "Join our community to connect with other learners and share experiences."
              : "Rejoignez notre communauté pour échanger avec d'autres apprenants."}
        </p>

        <Link
          href="/community"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(95,236,107,0.5)]"
        >
          <span>{communityLabel}</span>
          <ArrowRight size={16} className="rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
