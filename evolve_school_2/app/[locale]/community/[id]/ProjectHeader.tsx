import { Calendar, Sparkles } from "lucide-react";
import LikeButton from "./LikeButton";

type ProjectHeaderProps = {
  title: string;
  category: string | null;
  formattedDate: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  authorRole?: string | null;
  projectId: string;
  initialLikes: number;
  initiallyLiked: boolean;
};

export default function ProjectHeader({
  title,
  category,
  formattedDate,
  authorName,
  authorAvatarUrl,
  authorRole,
  projectId,
  initialLikes,
  initiallyLiked,
}: ProjectHeaderProps) {
  return (
    <>
      {/* Meta tags & Category */}
      <div className="flex flex-wrap items-center gap-3">
        {category && (
          <span className="rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand tracking-wide">
            {category}
          </span>
        )}

        <span className="flex items-center gap-1.5 text-xs text-white/40">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
        </span>

        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          Vérifié Evolve Showcase
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h1>

      {/* Author Strip */}
      <div className="mt-6 flex items-center justify-between gap-4 border-y border-white/10 py-4">
        <div className="flex items-center gap-3.5">
          {authorAvatarUrl ? (
            <img
              src={authorAvatarUrl}
              alt={authorName}
              className="h-11 w-11 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 border border-brand/30 text-sm font-bold text-brand">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{authorName}</span>
              {authorRole && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                  {authorRole}
                </span>
              )}
            </div>
            <p className="text-xs text-white/40">Créateur du projet</p>
          </div>
        </div>

        <div className="shrink-0">
          <LikeButton
            projectId={projectId}
            initialLikes={initialLikes}
            initiallyLiked={initiallyLiked}
          />
        </div>
      </div>
    </>
  );
}
