"use client";

import { Github, Globe } from "lucide-react";

interface EditProjectLinksFieldsProps {
  githubUrl: string;
  setGithubUrl: (value: string) => void;
  demoUrl: string;
  setDemoUrl: (value: string) => void;
}

// GitHub + live demo URL inputs, side by side.
export default function EditProjectLinksFields({
  githubUrl,
  setGithubUrl,
  demoUrl,
  setDemoUrl,
}: EditProjectLinksFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="github"
          className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70"
        >
          <Github className="h-3.5 w-3.5 text-brand" />
          <span>Lien GitHub (Optionnel)</span>
        </label>
        <input
          id="github"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="demo"
          className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70"
        >
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span>Lien Démo en ligne (Optionnel)</span>
        </label>
        <input
          id="demo"
          type="url"
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
          placeholder="https://mon-projet.vercel.app"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </div>
    </div>
  );
}
