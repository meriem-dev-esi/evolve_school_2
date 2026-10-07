"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import EditCourseBasicInfo from "@/components/course/EditCourseBasicInfo";
import EditCoursePlacement from "@/components/course/EditCoursePlacement";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const router = useRouter();
  const t = useTranslations("teacher");

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [type, setType] = useState("Course");
  const [practicePercentage, setPracticePercentage] = useState(30);
  const [imageUrl, setImageUrl] = useState("");

  const [isBeginner, setIsBeginner] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCourse() {
      const { id } = await params;
      setCourseId(id);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/sign-in`);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile || !["teacher", "admin"].includes(profile.role)) {
        setMessage(t("accessDenied"));
        setLoading(false);
        return;
      }

      const { data: course, error } = await supabase
        .from("courses")
        .select(
          "title, description, domain, level, type, practice_percentage, image_url, is_beginner, is_partner, is_exclusive, is_trending, is_coming_soon, is_published",
        )
        .eq("id", id)
        .maybeSingle();

      if (error || !course) {
        setMessage(t("courseNotFound"));
        setLoading(false);
        return;
      }

      setTitle(course.title || "");
      setDescription(course.description || "");
      setDomain(course.domain || "");
      setLevel(course.level || "Beginner");
      setType(course.type || "Course");
      setPracticePercentage(course.practice_percentage ?? 30);
      setImageUrl(course.image_url || "");

      setIsBeginner(course.is_beginner ?? false);
      setIsPartner(course.is_partner ?? false);
      setIsExclusive(course.is_exclusive ?? false);
      setIsTrending(course.is_trending ?? false);
      setIsComingSoon(course.is_coming_soon ?? false);
      setIsPublished(course.is_published ?? false);

      setLoading(false);
    }

    void loadCourse();
  }, [router, params, t]);

  async function handleSave() {
    if (!courseId) return;

    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("courses")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        domain: domain.trim() || null,
        level,
        type: type.trim() || null,
        practice_percentage: practicePercentage,
        image_url: imageUrl.trim() || null,
        is_beginner: isBeginner,
        is_partner: isPartner,
        is_exclusive: isExclusive,
        is_trending: isTrending,
        is_coming_soon: isComingSoon,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (error) {
      setMessage(`${t("errorPrefix")} ${error.message}`);
      setSaving(false);
      return;
    }

    setMessage(t("courseUpdatedSuccess"));
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black text-white">
        {t("loading")}
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-black px-6 py-28 text-white lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
            {t("dashboardBadge")}
          </p>
          <h1 className="mt-4 text-4xl font-bold">{t("actionEdit")}</h1>
          <p className="mt-3 text-white/50">{t("createCourseSubtitle")}</p>
        </div>

        <div className="space-y-8">
          {/* Basic Information section */}
          <EditCourseBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            domain={domain}
            setDomain={setDomain}
            level={level}
            setLevel={setLevel}
            type={type}
            setType={setType}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />

          {/* Practice percentage slider */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {t("practicePercentageLabel")}
              </h2>
              <span className="text-2xl font-bold text-brand">
                {practicePercentage}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={practicePercentage}
              onChange={(e) => setPracticePercentage(Number(e.target.value))}
              className="mt-6 w-full accent-brand"
            />
          </section>

          {/* Platform Placement toggles */}
          <EditCoursePlacement
            isBeginner={isBeginner}
            setIsBeginner={setIsBeginner}
            isPartner={isPartner}
            setIsPartner={setIsPartner}
            isExclusive={isExclusive}
            setIsExclusive={setIsExclusive}
            isTrending={isTrending}
            setIsTrending={setIsTrending}
            isComingSoon={isComingSoon}
            setIsComingSoon={setIsComingSoon}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />

          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => router.push(`/teacher/courses`)}
              className="rounded-full border border-white/10 px-6 py-3 font-semibold transition hover:bg-white/5"
            >
              {t("btnCancel")}
            </button>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full bg-brand px-7 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? t("savingChanges") : t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
