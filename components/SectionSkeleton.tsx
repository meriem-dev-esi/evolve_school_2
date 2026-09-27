interface Props {
  count?: number;
  variant?: "course" | "series" | "continue";
}

export default function SectionSkeleton({
  count = 4,
  variant = "course",
}: Props) {
  if (variant === "continue") {
    return (
      <div className="flex w-full gap-5 overflow-x-auto pb-4">
        <div className="w-full max-w-xl animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-4 w-12 rounded bg-brand/20" />
          </div>
          <div className="mt-4 h-6 w-3/4 rounded-lg bg-white/15" />
          <div className="mt-2 h-4 w-1/2 rounded bg-white/10" />
          <div className="mt-6 h-2 w-full rounded-full bg-white/5" />
          <div className="mt-6 flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-9 w-32 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "series") {
    return (
      <div className="flex w-full gap-5 overflow-x-auto pb-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={`series-skeleton-${idx}`}
            className="w-[320px] shrink-0 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded-full bg-brand/10" />
              <div className="h-5 w-16 rounded-full bg-white/5" />
            </div>
            <div className="mt-4 h-6 w-4/5 rounded-lg bg-white/15" />
            <div className="mt-2 h-4 w-full rounded bg-white/5" />
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-3 w-8 rounded bg-white/10" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full gap-5 overflow-x-auto pb-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`course-skeleton-${idx}`}
          className="w-[290px] shrink-0 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md"
        >
          {/* Thumbnail skeleton */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>

          {/* Badges skeleton */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-4 w-16 rounded-md bg-white/10" />
            <div className="h-4 w-20 rounded-md bg-white/5" />
          </div>

          {/* Title skeleton */}
          <div className="mt-2.5 space-y-1.5">
            <div className="h-4 w-11/12 rounded bg-white/15" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
          </div>

          {/* Description skeleton */}
          <div className="mt-3 space-y-1">
            <div className="h-3 w-full rounded bg-white/5" />
            <div className="h-3 w-4/5 rounded bg-white/5" />
          </div>

          {/* Footer skeleton */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="h-4 w-16 rounded bg-brand/20" />
            <div className="h-4 w-12 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
