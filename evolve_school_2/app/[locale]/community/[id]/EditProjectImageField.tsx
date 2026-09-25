"use client";

import { Upload } from "lucide-react";

interface EditProjectImageFieldProps {
  imagePreview: string | null;
  imageFileName: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Image preview + file input for replacing the project screenshot.
export default function EditProjectImageField({
  imagePreview,
  imageFileName,
  onImageChange,
}: EditProjectImageFieldProps) {
  return (
    <div>
      <label
        htmlFor="project-image"
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
      >
        Capture d'écran ou Visuel du projet
      </label>

      {imagePreview && (
        <div className="relative mb-4 h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <img
            src={imagePreview}
            alt="Aperçu du projet"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <label
        htmlFor="project-image"
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-6 text-center transition hover:border-brand/50 hover:bg-white/[0.04]"
      >
        <Upload className="mb-2 h-6 w-6 text-brand/80" />
        <span className="text-xs font-semibold text-white">
          {imageFileName
            ? `Nouveau fichier : ${imageFileName}`
            : "Cliquez pour remplacer l'image (PNG, JPG, WebP)"}
        </span>
        <span className="mt-1 text-[10px] text-white/40">
          Recommandé : format 16:9, max 5 Mo (compression auto)
        </span>
        <input
          id="project-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onImageChange}
          className="sr-only"
        />
      </label>
    </div>
  );
}
