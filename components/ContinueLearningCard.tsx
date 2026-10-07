"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { ContinueLearning } from "@/lib/data/dashboard";

interface Props {
  data: ContinueLearning;
  labels: {
    inProgress: string;
    progress: string;
    continueButton: string;
    lessonPrefix?: string;
  };
}

export default function ContinueLearningCard({ data, labels }: Props) {
  const [imgError, setImgError] = useState(false);
  const showFallbackImage = !data.courseImage || imgError;
  const continueHref = `/courses/${data.courseId}/lessons/${data.lessonId}${
    data.lastPosition && data.lastPosition > 0
      ? `?t=${Math.floor(data.lastPosition)}`
      : ""
  }`;

  const lessonPositionDisplay =
    data.lessonIndex && data.totalLessons
      ? `${labels.lessonPrefix ?? "Leçon"} ${data.lessonIndex}/${data.totalLessons}`
      : data.lessonPositionText;

  return (
    <article className="w-[280px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-brand/40">
      <div className="relative h-44 w-full overflow-hidden bg-zinc-800">
        {!showFallbackImage && data.courseImage ? (
          <img
            src={data.courseImage}
            alt={data.courseTitle}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden course-card-fallback-gradient text-xs font-medium text-white/70">
            <div className="absolute h-36 w-36 rounded-full border border-brand/20" />
            <BookOpen className="relative h-10 w-10 text-brand/90" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      <div className="p-5">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
          {labels.inProgress}
        </span>
        <h3 className="mt-3 line-clamp-2 text-base font-bold text-white">
          {data.courseTitle}
        </h3>
        {lessonPositionDisplay && (
          <p className="mt-1 text-xs font-semibold text-lime-400">
            {lessonPositionDisplay}
          </p>
        )}
        <p className="mt-1 line-clamp-1 text-sm text-white/70">
          {data.lessonTitle}
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-xs">
            <span className="text-white/70">{labels.progress}</span>
            <span className="font-semibold text-white">{data.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-lime-400"
              style={{
                width: `${Math.min(100, Math.max(0, data.progress))}%`,
              }}
            />
          </div>
        </div>

        <Link
          href={continueHref}
          className="mt-5 block rounded-full bg-lime-400 px-4 py-2 text-center text-xs font-semibold text-black transition hover:bg-lime-300"
        >
          {labels.continueButton}
        </Link>
      </div>
    </article>
  );
}
