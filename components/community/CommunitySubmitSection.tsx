import { getTranslations } from "next-intl/server";
import SubmitProjectForm from "@/app/[locale]/community/SubmitProjectForm";

interface CommunitySubmitSectionProps {
  locale: string;
}

/**
 * CommunitySubmitSection renders the creator call-to-action banner
 * containing the interactive project submission form.
 */
export default async function CommunitySubmitSection({
  locale,
}: CommunitySubmitSectionProps) {
  const t = await getTranslations({ locale, namespace: "community" });

  return (
    <section className="mt-12 glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-[80px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            {t("submit.eyebrow")}
          </span>
        </div>

        <h2 className="mt-2 text-2xl font-bold text-white tracking-tight">
          {t("submit.title")}
        </h2>

        <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/60">
          {t("submit.description")}
        </p>

        <div className="mt-6 max-w-3xl">
          <SubmitProjectForm />
        </div>
      </div>
    </section>
  );
}
