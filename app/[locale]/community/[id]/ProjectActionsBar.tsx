import { ExternalLink, Github, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProjectActions from "./ProjectActions";

type ProjectActionsBarProps = {
  demoUrl: string | null;
  githubUrl: string | null;
  projectId: string;
  projectTitle: string;
  authorId: string;
  locale: string;
  isOwner: boolean;
};

export default function ProjectActionsBar({
  demoUrl,
  githubUrl,
  projectId,
  projectTitle,
  authorId,
  locale,
  isOwner,
}: ProjectActionsBarProps) {
  return (
    <>
      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 transition shadow-[0_0_20px_rgba(95,236,107,0.25)]"
          >
            <span>Tester la démo en ligne</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/25 transition"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Code source GitHub</span>
          </a>
        )}

        {/* Direct Message Author */}
        <Link
          href={`/${locale}/messages?recipient=${authorId}&course=${encodeURIComponent(projectTitle)}`}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Échanger avec l'auteur</span>
        </Link>
      </div>

      {/* Project owner actions */}
      {isOwner && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">
              Gestion de votre projet (Auteur) :
            </span>
            <ProjectActions projectId={projectId} locale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
