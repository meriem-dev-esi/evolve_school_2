"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function SectionErrorState({
  title,
  description,
  onRetry,
}: Props) {
  const tHome = useTranslations("home");

  const displayTitle = title ?? tHome("errorState.title");
  const displayDescription = description ?? tHome("errorState.description");
  const retryLabel = tHome("errorState.retry");

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6 text-center backdrop-blur-md md:py-8">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
        <AlertCircle className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-semibold tracking-tight text-white">
        {displayTitle}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-white/50">
        {displayDescription}
      </p>

      <button
        type="button"
        onClick={handleRetry}
        className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>{retryLabel}</span>
      </button>
    </div>
  );
}
