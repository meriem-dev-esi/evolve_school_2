import { CheckCircle2 } from "lucide-react";

interface FormationsCompletionAlertProps {
  completedTitle: string;
  formationTitle?: string;
  completedDesc: string;
}

/**
 * FormationsCompletionAlert displays a celebratory notification
 * when a user completes all courses within a formation series.
 */
export default function FormationsCompletionAlert({
  completedTitle,
  formationTitle,
  completedDesc,
}: FormationsCompletionAlertProps) {
  return (
    <section className="px-6 pt-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-brand/30 bg-brand/10 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(95,236,107,0.15)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-black">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{completedTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-white/70">
                {formationTitle ? `"${formationTitle}" — ` : ""}
                {completedDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
