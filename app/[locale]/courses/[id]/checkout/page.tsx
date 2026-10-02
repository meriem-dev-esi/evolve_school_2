import {
  ArrowLeft,
  Award,
  Lock,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import CheckoutButton from "@/components/CheckoutButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "siteUi.checkout" });
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  return {
    title: course
      ? t("metaTitle", { title: course.title })
      : t("metaTitleFallback"),
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "siteUi.checkout" });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !course) {
    notFound();
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, payment_status")
    .eq("user_id", user.id)
    .eq("course_id", id)
    .maybeSingle();

  if (enrollment?.payment_status === "paid") {
    redirect(`/${locale}/courses/${id}`);
  }

  const coursePrice = Number(course.price) || 50;

  return (
    <div className="min-h-dvh bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 pt-28 pb-20 sm:px-6 relative overflow-hidden flex items-center justify-center">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-lime-300/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 end-10 h-[350px] w-[350px] rounded-full bg-emerald-400/10 blur-[120px]" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Back link */}
          <Link
            href={`/courses/${id}`}
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("back")}</span>
          </Link>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Header badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                {t("secure")}
              </span>

              <span className="text-2xl font-black text-brand font-mono">
                {coursePrice} DZD
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t("unlock")}
            </h1>

            <p className="mt-2 text-sm text-white/60">{course.title}</p>

            {/* Course inclusion summary */}
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/80">
              <p className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2">
                {t("includes")}
              </p>

              <div className="flex items-center gap-2.5">
                <Video className="h-4 w-4 text-brand shrink-0" />
                <span>{t("introLesson")}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{t("fullLesson")}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-yellow-400 shrink-0" />
                <span>{t("certificate")}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
                <span>{t("paymentMethods")}</span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
              <span className="text-white/60">{t("total")}</span>
              <span className="text-xl font-bold text-white font-mono">
                {coursePrice} DA
              </span>
            </div>

            {/* Checkout Action Button */}
            <CheckoutButton courseId={id} locale={locale} price={coursePrice} />

            <div className="mt-4 text-center">
              <p className="text-[11px] text-white/40 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-white/50" />
                <span>{t("secureTransaction")}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
