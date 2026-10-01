import { NextResponse } from "next/server";
import {
  isStudentRole,
  isStudentTeacherPair,
  isTeacherRole,
} from "@/lib/community-directory";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
    if (authError) throw authError;

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const currentRole = currentProfile?.role ?? "";
    if (!isStudentRole(currentRole) && !isTeacherRole(currentRole)) {
      return NextResponse.json(
        { error: "Messaging is only available to students and teachers." },
        { status: 403 },
      );
    }

    const adminSupabase = createAdminClient();
    const { data: profiles, error: contactsError } = await adminSupabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .neq("id", user.id)
      .order("full_name");

    if (contactsError) throw contactsError;

    const contacts = (profiles ?? [])
      .filter(
        (profile) =>
          profile.full_name &&
          profile.role &&
          isStudentTeacherPair(currentRole, profile.role),
      )
      .map((profile) => ({
        id: profile.id,
        full_name: profile.full_name ?? "",
        avatar_url: profile.avatar_url,
        role: profile.role ?? "",
      }));

    return NextResponse.json(
      { contacts },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[Messaging Contacts] Unable to load contacts:", error);
    return NextResponse.json(
      { error: "Unable to load available contacts." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
