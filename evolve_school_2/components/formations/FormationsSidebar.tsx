"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { FORMATION_CATEGORIES } from "./types";

interface FormationsSidebarProps {
  category: string;
  setCategory: (cat: string) => void;
}

/**
 * FormationsSidebar provides desktop category selection navigation
 * with active state highlights and localized category names.
 */
export default function FormationsSidebar({
  category,
  setCategory,
}: FormationsSidebarProps) {
  const t = useTranslations("formations");

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-28 glass-panel rounded-3xl p-5 shadow-xl border border-white/10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40 px-2">
          {t("specialties")}
        </h2>

        <nav className="space-y-1">
          {["All Formations", ...FORMATION_CATEGORIES].map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-start text-xs font-medium transition-all ${
                  active
                    ? "bg-brand/15 text-brand font-bold border border-brand/20 shadow-[0_0_12px_rgba(95,236,107,0.15)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>
                  {item === "All Formations" ? t("allFormations") : item}
                </span>
                {active && (
                  <ChevronRight
                    size={14}
                    className="text-brand rtl:rotate-180"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
