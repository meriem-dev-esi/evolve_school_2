"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SaveCourseButtonProps {
  courseId: string;
}

/**
 * SaveCourseButton lets an authenticated learner add or remove
 * the current course from their personal watchlist (course_watchlist table).
 */
export default function SaveCourseButton({ courseId }: SaveCourseButtonProps) {
  const tHero = useTranslations("hero");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const checkStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("course_watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      setIsSaved(!!data);
    };

    void checkStatus();
  }, [courseId]);

  const toggleSave = async () => {
    if (!userId || loading) return;
    setLoading(true);
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    const supabase = createClient();
    try {
      if (!nextSavedState) {
        await supabase
          .from("course_watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("course_id", courseId);
      } else {
        await supabase.from("course_watchlist").insert({
          user_id: userId,
          course_id: courseId,
        });
      }
    } catch {
      setIsSaved(!nextSavedState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {isSaved ? (
        <BookmarkCheck className="h-4 w-4 text-brand" />
      ) : (
        <Bookmark className="h-4 w-4 text-white/40" />
      )}
      <span>{isSaved ? tHero("savedCourse") : tHero("saveCourse")}</span>
    </button>
  );
}
