import { ArrowLeft, Code2 } from "lucide-react";
import type { Metadata } from "next";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityPagination from "@/components/community/CommunityPagination";
import CommunityProjectCard from "@/components/community/CommunityProjectCard";
import CommunitySubmitSection from "@/components/community/CommunitySubmitSection";
import type { Profile, Project } from "@/components/community/types";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import CommunityFilters from "./CommunityFilters";

export const metadata: Metadata = {
  title: "Communauté & Projets Étudiants — Evolve Academy",
  description:
    "Découvrez les réalisations créatives et techniques des étudiants et membres de la communauté Evolve Academy.",
  openGraph: {
    title: "Communauté Evolve Academy — Projets Étudiants",
    description:
      "Explorez les créations, portfolios et applications développés par la communauté Evolve Academy.",
  },
};

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    technology?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function CommunityPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const filters = await searchParams;

  const supabase = await createClient();

  const search = filters.q?.trim() ?? "";
  const category = filters.category ?? "";
  const technology = filters.technology ?? "";
  const sort = filters.sort ?? "newest";
  const currentPage = Math.max(1, Number.parseInt(filters.page || "1", 10));
  const pageSize = 12;

  const { data, error } = await supabase.from("community_projects").select(`
      id,
      user_id,
      title,
      description,
      image_url,
      github_url,
      demo_url,
      category,
      technologies,
      likes_count,
      created_at
    `);

  if (error) {
    console.error("[Community] Error loading projects:", error);
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role");

  const profileMap = new Map<string, Profile>(
    ((profiles ?? []) as Profile[]).map((profile) => [profile.id, profile]),
  );

  let projectList: Project[] = (data as Project[]) ?? [];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    projectList = projectList.filter(
      (project) =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.category?.toLowerCase().includes(searchLower) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(searchLower),
        ),
    );
  }

  // Category filter
  if (category) {
    projectList = projectList.filter(
      (project) => project.category === category,
    );
  }

  // Technology filter
  if (technology) {
    projectList = projectList.filter((project) =>
      project.technologies?.some((tech) => tech === technology),
    );
  }

  // Sorting
  if (sort === "likes") {
    projectList.sort((a, b) => b.likes_count - a.likes_count);
  } else {
    projectList.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  const allProjects: Project[] = (data as Project[]) ?? [];

  const categories = Array.from(
    new Set(
      allProjects
        .map((project) => project.category)
        .filter((cat): cat is string => Boolean(cat)),
    ),
  ).sort();

  const technologies = Array.from(
    new Set(allProjects.flatMap((project) => project.technologies ?? [])),
  ).sort();

  // Pagination
  const totalCount = projectList.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedProjects = projectList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="min-h-dvh bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 pt-28 pb-16">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-full max-w-7xl bg-brand/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          {/* Header & Stats Strip */}
          <CommunityHeader totalCount={totalCount} />

          {/* Filter and sorting controls */}
          <CommunityFilters
            categories={categories}
            technologies={technologies}
          />

          {/* Project Creator Submission Section */}
          <CommunitySubmitSection locale={locale} />

          {/* Projects Gallery */}
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Projets Récents
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Découvrez les travaux de la promotion actuelle
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {totalCount} {totalCount === 1 ? "réalisation" : "réalisations"}
              </span>
            </div>

            {projectList.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl border border-white/10">
                  <Code2 className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Aucun projet trouvé
                </h3>
                <p className="mt-1.5 text-xs text-white/50 max-w-sm mx-auto">
                  Aucune création ne correspond à vos critères. Essayez
                  d'élargir votre recherche.
                </p>
                <Link
                  href={`/${locale}/community`}
                  className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-black transition hover:scale-105"
                >
                  Réinitialiser les filtres
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProjects.map((project) => (
                    <CommunityProjectCard
                      key={project.id}
                      project={project}
                      profile={profileMap.get(project.user_id)}
                      locale={locale}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <CommunityPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  locale={locale}
                  search={search}
                  category={category}
                  technology={technology}
                  sort={sort}
                />
              </>
            )}
          </section>

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
            <Link
              href={`/${locale}/formations`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition hover:text-brand"
            >
              <ArrowLeft size={14} className="rtl:rotate-180" />
              <span>Retour aux formations</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
