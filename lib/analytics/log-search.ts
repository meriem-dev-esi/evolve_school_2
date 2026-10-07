import { createClient } from "@/lib/supabase/client";

export async function logSearch(courseId: string, searchQuery?: string) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await supabase.from("search_analytics").insert({
    user_id: data.user.id,
    course_id: courseId,
    search_query: searchQuery ?? null,
  });
}
