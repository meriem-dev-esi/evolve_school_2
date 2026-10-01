export interface DirectoryProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
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
    (firstCategory === "teacher" && secondCategory === "student")
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
): DirectoryProfile {
  const profile = dbProfilesMap?.get(id);

  return {
    id,
    full_name: profile?.full_name || "Profil indisponible",
    avatar_url: profile?.avatar_url ?? null,
    role: profile?.role ?? "",
  };
}
