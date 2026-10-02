"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("community");

  return (
    <div>
      <label
        htmlFor="project-image"
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
      >
        {t("edit.imageLabel")}
      </label>

      {imagePreview && (
        <div className="relative mb-4 h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <img
            src={imagePreview}
            alt={t("edit.imageAlt")}
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
            ? t("edit.newImage", { name: imageFileName })
            : t("edit.replaceImage")}
        </span>
        <span className="mt-1 text-[10px] text-white/40">
          {t("edit.imageHelp")}
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
