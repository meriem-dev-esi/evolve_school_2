import "server-only";

import { revalidatePath } from "next/cache";

// Un des trois clients définis dans lib/supabase/ (server component client).
import { createClient } from "@/lib/supabase/server";

// Formes de lignes internes à ce module de données. Elles sont
// structurellement identiques à AssignmentItem / AssignmentSubmissionItem
// dans components/course/types.ts — volontairement dupliquées plutôt
// qu'importées, car boundary_guard.sh interdit tout `import ... from
// "@/components/..."` dans lib/ (y compris les imports de type). C'est
// app/ qui fait le pont entre les deux quand il construit les props du
// composant à partir du résultat de ces fonctions.
interface AssignmentRow {
  id: string;
  lesson_id: string;
  title: string;
  instructions: string | null;
  max_score: number;
  due_date: string | null;
  is_published: boolean;
  created_at: string;
}

interface AssignmentSubmissionRow {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  submitted_at: string;
  status: "submitted" | "late" | "graded";
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
}

// Doit rester synchronisé avec `file_size_limit` du bucket
// `assignment-submissions` (voir la proposition de migration).
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 Mo

interface AssignmentForLessonResult {
  assignment: AssignmentRow | null;
  submission: AssignmentSubmissionRow | null;
}

/**
 * Récupère le devoir publié d'une leçon (accès déjà filtré par RLS : leçon
 * gratuite OU inscription payée) ainsi que la soumission de l'utilisateur
 * courant pour ce devoir, si elle existe. Aucune vérification d'autorisation
 * ici : elle a déjà eu lieu dans la base, comme pour disciplines/page.tsx.
 */
export async function getAssignmentForLesson(
  lessonId: string,
): Promise<AssignmentForLessonResult> {
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .maybeSingle<AssignmentRow>();

  if (!assignment) {
    return { assignment: null, submission: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignment, submission: null };
  }

  const { data: submission } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignment.id)
    .eq("user_id", user.id)
    .maybeSingle<AssignmentSubmissionRow>();

  return { assignment, submission: submission ?? null };
}

/**
 * Génère une URL signée temporaire (10 min) pour télécharger un fichier de
 * soumission depuis le bucket privé `assignment-submissions`.
 */
export async function getSubmissionFileUrl(
  filePath: string,
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("assignment-submissions")
    .createSignedUrl(filePath, 60 * 10);

  if (error || !data) return null;
  return data.signedUrl;
}

export interface SubmitAssignmentResult {
  success: boolean;
  error?: string;
}

/**
 * Server action (directive inline, pas en haut du fichier, pour garder les
 * lectures ci-dessus comme fonctions serveur normales et non comme des
 * endpoints d'action appelables depuis le client).
 * Aucune restriction de type de fichier : l'école couvre tous les domaines,
 * seule la taille est plafonnée.
 */
export async function submitAssignmentAction(
  formData: FormData,
): Promise<SubmitAssignmentResult> {
  "use server";

  const assignmentId = formData.get("assignmentId")?.toString();
  const courseId = formData.get("courseId")?.toString();
  const lessonId = formData.get("lessonId")?.toString();
  const file = formData.get("file") as File | null;

  if (!assignmentId) {
    return { success: false, error: "Devoir introuvable." };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "Merci de sélectionner un fichier." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "Le fichier dépasse la taille maximale autorisée (100 Mo).",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const { data: existing } = await supabase
    .from("assignment_submissions")
    .select("graded_at")
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.graded_at) {
    return {
      success: false,
      error: "Ce devoir a déjà été noté, vous ne pouvez plus le modifier.",
    };
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${assignmentId}/${timestamp}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("assignment-submissions")
    .upload(path, file, { upsert: false });

  if (uploadError) {
    return { success: false, error: "Échec de l'envoi du fichier." };
  }

  const { error: insertError } = await supabase
    .from("assignment_submissions")
    .upsert(
      {
        assignment_id: assignmentId,
        user_id: user.id,
        file_url: path,
        file_name: file.name,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "assignment_id,user_id" },
    );

  if (insertError) {
    return {
      success: false,
      error: "Échec de l'enregistrement de la soumission.",
    };
  }

  if (courseId && lessonId) {
    revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  }

  return { success: true };
}
