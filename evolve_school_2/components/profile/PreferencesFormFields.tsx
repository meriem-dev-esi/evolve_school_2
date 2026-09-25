import {
  PREFERENCE_CATEGORIES,
  PREFERENCE_DIFFICULTIES,
  PREFERENCE_FORMATS,
  PREFERENCE_LANGUAGES,
  PREFERENCE_LEVELS,
} from "./preferencesConstants";

interface PreferencesFormFieldsProps {
  goal: string;
  setGoal: (val: string) => void;
  level: string;
  setLevel: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  difficulty: string;
  setDifficulty: (val: string) => void;
  format: string;
  setFormat: (val: string) => void;
  learningTime: string;
  setLearningTime: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  saving: boolean;
}

/**
 * PreferencesFormFields renders the structured dropdowns and text inputs
 * for student goal, level, category, format, pace, and language.
 */
export default function PreferencesFormFields({
  goal,
  setGoal,
  level,
  setLevel,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  format,
  setFormat,
  learningTime,
  setLearningTime,
  language,
  setLanguage,
  saving,
}: PreferencesFormFieldsProps) {
  return (
    <>
      {/* Learning goal */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">
          What is your learning goal?
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Example: Become a full-stack developer"
          disabled={saving}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25 transition focus:border-brand/60 focus:ring-1 focus:ring-brand/30 disabled:opacity-50"
        />
      </div>

      {/* Level + category */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Current level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={saving}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none focus:border-brand/60 disabled:opacity-50"
          >
            <option value="">Select your level</option>
            {PREFERENCE_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Preferred category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={saving}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none focus:border-brand/60 disabled:opacity-50"
          >
            <option value="">Select a category</option>
            {PREFERENCE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty + format */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Preferred difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={saving}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none focus:border-brand/60 disabled:opacity-50"
          >
            <option value="">Select difficulty</option>
            {PREFERENCE_DIFFICULTIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Preferred learning format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={saving}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none focus:border-brand/60 disabled:opacity-50"
          >
            <option value="">Select format</option>
            {PREFERENCE_FORMATS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Learning time + language */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Available learning time
          </label>
          <input
            type="text"
            value={learningTime}
            onChange={(e) => setLearningTime(e.target.value)}
            disabled={saving}
            placeholder="Example: 1 hour per day"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25 transition focus:border-brand/60 focus:ring-1 focus:ring-brand/30 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Preferred language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={saving}
            className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none focus:border-brand/60 disabled:opacity-50"
          >
            <option value="">Select language</option>
            {PREFERENCE_LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
