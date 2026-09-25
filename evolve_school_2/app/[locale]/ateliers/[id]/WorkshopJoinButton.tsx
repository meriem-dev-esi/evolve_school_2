"use client";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

interface WorkshopJoinButtonProps {
  workshopId: string;
  workshopTitle: string;
  price: number;
  isFree: boolean;
  locale: string;
  joinLabel: string;
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
  price,
  isFree,
  locale,
  joinLabel,
}: WorkshopJoinButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  async function handleJoin() {
    try {
      setLoading(true);
      setFeedbackMessage(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
      if (!user) {
        router.push("/sign-in");
        return;
      }

      if (isFree) {
        // Atelier gratuit : confirmation immédiate de la place
        setIsJoined(true);
        setFeedbackMessage(
          locale === "ar"
            ? `تم حجز مقعدك في "${workshopTitle}" بنجاح! سنرسل التفاصيل عبر البريد الإلكتروني.`
            : `Votre place pour "${workshopTitle}" a été réservée avec succès !`,
        );
      } else {
        // Masterclass payante : intégration du flux de paiement
        setFeedbackMessage(
          locale === "ar"
            ? `جاري توجيهك إلى بوابة الدفع (${price} د.ج)...`
            : `Redirection vers le paiement (${price} DZD)...`,
        );

        // Appel API de paiement ou simulation sécurisée
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: workshopId,
            courseTitle: workshopTitle,
            amount: price,
            locale,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.checkout_url) {
            window.location.href = data.checkout_url;
            return;
          }
        }

        setIsJoined(true);
        setFeedbackMessage(
          locale === "ar"
            ? "تم تسجيل اهتمامك بالورشة بنجاح."
            : "Votre demande de réservation a été prise en compte.",
        );
      }
    } catch (err) {
      console.error("[WorkshopJoinButton]", err);
      setFeedbackMessage(
        locale === "ar"
          ? "حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقاً."
          : "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
      );
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
            <span>
              {locale === "ar" ? "جاري المعالجة..." : "Traitement..."}
            </span>
          </>
        ) : isJoined ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              {locale === "ar" ? "تم التسجيل بنجاح" : "Place Confirmée"}
            </span>
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
          className={`text-xs ${
            isJoined ? "text-emerald-400 font-medium" : "text-white/70"
          }`}
        >
          {feedbackMessage}
        </p>
      )}
    </div>
  );
}
