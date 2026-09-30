export interface DirectoryProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

export function isStudentTeacherPair(firstRole: string, secondRole: string) {
  const category = (role: string) => {
    const normalizedRole = role.trim().toLowerCase();
    if (
      [
        "student",
        "étudiant",
        "étudiante",
        "étudiant evolve",
        "étudiante evolve",
      ].includes(normalizedRole)
    ) {
      return "student";
    }
    if (
      [
        "teacher",
        "formateur",
        "formatrice",
        "enseignant",
        "enseignante",
        "instructor",
      ].includes(normalizedRole)
    ) {
      return "teacher";
    }
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
