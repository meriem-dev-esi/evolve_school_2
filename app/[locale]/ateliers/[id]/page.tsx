import { ArrowLeft, Award, CheckCircle2, Clock3, Layers3 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type {
  WorkshopProjectItem,
  WorkshopVideoItem,
} from "@/components/workshop/types";
import WorkshopEnrolledView from "@/components/workshop/WorkshopEnrolledView";
import WorkshopIncludedFeatures from "@/components/workshop/WorkshopIncludedFeatures";
import { Link } from "@/i18n/navigation";
import {
  getWorkshopEnrollment,
  verifyChargilyWorkshopPayment,
} from "@/lib/data/workshop-enrollment";
import { createClient } from "@/lib/supabase/server";
import WorkshopJoinButton from "./WorkshopJoinButton";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams: Promise<{
    payment?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: workshop } = await supabase
    .from("workshops")
    .select("title, description, image_url, domain")
    .eq("id", id)
    .maybeSingle();

  if (!workshop) {
    return { title: "Atelier — Evolve Academy" };
  }

  return {
    title: `${workshop.title} — Evolve Academy`,
    description:
      workshop.description ||
      `Participez à l'atelier ${workshop.title} sur Evolve Academy.`,
    openGraph: {
      title: `${workshop.title} | Evolve Academy`,
      description: workshop.description || "Atelier pratique immersif.",
      images: workshop.image_url ? [{ url: workshop.image_url }] : [],
    },
  };
}

export default async function AtelierDetailPage({
  params,
  searchParams,
}: Props) {
  const { locale, id } = await params;
  const { payment } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ateliers.card" });
  const tPayment = await getTranslations({
    locale,
    namespace: "paymentStatus",
  });

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrollment = user
    ? await getWorkshopEnrollment(user.id, workshop.id)
    : null;
  let initialFeedback: string | null = null;

  if (
    payment === "success" &&
    user &&
    enrollment?.payment_status !== "paid" &&
    enrollment?.chargily_checkout_id
  ) {
    const verified = await verifyChargilyWorkshopPayment(
      user.id,
      workshop.id,
      enrollment.chargily_checkout_id,
    );
    if (verified) {
      enrollment = { ...enrollment, payment_status: "paid" };
    } else {
      initialFeedback = t("paymentPending");
    }
  } else if (payment === "success" && enrollment?.payment_status === "paid") {
    initialFeedback = t("alreadyJoined");
  } else if (payment === "success") {
    initialFeedback = t("paymentPending");
  } else if (payment === "failed") {
    initialFeedback = t("paymentFailed");
  }

  const isPaid = enrollment?.payment_status === "paid";

  let userName = "Étudiant Evolve";
  let videos: WorkshopVideoItem[] = [];
  let existingProject: WorkshopProjectItem | null = null;

  if (isPaid && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    userName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Étudiant Evolve";

    const { data: dbVideos } = await supabase
      .from("workshop_videos")
      .select("id, title, duration, order_index, video_url")
      .eq("workshop_id", id)
      .order("order_index", { ascending: true });

    videos = (dbVideos ?? []) as WorkshopVideoItem[];

    const { data: userProject } = await supabase
      .from("community_projects")
      .select(
        "id, title, description, image_url, github_url, demo_url, created_at",
      )
      .eq("user_id", user.id)
      .ilike("title", `%${workshop.title.slice(0, 12)}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    existingProject = userProject as WorkshopProjectItem | null;
  }

  const workshopItem = {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    image_url: workshop.image_url,
    duration: workshop.duration,
    level: workshop.level,
    domain: workshop.domain,
    price: Number(workshop.price ?? 0),
  };

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Link
            href="/ateliers"
            className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
            />
            <span>Retour aux ateliers</span>
          </Link>

          {payment === "success" && (
            <div
              className={`mb-8 flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium ${
                isPaid
                  ? "border-brand/40 bg-brand/10 text-brand"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-200"
              }`}
              role="status"
            >
              {isPaid && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              <span>
                {isPaid
                  ? tPayment("verified")
                  : tPayment("pendingVerification")}
              </span>
            </div>
          )}

          {isPaid && user ? (
            <WorkshopEnrolledView
              workshop={workshopItem}
              userName={userName}
              userId={user.id}
              enrolledAt={enrollment?.enrolled_at}
              videos={videos}
              existingProject={existingProject}
            />
          ) : (
            <>
              <div className="glass-card overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
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
                      isFree={isFree}
                      locale={locale}
                      joinLabel={t("join")}
                      isInitiallyJoined={false}
                      initialFeedback={initialFeedback}
                    />
                  </div>
                </div>
              </div>

              <WorkshopIncludedFeatures />
            </>
          )}
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
