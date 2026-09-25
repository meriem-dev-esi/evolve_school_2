import { Code2 } from "lucide-react";

type ProjectContentProps = {
  description: string | null;
  technologies: string[] | null;
};

export default function ProjectContent({
  description,
  technologies,
}: ProjectContentProps) {
  return (
    <>
      {/* Description */}
      {description && (
        <div className="mt-8">
          <p className="text-sm sm:text-base leading-relaxed text-white/80 whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}

      {/* Technologies Employed */}
      {technologies && technologies.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
            <Code2 className="h-4 w-4 text-brand" />
            Technologies & Outils
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-mono font-medium text-white/90 hover:border-brand/40 transition"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
