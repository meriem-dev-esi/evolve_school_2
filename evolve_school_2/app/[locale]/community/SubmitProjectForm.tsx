"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  Tag,
} from "lucide-react";
import ProjectImageUploader from "@/components/community/ProjectImageUploader";
import ProjectTechSuggestions from "@/components/community/ProjectTechSuggestions";
import ProjectUrlInputs from "@/components/community/ProjectUrlInputs";
import { useSubmitProjectForm } from "./useSubmitProjectForm";

type Props = {
  locale: string;
};

export default function SubmitProjectForm({ locale }: Props) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    technologies,
    setTechnologies,
    githubUrl,
    setGithubUrl,
    demoUrl,
    setDemoUrl,
    previewUrl,
    loading,
    message,
    addTech,
    handleImageChange,
    handleSubmit,
  } = useSubmitProjectForm(locale);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/80">
          Titre du projet <span className="text-brand">*</span>
        </label>
        <div className="relative">
          <FileText
            size={15}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: SaaS Dashboard UI, Application Mobile Ecommerce..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-3 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50 focus:bg-white/[0.08]"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/80">
          Description & Rôle <span className="text-brand">*</span>
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Expliquez la problématique résolue, les technologies utilisées, votre démarche..."
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50 focus:bg-white/[0.08]"
        />
      </div>

      {/* Grid Category & Technologies */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/80">
            Catégorie / Spécialité
          </label>
          <div className="relative">
            <Tag
              size={15}
              className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: UI/UX Design, Web Dev, Mobile..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-3 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/80">
            Technologies utilisées
          </label>
          <input
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="Séparées par des virgules (ex: Next.js, Tailwind, Figma)"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder:text-white/30 outline-none transition focus:border-brand/50"
          />
        </div>
      </div>

      {/* Quick Add Tech Suggestions */}
      <ProjectTechSuggestions onAddTech={addTech} />

      {/* URLs (GitHub & Demo) */}
      <ProjectUrlInputs
        githubUrl={githubUrl}
        setGithubUrl={setGithubUrl}
        demoUrl={demoUrl}
        setDemoUrl={setDemoUrl}
      />

      {/* Image File Upload */}
      <ProjectImageUploader
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
      />

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-xs font-extrabold text-black transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(95,236,107,0.5)] disabled:opacity-50 active:scale-95"
        >
          <Sparkles size={15} />
          <span>
            {loading
              ? "Publication en cours..."
              : "Publier mon projet sur Evolve"}
          </span>
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-medium ${
            message.type === "success"
              ? "border border-brand/30 bg-brand/10 text-brand"
              : "border border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </form>
  );
}
