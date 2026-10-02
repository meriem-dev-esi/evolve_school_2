"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCoursePage() {
  const router = useRouter();
  const t = useTranslations("teacher");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [practicePercentage, setPracticePercentage] = useState(50);
  const [imageUrl, setImageUrl] = useState("");

  const [isBeginner, setIsBeginner] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreate() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(`${t("errorPrefix")} ${t("errorSignedInRequired")}`);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !["teacher", "admin"].includes(profile.role)) {
      setMessage(`${t("errorPrefix")} ${t("teacherRequired")}`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("courses").insert({
      title: title.trim(),
      description: description.trim() || null,
      domain: domain.trim() || null,
      level: level.trim() || null,
      type: type.trim() || null,
      practice_percentage: practicePercentage,
      image_url: imageUrl.trim() || null,
      is_beginner: isBeginner,
      is_partner: isPartner,
      is_exclusive: isExclusive,
      is_trending: isTrending,
      is_coming_soon: isComingSoon,
      is_published: false,
    });

    if (error) {
      setMessage(`${t("errorPrefix")} ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage(t("successCreated"));
    setLoading(false);

    setTimeout(() => {
      router.push("/teacher/courses");
      router.refresh();
    }, 800);
  }

  return (
    <main className="min-h-dvh bg-canvas px-6 py-24 text-white lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
          {t("dashboardBadge")}
        </p>

        <h1 className="mt-4 text-4xl font-bold">{t("createCourseTitle")}</h1>

        <p className="mt-3 text-white/50">{t("createCourseSubtitle")}</p>

        <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("placeholderTitle")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("placeholderDescription")}
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
          />

          <div className="grid gap-6 md:grid-cols-3">
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t("placeholderDomain")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
            />

            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder={t("placeholderLevel")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
            />

            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder={t("placeholderType")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
            />
          </div>

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={t("placeholderImageUrl")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-brand"
          />

          <div>
            <div className="flex justify-between">
              <label className="font-medium">
                {t("practicePercentageLabel")}
              </label>

              <span className="font-semibold text-brand">
                {practicePercentage}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={practicePercentage}
              onChange={(e) => setPracticePercentage(Number(e.target.value))}
              className="mt-4 w-full accent-brand"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isBeginner}
                onChange={(e) => setIsBeginner(e.target.checked)}
              />
              {t("toggleBeginner")}
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPartner}
                onChange={(e) => setIsPartner(e.target.checked)}
              />
              {t("togglePartner")}
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isExclusive}
                onChange={(e) => setIsExclusive(e.target.checked)}
              />
              {t("toggleExclusive")}
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
              {t("toggleTrending")}
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isComingSoon}
                onChange={(e) => setIsComingSoon(e.target.checked)}
              />
              {t("toggleComingSoon")}
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleCreate();
            }}
            disabled={loading || !title.trim()}
            className="rounded-full bg-brand px-8 py-4 font-semibold text-black disabled:opacity-50"
          >
            {loading ? t("btnCreating") : t("btnCreate")}
          </button>

          {message && (
            <p
              className={
                message.includes(t("errorPrefix")) ||
                message.startsWith("Error")
                  ? "text-red-400"
                  : "text-brand"
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
