import "server-only";

import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export interface WorkshopEnrollment {
  id: string;
  payment_status: string;
  chargily_checkout_id: string | null;
  enrolled_at?: string | null;
}

export async function getWorkshopEnrollment(
  userId: string,
  workshopId: string,
): Promise<WorkshopEnrollment | null> {
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from("workshop_enrollments")
    .select("id, payment_status, chargily_checkout_id, enrolled_at")
    .eq("user_id", userId)
    .eq("workshop_id", workshopId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load workshop enrollment: ${error.message}`);
  }

  return data;
}

export async function enrollInFreeWorkshop(
  userId: string,
  workshopId: string,
): Promise<void> {
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("workshop_enrollments").upsert(
    {
      user_id: userId,
      workshop_id: workshopId,
      payment_status: "paid",
      chargily_checkout_id: null,
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: "user_id,workshop_id" },
  );

  if (error) {
    throw new Error(`Unable to save workshop enrollment: ${error.message}`);
  }
}

export async function verifyChargilyWorkshopPayment(
  userId: string,
  workshopId: string,
  checkoutId: string,
): Promise<boolean> {
  try {
    if (!env.chargilySecretKey || !checkoutId) return false;

    const response = await fetch(
      `${env.chargilyApiUrl}/checkouts/${encodeURIComponent(checkoutId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.chargilySecretKey}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) return false;

    const checkout = await response.json();
    if (checkout.status !== "paid") return false;

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("workshop_enrollments")
      .update({ payment_status: "paid" })
      .eq("user_id", userId)
      .eq("workshop_id", workshopId)
      .eq("chargily_checkout_id", checkoutId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(
        "[WorkshopPayment] Unable to persist verified payment:",
        error,
      );
      return false;
    }

    return Boolean(data);
  } catch (error) {
    console.error("[WorkshopPayment] Unable to verify payment:", error);
    return false;
  }
}
