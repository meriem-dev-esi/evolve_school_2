"use client";

import {
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Globe,
  Loader2,
  Send,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { WorkshopProjectItem } from "./types";
import { useWorkshopProjectSubmission } from "./useWorkshopProjectSubmission";

interface WorkshopProjectSubmissionProps {
  workshopId: string;
  workshopTitle: string;
  workshopDomain: string | null;
  existingProject?: WorkshopProjectItem | null;
  userId: string;
}

export default function WorkshopProjectSubmission({
  workshopId,
  workshopTitle,
  workshopDomain,
  existingProject,
  userId,
}: WorkshopProjectSubmissionProps) {
  const {
    t,
    project,
    isEditing,
    setIsEditing,
    title,
    setTitle,
    description,
    setDescription,
    githubUrl,
    setGithubUrl,
    demoUrl,
    setDemoUrl,
    previewUrl,
    handleFileChange,
    handleSubmit,
    loading,
    error,
  } = useWorkshopProjectSubmission({
    workshopId,
    workshopTitle,
    workshopDomain,
    existingProject,
    userId,
  });

  return (
    <section className="mb-12">
      <div className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                {t("title")}
              </h2>
              <p className="text-xs text-white/60">{t("description")}</p>
            </div>
          </div>

          {project && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              {t("editOrNew")}
            </button>
          )}
        </div>

        {project && !isEditing ? (
          <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-28 w-44 rounded-xl object-cover border border-white/10"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">
                    {t("submittedBadge")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-xs leading-relaxed text-white/60">
                    {project.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
                    >
                      <Globe className="h-3.5 w-3.5 text-sky-400" />
                      <span>{t("liveDemo")}</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
                    >
                      <FolderGit2 className="h-3.5 w-3.5 text-white/80" />
                      <span>{t("sourceCode")}</span>
                    </a>
                  )}
                  <Link
                    href={`/community/${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1.5 text-xs font-bold text-brand transition hover:bg-brand hover:text-black"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{t("viewInCommunity")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                {t("formProjectTitle")} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                {t("formDescription")}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descPlaceholder")}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  {t("formGithubUrl")}
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  {t("formDemoUrl")}
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://mon-projet.vercel.app"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                {t("formScreenshot")}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 file:me-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:font-bold file:text-black"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-14 w-24 rounded-lg object-cover border border-white/15"
                  />
                )}
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-black transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{t("submitting")}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{t("submitButton")}</span>
                  </>
                )}
              </button>

              {existingProject && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  {t("cancel")}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
