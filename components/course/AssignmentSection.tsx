"use client";

import { CheckCircle2, Clock, FileText, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { submitAssignmentAction } from "@/lib/data/assignments";
import type { AssignmentItem, AssignmentSubmissionItem } from "./types";

interface AssignmentSectionProps {
  courseId: string;
  lessonId: string;
  assignment: AssignmentItem;
  submission: AssignmentSubmissionItem | null;
}

const STATUS_LABEL: Record<AssignmentSubmissionItem["status"], string> = {
  submitted: "Soumis",
  late: "En retard",
  graded: "Noté",
};

/**
 * AssignmentSection affiche l'énoncé d'un devoir lié à une leçon, permet à
 * l'étudiant d'y soumettre un fichier (tout type accepté), et affiche le
 * statut ainsi que la note + feedback une fois corrigé par l'enseignant
 * (correction faite côté dashboard/Flutter, jamais depuis ce site).
 */
export default function AssignmentSection({
  courseId,
  lessonId,
  assignment,
  submission,
}: AssignmentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLocked = submission?.status === "graded";

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    formData.set("assignmentId", assignment.id);
    formData.set("courseId", courseId);
    formData.set("lessonId", lessonId);

    startTransition(async () => {
      const result = await submitAssignmentAction(formData);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        return;
      }
      setSuccess(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  }

  return (
    <section className="glass-card rounded-2xl border border-white/10 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-brand" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          Devoir
        </span>
      </div>

      <h3 className="mt-2 text-lg font-bold tracking-tight text-white">
        {assignment.title}
      </h3>

      {assignment.instructions && (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/60">
          {assignment.instructions}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/50">
        {assignment.due_date && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-sky-400" />À rendre avant le{" "}
            {new Date(assignment.due_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
        <span>Noté sur {assignment.max_score}</span>
      </div>

      {submission && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <span className="truncate text-xs font-semibold text-white/80">
                {submission.file_name}
              </span>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                submission.status === "graded"
                  ? "bg-brand/20 text-brand"
                  : submission.status === "late"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-white/10 text-white/60"
              }`}
            >
              {STATUS_LABEL[submission.status]}
            </span>
          </div>

          {submission.status === "graded" && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-sm font-bold text-white">
                Note : {submission.grade} / {assignment.max_score}
              </p>
              {submission.feedback && (
                <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-white/60">
                  {submission.feedback}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!isLocked && (
        <form
          action={handleSubmit}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            required
            disabled={isPending}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 file:me-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-black"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-black transition-all hover:scale-105 disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            {isPending ? "Envoi..." : submission ? "Renvoyer" : "Soumettre"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-400">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-xs font-semibold text-brand">
          Devoir envoyé avec succès.
        </p>
      )}
    </section>
  );
}
