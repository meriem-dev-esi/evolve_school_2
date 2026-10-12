import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const secretKey = env.chargilySecretKey;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Chargily configuration is missing" },
        { status: 500 },
      );
    }

    const body = await request.text();

    const signature = request.headers.get("signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(body)
      .digest("hex");

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);

    const checkout = payload.data ?? payload;

    if (["failed", "canceled", "expired"].includes(checkout.status)) {
      const failedClient = createAdminClient();
      await Promise.all([
        failedClient
          .from("enrollments")
          .update({ payment_status: "failed" })
          .eq("chargily_checkout_id", checkout.id)
          .neq("payment_status", "paid"),
        failedClient
          .from("workshop_enrollments")
          .update({ payment_status: "failed" })
          .eq("chargily_checkout_id", checkout.id)
          .neq("payment_status", "paid"),
      ]);
      return NextResponse.json({ received: true, status: checkout.status });
    }

    if (checkout.status !== "paid") {
      return NextResponse.json({
        received: true,
        status: checkout.status,
      });
    }

    const checkoutId = checkout.id;

    if (typeof checkoutId !== "string" || !checkoutId) {
      return NextResponse.json(
        { error: "Checkout ID missing" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // 1. Journalisation d'audit de l'événement webhook (non-bloquant)
    try {
      await supabase.from("chargily_webhook_events").insert({
        event_type: payload.event_type ?? payload.type ?? "checkout_update",
        checkout_id: checkoutId,
        amount_received: checkout.amount,
        currency: checkout.currency ?? "dzd",
        status: checkout.status,
        signature_verified: true,
        raw_payload: payload,
      });
    } catch (auditErr) {
      console.warn(
        "[Webhook Audit] Notice: unable to log webhook event:",
        auditErr,
      );
    }

    const providerPaidAt = checkout.paid_at ?? checkout.updated_at;
    const paidAt =
      typeof providerPaidAt === "string" &&
      Number.isFinite(Date.parse(providerPaidAt))
        ? new Date(providerPaidAt).toISOString()
        : new Date().toISOString();

    // Vérification de sécurité du montant payé
    const { data: existingCourseEnrollment } = await supabase
      .from("enrollments")
      .select("id, payment_amount")
      .eq("chargily_checkout_id", checkoutId)
      .maybeSingle();

    if (
      existingCourseEnrollment?.payment_amount &&
      Number(checkout.amount) < Number(existingCourseEnrollment.payment_amount)
    ) {
      console.error(
        `[Webhook Fraud Alert] Montant reçu (${checkout.amount}) inférieur au tarif attendu (${existingCourseEnrollment.payment_amount})`,
      );
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 },
      );
    }

    const [courseResult, workshopResult] = await Promise.all([
      supabase
        .from("enrollments")
        .update({ payment_status: "paid", paid_at: paidAt })
        .eq("chargily_checkout_id", checkoutId)
        .select("id"),
      supabase
        .from("workshop_enrollments")
        .update({ payment_status: "paid", paid_at: paidAt })
        .eq("chargily_checkout_id", checkoutId)
        .select("id"),
    ]);

    const matchedEnrollment =
      (courseResult.data?.length ?? 0) > 0 ||
      (workshopResult.data?.length ?? 0) > 0;
    if (!matchedEnrollment) {
      if (courseResult.error || workshopResult.error) {
        console.error(
          "Enrollment update errors:",
          courseResult.error,
          workshopResult.error,
        );
        return NextResponse.json(
          { error: "Unable to update enrollment" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      received: true,
      paid: true,
    });
  } catch (error) {
    console.error("Chargily webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
