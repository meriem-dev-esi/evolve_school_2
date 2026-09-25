"use client";

import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import EditProjectDetailsFields from "./EditProjectDetailsFields";
import EditProjectImageField from "./EditProjectImageField";
import EditProjectLinksFields from "./EditProjectLinksFields";
import { useEditProjectForm } from "./useEditProjectForm";

type Props = {
  projectId: string;
  locale: string;
  initialTitle: string;
  initialDescription: string;
  initialCategory: string;
  initialTechnologies: string;
  initialGithubUrl: string;
  initialDemoUrl: string;
  initialImageUrl: string;
};

export default function EditProjectForm(props: Props) {
  const router = useRouter();
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
    imageFile,
    imagePreview,
    loading,
    message,
    handleImageChange,
    addTechnologyTag,
    handleSubmit,
  } = useEditProjectForm(props);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EditProjectDetailsFields
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        description={description}
        setDescription={setDescription}
        technologies={technologies}
        setTechnologies={setTechnologies}
        addTechnologyTag={addTechnologyTag}
      />

      <EditProjectLinksFields
        githubUrl={githubUrl}
        setGithubUrl={setGithubUrl}
        demoUrl={demoUrl}
        setDemoUrl={setDemoUrl}
      />

      <EditProjectImageField
        imagePreview={imagePreview}
        imageFileName={imageFile?.name ?? null}
        onImageChange={handleImageChange}
      />

      {/* Error Message */}
      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() =>
            router.push(`/${props.locale}/community/${props.projectId}`)
          }
          className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(95,236,107,0.3)] transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Sauvegarder les modifications</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
