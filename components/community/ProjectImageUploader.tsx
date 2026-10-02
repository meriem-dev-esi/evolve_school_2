import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectImageUploaderProps {
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
}

/**
 * ProjectImageUploader provides a dashed file upload drag-and-drop area
 * with live preview for screenshot uploads.
 */
export default function ProjectImageUploader({
  previewUrl,
  onImageChange,
}: ProjectImageUploaderProps) {
  const t = useTranslations("community");

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-white/80">
        {t("submit.imageLabel")}
      </label>
      <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-brand/40 hover:bg-white/[0.04]">
        <input
          id="project-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {previewUrl ? (
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/20">
            <img
              src={previewUrl}
              alt={t("submit.imagePreview")}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-xs font-bold text-white">
              {t("submit.imageChange")}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60">
              <Upload size={18} className="text-brand" />
            </div>
            <p className="text-xs font-medium text-white/80">
              {t("submit.imageChoose")}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              {t("submit.imageHelp")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
