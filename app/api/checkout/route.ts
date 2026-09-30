import { NextResponse } from "next/server";
import { getWorkshopEnrollment } from "@/lib/data/workshop-enrollment";
import { env } from "@/lib/env";
import { checkRateLimit, RATE_LIMIT_TIERS } from "@/lib/rateLimiter";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Spending safety cap
const MAX_TRANSACTION_AMOUNT_DZD = 50_000;
const MAX_DAILY_USER_SPENDING_DZD = 150_000;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentification requise pour effectuer un paiement." },
        { status: 401 },
      );
    }

    // Rate Limiting per user for checkout (10 requests per minute)
    const rateLimit = checkRateLimit(
      `checkout:${user.id}`,
      RATE_LIMIT_TIERS.CHECKOUT_PAYMENT.limit,
      RATE_LIMIT_TIERS.CHECKOUT_PAYMENT.windowMs,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives de paiement. Veuillez patienter avant de réessayer.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          },
        },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let courseId = "";
    let workshopId = "";
    let locale: string;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
      workshopId =
        typeof body.workshopId === "string" ? body.workshopId.trim() : "";
      locale = body.locale;
    } else {
      const formData = await request.formData();
      courseId = String(formData.get("courseId") || "");
      workshopId = String(formData.get("workshopId") || "");
      locale = String(formData.get("locale") || "");
    }

    if (Boolean(courseId) === Boolean(workshopId)) {
      return NextResponse.json(
        { error: "Un seul identifiant de cours ou d'atelier est requis." },
        { status: 400 },
      );
    }

    const isWorkshop = Boolean(workshopId);

    if (!locale) {
      locale = "fr";
    }
    if (!["fr", "en", "ar"].includes(locale)) {
      locale = "fr";
    }

    // 1. Prevent Duplicate Payment / Subscription
    let existingPaymentStatus: string | null = null;
    if (isWorkshop) {
      const existingEnrollment = await getWorkshopEnrollment(
        user.id,
        workshopId,
      );
      existingPaymentStatus = existingEnrollment?.payment_status ?? null;
    } else {
      const { data: existingEnrollment, error: enrollmentLookupError } =
        await supabase
          .from("enrollments")
          .select("id, payment_status")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();

      if (enrollmentLookupError) {
        console.error(
          "[Checkout] Unable to check existing enrollment:",
          enrollmentLookupError,
        );
        return NextResponse.json(
          { error: "Impossible de vérifier votre inscription." },
          { status: 500 },
        );
      }
      existingPaymentStatus = existingEnrollment?.payment_status ?? null;
    }

    if (existingPaymentStatus === "paid") {
      return NextResponse.json(
        {
          error: isWorkshop
            ? "Vous êtes déjà inscrit et avez déjà payé cet atelier."
            : "Vous êtes déjà inscrit et avez déjà payé ce cours.",
          alreadyEnrolled: true,
        },
        { status: 409 },
      );
    }

    const { data: course, error: courseError } = isWorkshop
      ? await supabase
          .from("workshops")
          .select("id, title, price")
          .eq("id", workshopId)
          .eq("is_published", true)
          .maybeSingle()
      : await supabase
          .from("courses")
          .select("id, title, price")
          .eq("id", courseId)
          .maybeSingle();

    if (courseError) {
      console.error("[Checkout] Unable to load purchasable item:", courseError);
      return NextResponse.json(
        { error: "Impossible de vérifier le cours ou l'atelier." },
        { status: 500 },
      );
    }
    if (!course) {
      return NextResponse.json(
        { error: isWorkshop ? "Atelier introuvable." : "Cours introuvable." },
        { status: 404 },
      );
    }

    if (!course.price || course.price <= 0) {
      return NextResponse.json(
        {
          error: isWorkshop
            ? "Prix de l'atelier invalide."
            : "Prix du cours invalide.",
        },
        { status: 400 },
      );
    }

    // 2. Spending Cap Validation
    if (course.price > MAX_TRANSACTION_AMOUNT_DZD) {
      return NextResponse.json(
        {
          error: `Le montant (${course.price} DZD) dépasse le plafond de sécurité autorisé par transaction (${MAX_TRANSACTION_AMOUNT_DZD} DZD).`,
        },
        { status: 400 },
      );
    }

    const adminSupabase = createAdminClient();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    const { data: recentPayments, error: recentPaymentsError } = await supabase
      .from("enrollments")
      .select("payment_amount")
      .eq("user_id", user.id)
      .eq("payment_status", "paid")
      .gte("enrolled_at", yesterday);

    if (recentPaymentsError) {
      console.error(
        "[Checkout] Unable to check daily course spend:",
        recentPaymentsError,
      );
      return NextResponse.json(
        { error: "Impossible de vérifier le plafond de paiement." },
        { status: 500 },
      );
    }

    const { data: recentWorkshopEnrollments, error: workshopPaymentsError } =
      await adminSupabase
        .from("workshop_enrollments")
        .select("workshop_id")
        .eq("user_id", user.id)
        .eq("payment_status", "paid")
        .not("chargily_checkout_id", "is", null)
        .gte("enrolled_at", yesterday);

    if (workshopPaymentsError) {
      console.error(
        "[Checkout] Unable to check daily workshop spend:",
        workshopPaymentsError,
      );
      return NextResponse.json(
        { error: "Impossible de vérifier le plafond de paiement." },
        { status: 500 },
      );
    }

    const workshopIds = (recentWorkshopEnrollments ?? []).map(
      (enrollment) => enrollment.workshop_id,
    );
    const { data: recentWorkshopItems, error: workshopPricesError } =
      workshopIds.length > 0
        ? await adminSupabase
            .from("workshops")
            .select("price")
            .in("id", workshopIds)
        : { data: [], error: null };

    if (workshopPricesError) {
      console.error(
        "[Checkout] Unable to load workshop prices for daily spend:",
        workshopPricesError,
      );
      return NextResponse.json(
        { error: "Impossible de vérifier le plafond de paiement." },
        { status: 500 },
      );
    }

    const dailyTotal =
      (recentPayments ?? []).reduce(
        (sum, p) => sum + (p.payment_amount || 0),
        0,
      ) +
      (recentWorkshopItems ?? []).reduce(
        (sum, workshop) => sum + (Number(workshop.price) || 0),
        0,
      );

    if (dailyTotal + course.price > MAX_DAILY_USER_SPENDING_DZD) {
      return NextResponse.json(
        {
          error: `Plafond de sécurité quotidien de dépenses atteint (${MAX_DAILY_USER_SPENDING_DZD} DZD sur 24h).`,
        },
        { status: 400 },
      );
    }

    const secretKey = env.chargilySecretKey;
    const apiUrl = env.chargilyApiUrl;

    if (!secretKey || !apiUrl) {
      return NextResponse.json(
        {
          error:
            "Le paiement en ligne n'est pas configuré. Veuillez réessayer plus tard.",
        },
        { status: 503 },
      );
    }

    // Handle timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const origin = new URL(request.url).origin;

    const checkoutResponse = await fetch(`${apiUrl}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        amount: course.price,
        currency: "dzd",
        locale: locale === "ar" || locale === "fr" ? locale : "en",
        description: course.title,
        success_url: isWorkshop
          ? `${origin}/${locale}/ateliers/${course.id}?payment=success`
          : `${origin}/${locale}/courses/${course.id}?payment=success`,
        failure_url: isWorkshop
          ? `${origin}/${locale}/ateliers/${course.id}?payment=failed`
          : `${origin}/${locale}/courses/${course.id}/checkout?payment=failed`,
        webhook_endpoint: `${env.appUrl || origin}/api/webhooks/chargily`,
        metadata: isWorkshop
          ? { user_id: user.id, workshop_id: course.id }
          : { user_id: user.id, course_id: course.id },
      }),
    });

    clearTimeout(timeoutId);

    const checkout = await checkoutResponse.json();

    // Logs the raw Chargily response
    console.log("CHARGILY RESPONSE:", JSON.stringify(checkout));

    if (!checkoutResponse.ok) {
      console.error("CHARGILY ERROR:", checkout);
      return NextResponse.json(
        { error: "Impossible d'initialiser le paiement avec le prestataire." },
        { status: checkoutResponse.status },
      );
    }

    if (!checkout.checkout_url) {
      console.error("CHARGILY: missing checkout_url in response", checkout);
      return NextResponse.json(
        { error: "Payment URL was not returned" },
        { status: 502 },
      );
    }

    // Pre-create enrollment with pending status using admin client
    const { error: enrollmentError } = isWorkshop
      ? await adminSupabase.from("workshop_enrollments").upsert(
          {
            user_id: user.id,
            workshop_id: course.id,
            payment_status: "pending",
            chargily_checkout_id: checkout.id,
            enrolled_at: new Date().toISOString(),
          },
          { onConflict: "user_id,workshop_id" },
        )
      : await adminSupabase.from("enrollments").upsert(
          {
            user_id: user.id,
            course_id: course.id,
            payment_status: "pending",
            payment_amount: course.price,
            payment_method: "chargily",
            chargily_checkout_id: checkout.id,
            enrolled_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" },
        );
    if (enrollmentError) {
      console.error(
        "[Checkout] Unable to persist pending enrollment:",
        enrollmentError,
      );
      return NextResponse.json(
        {
          error: isWorkshop
            ? "Impossible d'enregistrer votre inscription à l'atelier."
            : "Impossible d'enregistrer votre inscription au cours.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      checkout_url: checkout.checkout_url,
      checkout_id: checkout.id,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Délai d'attente dépassé vers le système de paiement (Timeout 10s).",
        },
        { status: 504 },
      );
    }

    console.error("[Checkout] Fatal API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors du traitement." },
      { status: 500 },
    );
  }
}
