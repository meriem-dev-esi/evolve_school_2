import { Github, Globe } from "lucide-react";

interface ProjectUrlInputsProps {
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  demoUrl: string;
  demoPlaceholder?: string;
  setDemoUrl: (url: string) => void;
}

/**
 * ProjectUrlInputs renders GitHub code repository and demo prototype URL inputs.
 */
export default function ProjectUrlInputs({
  githubUrl,
  setGithubUrl,
  demoUrl,
  demoPlaceholder = "https://mon-projet.dz ou Figma",
  setDemoUrl,
}: ProjectUrlInputsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 pt-1">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/80">
          Lien Code Source / GitHub
        </label>
        <div className="relative">
          <Github
            size={15}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-3 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/80">
          Lien Démo / Prototype
        </label>
        <div className="relative">
          <Globe
            size={15}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder={demoPlaceholder}
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-3 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50"
          />
        </div>
      </div>
    </div>
  );
}
