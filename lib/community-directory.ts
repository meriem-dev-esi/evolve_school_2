export interface DirectoryProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

export type CommunityCategoryTranslationKey =
  | "categoryOptions.webApp"
  | "categoryOptions.mobileApp"
  | "categoryOptions.uiux"
  | "categoryOptions.ai"
  | "categoryOptions.portfolio"
  | "categoryOptions.openSource"
  | "categoryOptions.ecommerce";

export function getCommunityCategoryTranslationKey(
  category: string,
): CommunityCategoryTranslationKey | null {
  switch (category.trim().toLowerCase()) {
    case "web app":
      return "categoryOptions.webApp";
    case "mobile app":
      return "categoryOptions.mobileApp";
    case "ui/ux design":
      return "categoryOptions.uiux";
    case "intelligence artificielle":
    case "artificial intelligence":
    case "الذكاء الاصطناعي":
      return "categoryOptions.ai";
    case "portfolio":
      return "categoryOptions.portfolio";
    case "outil open source":
    case "open-source tool":
      return "categoryOptions.openSource";
    case "e-commerce":
      return "categoryOptions.ecommerce";
    default:
      return null;
  }
}

export function isStudentRole(role: string) {
  return [
    "student",
    "étudiant",
    "étudiante",
    "étudiant evolve",
    "étudiante evolve",
  ].includes(role.trim().toLowerCase());
}

export function isTeacherRole(role: string) {
  return [
    "teacher",
    "formateur",
    "formatrice",
    "enseignant",
    "enseignante",
    "instructor",
  ].includes(role.trim().toLowerCase());
}

export function isStudentTeacherPair(firstRole: string, secondRole: string) {
  const category = (role: string) => {
    const normalizedRole = role.trim().toLowerCase();
    if (isStudentRole(normalizedRole)) return "student";
    if (isTeacherRole(normalizedRole)) return "teacher";
    return null;
  };

  const firstCategory = category(firstRole);
  const secondCategory = category(secondRole);
  return (
    (firstCategory === "student" && secondCategory === "teacher") ||
    (firstCategory === "teacher" && secondCategory === "student") ||
    (firstCategory === "student" && secondCategory === "student")
  );
}
export function resolveAuthorProfile(
  id: string,
  dbProfilesMap?: Map<
    string,
    {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string | null;
    }
  >,
  unavailableLabel = "Profil indisponible",
): DirectoryProfile {
  const profile = dbProfilesMap?.get(id);

  return {
    id,
    full_name: profile?.full_name || unavailableLabel,
    avatar_url: profile?.avatar_url ?? null,
    role: profile?.role ?? "",
  };
}
