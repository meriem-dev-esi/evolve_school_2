"use client";

import { useTranslations } from "next-intl";
import { FORMATION_CATEGORIES } from "./types";

interface FormationsMobileCategoriesProps {
  category: string;
  setCategory: (cat: string) => void;
}

/**
 * FormationsMobileCategories provides a horizontal pill-scroll bar
 * for mobile viewports to filter formations by specialty.
 */
export default function FormationsMobileCategories({
  category,
  setCategory,
}: FormationsMobileCategoriesProps) {
  const t = useTranslations("formations");

  return (
    <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-none">
      {["All Formations", ...FORMATION_CATEGORIES].map((item) => {
        const active = category === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              active
                ? "border-brand/40 bg-brand/15 text-brand font-bold"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            {item === "All Formations" ? t("allFormations") : item}
          </button>
        );
      })}
    </div>
  );
}
