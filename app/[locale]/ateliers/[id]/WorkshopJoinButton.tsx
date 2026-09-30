"use client";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

interface WorkshopJoinButtonProps {
  workshopId: string;
  workshopTitle: string;
  isFree: boolean;
  locale: string;
  joinLabel: string;
  isInitiallyJoined: boolean;
  initialFeedback: string | null;
}

/**
 * Bouton interactif de réservation et participation à un atelier pratique.
 * - Gère l'authentification préalable de l'étudiant
 * - Confirme la place pour les ateliers gratuits
 * - Lance le processus de paiement pour les masterclasses payantes
 */
export default function WorkshopJoinButton({
  workshopId,
  workshopTitle,
  isFree,
  locale,
  joinLabel,
  isInitiallyJoined,
  initialFeedback,
}: WorkshopJoinButtonProps) {
  const t = useTranslations("ateliers.card");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(isInitiallyJoined);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    initialFeedback,
  );

  async function handleJoin() {
    try {
      setLoading(true);
      setFeedbackMessage(null);

      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) {
        router.push("/sign-in");
        return;
      }

      if (isFree) {
        const response = await fetch("/api/workshop-enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workshopId }),
        });
        if (!response.ok) {
          console.error(
            "[WorkshopJoinButton] Unable to enroll:",
            await response.text(),
          );
          setFeedbackMessage(t("joinError"));
          return;
        }
        setIsJoined(true);
        setFeedbackMessage(t("joinedSuccess", { title: workshopTitle }));
      } else {
        setFeedbackMessage(t("redirectingToPayment"));
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workshopId,
            locale,
          }),
        });

        const data = await res.json();
        if (
          res.ok &&
          typeof data.checkout_url === "string" &&
          data.checkout_url
        ) {
          window.location.href = data.checkout_url;
          return;
        }

        console.error(
          "[WorkshopJoinButton] Unable to create payment checkout:",
          res.status,
          data,
        );
        setFeedbackMessage(t("joinError"));
      }
    } catch (err) {
      console.error("[WorkshopJoinButton]", err);
      setFeedbackMessage(t("joinError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleJoin}
        disabled={loading || isJoined}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
          isJoined
            ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 cursor-default"
            : "bg-brand text-black hover:scale-105 active:scale-95 disabled:opacity-50"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>{t("processing")}</span>
          </>
        ) : isJoined ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{t("joined")}</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>{joinLabel}</span>
          </>
        )}
      </button>

      {feedbackMessage && (
        <p
          className={`text-xs ${isJoined ? "text-emerald-400 font-medium" : "text-white/70"}`}
          role={isJoined ? "status" : "alert"}
        >
          {feedbackMessage}
        </p>
      )}
    </div>
  );
}
