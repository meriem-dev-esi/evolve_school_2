"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CheckoutButton({
  courseId,
  locale,
  price,
}: {
  courseId: string;
  locale: string;
  price?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("CHECKOUT API RESPONSE:", data);

        throw new Error(
          data.details
            ? JSON.stringify(data.details)
            : data.error || "L'initialisation du paiement a échoué",
        );
      }

      const checkoutUrl = data.checkout_url;

      if (!checkoutUrl) {
        throw new Error("L'URL de paiement Chargily n'a pas été retournée");
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 font-bold text-black shadow-lg shadow-brand/25 transition-all hover:bg-lime-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirection vers Chargily Pay...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>
              Payer {price ? `${price} DZD` : "maintenant"} avec Edahabia / CIB
            </span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400">
          {error}
        </div>
      )}
    </div>
  );
}
