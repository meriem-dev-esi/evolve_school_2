export interface DirectoryProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
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
