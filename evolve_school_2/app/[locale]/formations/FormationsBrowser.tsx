"use client";

import { Search } from "lucide-react";

import { useMemo, useState } from "react";
import FormationCard from "@/components/formations/FormationCard";
import FormationsMobileCategories from "@/components/formations/FormationsMobileCategories";
import FormationsSearchBar from "@/components/formations/FormationsSearchBar";
import FormationsSidebar from "@/components/formations/FormationsSidebar";
import type { Course, Formation } from "@/components/formations/types";

export type { Course, Formation };

type Props = {
  formations: Formation[];
  locale: string;
  completedFormationIds: string[];
};

/**
 * FormationsBrowser provides search, filtering by domain/specialty,
 * and renders all certified formation series.
 */
export default function FormationsBrowser({
  formations,
  locale,
  completedFormationIds,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Formations");

  const filteredFormations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return formations.filter((formation) => {
      const matchesCategory =
        category === "All Formations" || formation.domain === category;

      if (!matchesCategory) return false;

      if (!query) return true;

      const formationMatches =
        formation.title.toLowerCase().includes(query) ||
        (formation.description ?? "").toLowerCase().includes(query) ||
        (formation.domain ?? "").toLowerCase().includes(query) ||
        (formation.level ?? "").toLowerCase().includes(query);

      const courseMatches = formation.courses.some(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          (course.description ?? "").toLowerCase().includes(query) ||
          (course.domain ?? "").toLowerCase().includes(query) ||
          (course.level ?? "").toLowerCase().includes(query),
      );

      return formationMatches || courseMatches;
    });
  }, [formations, search, category]);

  function resetFilters() {
    setSearch("");
    setCategory("All Formations");
  }

  return (
    <>
      {/* Search Input Bar */}
      <FormationsSearchBar search={search} setSearch={setSearch} />

      {/* Content Area */}
      <section className="mx-auto flex max-w-7xl gap-8 px-6 py-12 lg:px-10">
        {/* Desktop Sidebar Navigation */}
        <FormationsSidebar category={category} setCategory={setCategory} />

        {/* Main List */}
        <div className="min-w-0 flex-1">
          {/* Mobile Categories Scrollbar */}
          <FormationsMobileCategories
            category={category}
            setCategory={setCategory}
          />

          {/* Header & Results counter */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {category === "All Formations"
                  ? "Parcours Disponibles"
                  : category}
              </h2>

              <p className="mt-1 text-xs text-white/50">
                {filteredFormations.length}{" "}
                {filteredFormations.length === 1
                  ? "parcours certifiant"
                  : "parcours certifiants"}
              </p>
            </div>

            {(search.trim() || category !== "All Formations") && (
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 text-xs font-semibold text-brand transition hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* No Results Empty State */}
          {filteredFormations.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-20 text-center backdrop-blur-md">
              <Search size={36} className="mx-auto text-white/20" />

              <h3 className="mt-4 text-lg font-bold text-white">
                Aucune formation trouvée
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/40">
                Nous n'avons trouvé aucun parcours correspondant à vos critères.
                Essayez un autre mot-clé ou catégorie.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-black transition hover:scale-105"
              >
                Voir toutes les formations
              </button>
            </div>
          ) : (
            /* Formations Cards */
            <div className="space-y-8">
              {filteredFormations.map((formation) => {
                const formationCompleted =
                  formation.courses.length > 0 &&
                  formation.courses.every((course) => course.completed);

                const isFormationCompleted =
                  completedFormationIds.includes(formation.id) ||
                  formationCompleted;

                return (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    locale={locale}
                    isFormationCompleted={isFormationCompleted}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
