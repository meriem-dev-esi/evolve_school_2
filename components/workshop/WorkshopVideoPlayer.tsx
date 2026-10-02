"use client";

import { Award, CheckCircle2, Film, Play, Sparkles, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { WorkshopVideoItem } from "./types";

interface WorkshopVideoPlayerProps {
  videos: WorkshopVideoItem[];
  workshopTitle: string;
  fallbackImageUrl?: string | null;
  isFinished?: boolean;
  onFinish?: () => void;
}

const WORKSHOP_SAMPLE_VIDEOS: Record<string, string> = {
  git: "RGOj5yH7evk",
  docker: "fqMOX6JJhGo",
  react: "0-S5a0eXPoc",
  data: "a9UrKTVEeZA",
  securite: "WlmKwI-BCRA",
  security: "WlmKwI-BCRA",
  ci: "scEDHsr3APg",
  design: "2150b0f4i_c",
  ia: "G2fqAlgmoPo",
  ai: "G2fqAlgmoPo",
  microservices: "CdBtNQZH8a4",
  test: "7r4xVDI2vho",
};

function resolveYouTubeId(url: string | null, title: string): string {
  if (url) {
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );
    if (ytMatch?.[1]) return ytMatch[1];
  }

  const lowerTitle = title.toLowerCase();
  for (const [key, id] of Object.entries(WORKSHOP_SAMPLE_VIDEOS)) {
    if (lowerTitle.includes(key)) return id;
  }
  return "RGOj5yH7evk";
}

function parseVideoSource(
  url: string | null,
  workshopTitle: string,
): { isYouTube: boolean; src: string } {
  if (
    url &&
    !url.includes("cdn.test.com") &&
    !url.includes("youtube") &&
    !url.includes("youtu.be")
  ) {
    return { isYouTube: false, src: url };
  }
  const ytId = resolveYouTubeId(url, workshopTitle);
  return {
    isYouTube: true,
    src: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&enablejsapi=1`,
  };
}

export default function WorkshopVideoPlayer({
  videos,
  workshopTitle,
  fallbackImageUrl,
  isFinished = false,
  onFinish,
}: WorkshopVideoPlayerProps) {
  const t = useTranslations("ateliers.enrolled");
  const [activeIndex, setActiveIndex] = useState(0);

  const activeVideo = videos[activeIndex] ?? null;
  const videoSource = useMemo(
    () => parseVideoSource(activeVideo?.video_url ?? null, workshopTitle),
    [activeVideo?.video_url, workshopTitle],
  );

  function scrollToCertificate() {
    const el = document.getElementById("workshop-certificate");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <section className="mb-12">
      <div className="glass-card overflow-hidden rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                {activeVideo?.title || t("videoSectionTitle")}
              </h2>
              <p className="text-xs text-white/60">{t("videoSectionDesc")}</p>
            </div>
          </div>

          {videos.length > 1 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              {activeIndex + 1} / {videos.length}
            </span>
          )}
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 shadow-inner">
          {videoSource.src ? (
            videoSource.isYouTube ? (
              <iframe
                src={videoSource.src}
                title={activeVideo?.title || workshopTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                playsInline
                className="h-full w-full object-contain"
                src={videoSource.src}
              >
                <track kind="captions" />
              </video>
            )
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-6 text-center">
              {fallbackImageUrl && (
                <img
                  src={fallbackImageUrl}
                  alt={workshopTitle}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand/40 bg-brand/20 text-brand shadow-lg">
                  <Play className="h-7 w-7 ms-1" />
                </div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  {workshopTitle}
                </h3>
                <p className="max-w-md text-xs text-white/60">
                  {t("noVideoYet")}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("hdMasterclass")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video Completion & Certificate Unlock Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isFinished
                  ? "bg-brand/20 text-brand border border-brand/30"
                  : "bg-amber-400/10 text-amber-300 border border-amber-400/20"
              }`}
            >
              {isFinished ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ms-0.5" />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-bold ${
                  isFinished ? "text-brand" : "text-white"
                }`}
              >
                {isFinished
                  ? t("certificate.finishedBadge")
                  : t("certificate.videoInProgress")}
              </p>
              <p className="text-[11px] text-white/60">
                {isFinished
                  ? t("certificate.title")
                  : t("certificate.finishVideoPrompt")}
              </p>
            </div>
          </div>

          <div>
            {isFinished ? (
              <button
                type="button"
                onClick={scrollToCertificate}
                className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 py-2.5 text-xs font-bold text-brand hover:bg-brand hover:text-black transition-all shadow-sm"
              >
                <Award className="h-4 w-4" />
                <span>{t("certificate.view")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinish}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-extrabold text-black hover:scale-105 hover:bg-lime-300 active:scale-95 transition-all shadow-[0_0_20px_rgba(95,236,107,0.35)]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{t("certificate.markFinished")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Playlist Selector if multiple videos */}
        {videos.length > 1 && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              {t("chapters")}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((vid, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={vid.id || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-start transition-all ${
                      isActive
                        ? "border-brand/50 bg-brand/15 text-white shadow-md"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        isActive
                          ? "bg-brand text-black font-extrabold"
                          : "border border-white/15 bg-white/5 text-white/60"
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Film className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">
                        {vid.title || `${t("part")} ${idx + 1}`}
                      </p>
                      {vid.duration && (
                        <span className="text-[11px] text-white/40">
                          {vid.duration} min
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
