"use client";

import { Award, FolderGit2, MessageSquare, Video } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WorkshopIncludedFeatures() {
  const t = useTranslations("ateliers.enrolled.features");

  const items = [
    {
      icon: Video,
      title: t("videoTitle"),
      desc: t("videoDesc"),
    },
    {
      icon: Award,
      title: t("certTitle"),
      desc: t("certDesc"),
    },
    {
      icon: FolderGit2,
      title: t("projectTitle"),
      desc: t("projectDesc"),
    },
    {
      icon: MessageSquare,
      title: t("mentorTitle"),
      desc: t("mentorDesc"),
    },
  ];

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand">
        {t("header")}
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <item.icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[11px] leading-relaxed text-white/60">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
