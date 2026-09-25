"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FormationsSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

/**
 * FormationsSearchBar renders the interactive search box
 * with live clearing button and localized placeholder.
 */
export default function FormationsSearchBar({
  search,
  setSearch,
}: FormationsSearchBarProps) {
  const t = useTranslations("formations");

  return (
    <div className="mx-auto mt-10 max-w-2xl px-6 lg:px-10">
      <div className="relative glass-panel rounded-2xl p-1 shadow-lg transition-all focus-within:border-brand/40 focus-within:shadow-[0_0_25px_rgba(95,236,107,0.15)]">
        <Search
          size={18}
          className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-white/40"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-xl bg-transparent ps-11 pe-11 text-sm text-white outline-none placeholder:text-white/30"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute end-3.5 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
            aria-label={t("clearSearch")}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {search.trim() && (
        <p className="mt-3 text-xs text-white/40">
          {t("resultsFor")}{" "}
          <span className="font-semibold text-brand">"{search}"</span>
        </p>
      )}
    </div>
  );
}
