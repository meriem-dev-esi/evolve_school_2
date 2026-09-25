import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Comments from "./Comments";
import ProjectActionsBar from "./ProjectActionsBar";
import ProjectContent from "./ProjectContent";
import ProjectHeader from "./ProjectHeader";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

type CommunityProject = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  category: string | null;
  technologies: string[] | null;
  likes_count: number;
  created_at: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("community_projects")
    .select("title, description, image_url")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return {
      title: "Projet non trouvé — Evolve Academy",
    };
  }

  return {
    title: `${project.title} — Communauté Evolve`,
    description:
      project.description ||
      "Découvrez ce projet développé par la communauté Evolve Academy.",
    openGraph: {
      title: `${project.title} — Evolve Academy`,
      description:
        project.description ||
        "Projet réalisé par les étudiants d'Evolve Academy.",
      images: project.image_url ? [{ url: project.image_url }] : [],
    },
  };
}

export default async function CommunityProjectPage({ params }: Props) {
  const { locale, id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_projects")
    .select(
      `
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
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[Community Project]", error);
  }

  const project = data as CommunityProject | null;

  if (!project) {
    notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get author profile
  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", project.user_id)
    .maybeSingle();

  // Check if current user has liked this project
  let initiallyLiked = false;

  if (user) {
    const { data: like } = await supabase
      .from("community_project_likes")
      .select("id")
      .eq("project_id", project.id)
      .eq("user_id", user.id)
      .maybeSingle();

    initiallyLiked = !!like;
  }

  // Check if current user owns this project
  const isOwner = user?.id === project.user_id;

  const authorName = authorProfile?.full_name || "Étudiant Evolve";
  const formattedDate = new Date(project.created_at).toLocaleDateString(
    locale === "ar" ? "ar-DZ" : "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand selection:text-black">
      <Navbar />

      <main className="flex-1 px-5 pt-28 pb-20 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="mx-auto max-w-4xl relative z-10">
          {/* Breadcrumb Navigation */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-brand transition duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux projets de la communauté</span>
          </Link>

          {/* Main Showcase Article */}
          <article className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
            {/* Project Image Banner */}
            {project.image_url ? (
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-zinc-900 border-b border-white/10">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              </div>
            ) : null}

            <div className="p-6 sm:p-10">
              <ProjectHeader
                title={project.title}
                category={project.category}
                formattedDate={formattedDate}
                authorName={authorName}
                authorAvatarUrl={authorProfile?.avatar_url}
                authorRole={authorProfile?.role}
                projectId={project.id}
                initialLikes={project.likes_count}
                initiallyLiked={initiallyLiked}
              />

              <ProjectContent
                description={project.description}
                technologies={project.technologies}
              />

              <ProjectActionsBar
                demoUrl={project.demo_url}
                githubUrl={project.github_url}
                projectId={project.id}
                projectTitle={project.title}
                authorId={project.user_id}
                locale={locale}
                isOwner={!!isOwner}
              />
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-10">
            <Comments projectId={project.id} />
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
