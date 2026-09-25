const SUGGESTED_TECHS = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Figma",
  "Flutter",
  "Three.js",
  "Supabase",
  "Python",
  "Blender",
];

interface ProjectTechSuggestionsProps {
  onAddTech: (tech: string) => void;
}

/**
 * ProjectTechSuggestions renders quick-add technology badges.
 */
export default function ProjectTechSuggestions({
  onAddTech,
}: ProjectTechSuggestionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
      <span className="text-[10px] text-white/40">Suggestions rapides :</span>
      {SUGGESTED_TECHS.map((tech) => (
        <button
          key={tech}
          type="button"
          onClick={() => onAddTech(tech)}
          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/70 transition hover:border-brand/40 hover:text-brand"
        >
          + {tech}
        </button>
      ))}
    </div>
  );
}
