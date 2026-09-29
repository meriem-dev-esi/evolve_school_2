// Icons used in the page (arrow, badge, clock, layers)
import { ArrowLeft, Award, Clock3, Layers3 } from "lucide-react";
// Function that renders the 404 page
import { notFound } from "next/navigation";
// next-intl helpers: get translations on the server + set the locale for this request
import { getTranslations, setRequestLocale } from "next-intl/server";
// Page footer component
import Footer from "@/components/Footer";
// Top navigation bar component
import Navbar from "@/components/Navbar";
// Locale-aware Link (adds the /fr, /ar... prefix automatically)
import { Link } from "@/i18n/navigation";
// Supabase client for server components
import { createClient } from "@/lib/supabase/server";
// Client component for the "Join" button (handles clicks/payment)
import WorkshopJoinButton from "./WorkshopJoinButton";

// Type of the props Next.js passes to the page
type Props = {
  // params is a Promise in recent Next.js versions
  params: Promise<{
    // Current language (e.g. "fr", "ar", "en")
    locale: string;
    // Workshop id taken from the URL /ateliers/[id]
    id: string;
  }>;
};

// Server component (async) : the workshop detail page
export default async function AtelierDetailPage({ params }: Props) {
  // Wait for params, then extract locale and id
  const { locale, id } = await params;
  // Tell next-intl which locale to use (needed for static rendering)
  setRequestLocale(locale);
  // Load translations from the "ateliers.card" namespace
  const t = await getTranslations({ locale, namespace: "ateliers.card" });

  // Create the Supabase client (awaited because it reads cookies)
  const supabase = await createClient();

  // Query the "workshops" table
  const { data: workshop, error } = await supabase
    .from("workshops")
    // Select only the columns we need
    .select("id, title, description, image_url, duration, level, domain, price")
    // Filter: the row with this id
    .eq("id", id)
    // Filter: only published workshops (hides drafts)
    .eq("is_published", true)
    // Expect exactly one row (error if 0 or many)
    .single();

  // If the query failed or nothing was found -> show 404
  if (error || !workshop) {
    notFound();
  }

  // Free if price is 0 (null/undefined treated as 0)
  const isFree = Number(workshop.price ?? 0) === 0;

  return (
    // Full-height column layout: navbar / content / footer
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      {/* Top navigation */}
      <Navbar />

      {/* Main content grows to fill space; pt-24 leaves room for the fixed navbar */}
      <main className="flex-1 pt-24">
        {/* Centered container with max width and padding */}
        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
          {/* Back link to the workshops list */}
          <Link
            // Destination: the workshops list page
            href="/ateliers"
            // Small inline link with hover color change
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
          >
            {/* Arrow icon; rotated 180° in RTL languages (Arabic) */}
            <ArrowLeft size={14} className="rtl:rotate-180" />
            {/* Link text ("Back") */}
            Retour
          </Link>

          {/* Glass-style card wrapping the workshop details */}
          <div className="glass-card mt-6 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            {/* Image area with a fixed 16:9 ratio */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
              {/* If the workshop has an image, show it... */}
              {workshop.image_url ? (
                <img
                  // Image URL from the database
                  src={workshop.image_url}
                  // Alt text for accessibility
                  alt={workshop.title}
                  // Fill the area and crop to cover
                  className="h-full w-full object-cover"
                />
              ) : (
                // ...otherwise show a placeholder with an icon
                <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-white/20">
                  {/* Placeholder icon */}
                  <Layers3 size={64} className="text-brand/20" />
                </div>
              )}
            </div>

            {/* Text content area */}
            <div className="p-8">
              {/* Show the domain badge only if a domain exists */}
              {workshop.domain && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  {/* Domain name (e.g. "Web", "AI") */}
                  {workshop.domain}
                </span>
              )}

              {/* Workshop title */}
              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                {workshop.title}
              </h1>

              {/* Description, only if provided */}
              {workshop.description && (
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {workshop.description}
                </p>
              )}

              {/* Row of metadata: duration and level */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/60">
                {/* Duration, only if provided */}
                {workshop.duration && (
                  <span className="flex items-center gap-1.5">
                    {/* Clock icon */}
                    <Clock3 size={16} className="text-brand/70" />
                    {/* Duration value */}
                    {workshop.duration}
                  </span>
                )}
                {/* Level, only if provided */}
                {workshop.level && (
                  <span className="flex items-center gap-1.5">
                    {/* Award icon */}
                    <Award size={16} className="text-brand" />
                    {/* Level value (beginner, advanced...) */}
                    {workshop.level}
                  </span>
                )}
              </div>

              {/* Footer of the card: price on one side, join button on the other */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                {/* Price display */}
                <span className="text-lg font-extrabold text-white">
                  {/* If free, show the translated "Free" label */}
                  {isFree ? (
                    <span className="text-brand">{t("free")}</span>
                  ) : (
                    // Otherwise format the number for the locale + translated currency
                    `${new Intl.NumberFormat(locale).format(Number(workshop.price))} ${t("currency")}`
                  )}
                </span>

                {/* Client-side button that handles joining/paying */}
                <WorkshopJoinButton
                  // Workshop id
                  workshopId={workshop.id}
                  // Title (e.g. for confirmation/payment label)
                  workshopTitle={workshop.title}
                  // Price as a number (0 if missing)
                  price={Number(workshop.price ?? 0)}
                  // Whether the workshop is free
                  isFree={isFree}
                  // Current locale
                  locale={locale}
                  // Translated button label
                  joinLabel={t("join")}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Page footer */}
      <Footer locale={locale} />
    </div>
  );
}