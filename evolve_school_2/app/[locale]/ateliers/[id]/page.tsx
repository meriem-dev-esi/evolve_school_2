import { ArrowLeft, Award, Clock3, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import WorkshopJoinButton from "./WorkshopJoinButton";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function AtelierDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ateliers.card" });

  const supabase = await createClient();

  const { data: workshop, error } = await supabase
    .from("workshops")
    .select("id, title, description, image_url, duration, level, domain, price")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !workshop) {
    notFound();
  }

  const isFree = Number(workshop.price ?? 0) === 0;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
          <Link
            href="/ateliers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            Retour
          </Link>

          <div className="glass-card mt-6 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
              {workshop.image_url ? (
                <img
                  src={workshop.image_url}
                  alt={workshop.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-white/20">
                  <Layers3 size={64} className="text-brand/20" />
                </div>
              )}
            </div>

            <div className="p-8">
              {workshop.domain && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  {workshop.domain}
                </span>
              )}

              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                {workshop.title}
              </h1>

              {workshop.description && (
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {workshop.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/60">
                {workshop.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={16} className="text-brand/70" />
                    {workshop.duration}
                  </span>
                )}
                {workshop.level && (
                  <span className="flex items-center gap-1.5">
                    <Award size={16} className="text-brand" />
                    {workshop.level}
                  </span>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-lg font-extrabold text-white">
                  {isFree ? (
                    <span className="text-brand">{t("free")}</span>
                  ) : (
                    `${new Intl.NumberFormat(locale).format(Number(workshop.price))} ${t("currency")}`
                  )}
                </span>

                <WorkshopJoinButton
                  workshopId={workshop.id}
                  workshopTitle={workshop.title}
                  price={Number(workshop.price ?? 0)}
                  isFree={isFree}
                  locale={locale}
                  joinLabel={t("join")}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
