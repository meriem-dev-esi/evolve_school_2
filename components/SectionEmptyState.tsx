import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

interface Props {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export default function SectionEmptyState({
  title,
  description,
  actionText,
  actionHref = "/disciplines",
  icon,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md transition-colors hover:border-white/15 md:py-10">
      <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand">
        {icon ?? <Sparkles className="h-5 w-5 text-brand" />}
      </div>

      <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-white/50">
        {description}
      </p>

      {actionText && (
        <Link
          href={actionHref}
          className="group mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-brand/40 hover:bg-brand hover:text-black"
        >
          <span>{actionText}</span>
          <span className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
