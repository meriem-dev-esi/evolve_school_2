"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  lessonId: string;
  courseId: string;
};

export default function DeleteLessonButton({ lessonId, courseId }: Props) {
  const t = useTranslations("teacher");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(t("confirmDeleteLesson"));

    if (!confirmed) return;

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId)
      .eq("course_id", courseId);

    if (error) {
      window.alert(`${t("errorPrefix")} ${error.message}`);
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={() => void handleDelete()}
      disabled={loading}
      className="rounded-full border border-red-400/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
    >
      {loading ? t("deletingLesson") : t("btnDeleteLesson")}
    </button>
  );
}
