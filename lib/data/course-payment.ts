import "server-only";

import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export async function verifyChargilyPayment(
  enrollmentId: string,
  chargilyCheckoutId: string,
): Promise<boolean> {
  try {
    if (!env.chargilySecretKey || !chargilyCheckoutId) return false;

    const res = await fetch(
      `${env.chargilyApiUrl}/checkouts/${chargilyCheckoutId}`,
      {
        headers: {
          Authorization: `Bearer ${env.chargilySecretKey}`,
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      if (data.status === "paid") {
        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase
          .from("enrollments")
          .update({ payment_status: "paid", paid_at: new Date().toISOString() })
          .eq("id", enrollmentId);
        if (error) {
          console.error(
            "[CoursePayment] Unable to persist verified payment:",
            error,
          );
          return false;
        }
        return true;
      }
    }
  } catch (err) {
    console.error("[verifyChargilyPayment] error:", err);
  }
  return false;
}
