import { Tag } from "lucide-react";
import { useTranslations } from "next-intl";

const SUGGESTED_TAGS = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Supabase",
  "Python",
  "Figma",
  "Node.js",
  "AI / LLM",
  "Mobile",
];

const CATEGORIES = [
  { value: "Web App", label: "webApp" },
  { value: "Mobile App", label: "mobileApp" },
  { value: "UI/UX Design", label: "uiux" },
  { value: "Intelligence Artificielle", label: "ai" },
  { value: "Portfolio", label: "portfolio" },
  { value: "Outil Open Source", label: "openSource" },
  { value: "E-Commerce", label: "ecommerce" },
] as const;

interface EditProjectDetailsFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  technologies: string;
  setTechnologies: (value: string) => void;
  addTechnologyTag: (tag: string) => void;
}

/**
 * EditProjectDetailsFields renders the title, category, description and
 * technologies fields of the project edition form.
 */
export default function EditProjectDetailsFields({
  title,
  setTitle,
  category,
  setCategory,
  description,
  setDescription,
  technologies,
  setTechnologies,
  addTechnologyTag,
}: EditProjectDetailsFieldsProps) {
  const t = useTranslations("community");

  return (
    <>
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
        >
          {t("edit.titleLabel")} *
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("edit.titlePlaceholder")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
        >
          {t("edit.categoryLabel")}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {CATEGORIES.map((categoryOption) => (
            <button
              key={categoryOption.value}
              type="button"
              onClick={() => setCategory(categoryOption.value)}
              className={`rounded-xl px-3 py-1.5 text-xs transition ${
                category === categoryOption.value
                  ? "bg-brand text-black font-bold"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {t(`categoryOptions.${categoryOption.label}`)}
            </button>
          ))}
        </div>
        <input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t("edit.categoryPlaceholder")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
        >
          {t("edit.descriptionLabel")} *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("edit.descriptionPlaceholder")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </div>

      {/* Technologies */}
      <div>
        <label
          htmlFor="technologies"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5"
        >
          <Tag className="h-3.5 w-3.5 text-brand" />
          <span>{t("edit.technologiesLabel")}</span>
        </label>
        <input
          id="technologies"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="Next.js, TypeScript, Tailwind, Supabase"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-white/40">
            {t("edit.suggestions")}
          </span>
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTechnologyTag(tag)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/60 hover:border-brand/40 hover:text-white transition"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
