import { ArrowRight, Code2, ExternalLink, Github, Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Profile, Project } from "./types";

interface CommunityProjectCardProps {
  project: Project;
  profile?: Profile;
  locale: string;
}

/**
 * CommunityProjectCard renders a rich showcase card for a community project,
 * including visual thumbnail, author info, technology badges, likes, and links.
 */
export default function CommunityProjectCard({
  project,
  profile,
  locale,
}: CommunityProjectCardProps) {
  return (
    <article className="group glass-card flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-brand/40 hover:-translate-y-1.5">
      <div>
        {/* Image Container */}
        <Link
          href={`/${locale}/community/${project.id}`}
          className="block relative aspect-video w-full overflow-hidden bg-zinc-900"
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-brand/30">
              <Code2 size={48} />
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-black/30" />

          {/* Category Pill Top-Start */}
          {project.category && (
            <div className="absolute top-3 start-3">
              <span className="rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                {project.category}
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-6">
          <Link href={`/${locale}/community/${project.id}`}>
            <h3 className="text-base font-bold text-white transition-colors group-hover:text-brand line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {/* Creator Badge */}
          <div className="mt-3 flex items-center gap-2.5 text-xs text-white/60">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Membre"}
                  className="h-6 w-6 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-brand">
                  {(profile?.full_name || "M").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate font-medium text-white/80">
              {profile?.full_name || "Membre Evolve"}
            </span>
            {profile?.role && (
              <span className="text-white/40 text-[11px]">
                · {profile.role}
              </span>
            )}
          </div>

          {project.description && (
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/55">
              {project.description}
            </p>
          )}

          {/* Technology Chips */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/80"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <Heart size={14} className="fill-rose-400/20" />
            {project.likes_count}
          </span>

          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Code source GitHub"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Github size={13} />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Démo en direct"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <ExternalLink size={13} />
              </a>
            )}
            <Link
              href={`/${locale}/community/${project.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-[11px] font-bold text-brand transition hover:bg-brand hover:text-black"
            >
              <span>Détails</span>
              <ArrowRight size={11} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
