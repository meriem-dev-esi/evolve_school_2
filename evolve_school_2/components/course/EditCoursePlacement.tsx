interface EditCoursePlacementProps {
  isBeginner: boolean;
  setIsBeginner: (val: boolean) => void;
  isPartner: boolean;
  setIsPartner: (val: boolean) => void;
  isExclusive: boolean;
  setIsExclusive: (val: boolean) => void;
  isTrending: boolean;
  setIsTrending: (val: boolean) => void;
  isComingSoon: boolean;
  setIsComingSoon: (val: boolean) => void;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
}

/**
 * EditCoursePlacement renders checkbox toggles for platform visibility,
 * exclusive status, beginner pack tagging, and publishing state.
 */
export default function EditCoursePlacement({
  isBeginner,
  setIsBeginner,
  isPartner,
  setIsPartner,
  isExclusive,
  setIsExclusive,
  isTrending,
  setIsTrending,
  isComingSoon,
  setIsComingSoon,
  isPublished,
  setIsPublished,
}: EditCoursePlacementProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <h2 className="text-2xl font-bold">Platform Placement</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isBeginner}
            onChange={(e) => setIsBeginner(e.target.checked)}
            className="accent-brand"
          />
          <span>Beginner Starter Pack</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isPartner}
            onChange={(e) => setIsPartner(e.target.checked)}
            className="accent-brand"
          />
          <span>Partner Course</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isExclusive}
            onChange={(e) => setIsExclusive(e.target.checked)}
            className="accent-brand"
          />
          <span>Exclusive to Evolve</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
            className="accent-brand"
          />
          <span>Trending</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isComingSoon}
            onChange={(e) => setIsComingSoon(e.target.checked)}
            className="accent-brand"
          />
          <span>Coming Soon</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="accent-brand"
          />
          <span>Published</span>
        </label>
      </div>
    </section>
  );
}
