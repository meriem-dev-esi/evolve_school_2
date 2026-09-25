import { PREFERENCE_CATEGORIES } from "./preferencesConstants";

interface PreferencesInterestsPickerProps {
  interests: string[];
  toggleInterest: (interest: string) => void;
  saving: boolean;
}

/**
 * PreferencesInterestsPicker renders the scrollable multi-select
 * interactive pills for user learning interest domains.
 */
export default function PreferencesInterestsPicker({
  interests,
  toggleInterest,
  saving,
}: PreferencesInterestsPickerProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-white/80">
            Interests
          </label>
          <p className="mt-1 text-xs text-white/35">
            Select all topics you are interested in.
          </p>
        </div>

        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          {interests.length} selected
        </span>
      </div>

      <div className="interest-scrollbar max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {PREFERENCE_CATEGORIES.map((item) => {
            const selected = interests.includes(item);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                disabled={saving}
                aria-pressed={selected}
                className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition ${
                  selected
                    ? "border-brand/60 bg-brand/10 text-brand"
                    : "border-white/10 bg-white/[0.02] text-white/65 hover:border-white/25 hover:bg-white/[0.05]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                    selected
                      ? "border-brand bg-brand text-black"
                      : "border-white/20 bg-transparent"
                  }`}
                >
                  {selected ? "✓" : ""}
                </span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .interest-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3)
            rgba(255, 255, 255, 0.05);
        }
        .interest-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .interest-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
        }
        .interest-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 999px;
        }
        .interest-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
