"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Conversation } from "@/lib/messages-shared";

interface ChatHeaderProps {
  activeConversation?: Conversation;
  onBack: () => void;
}

export default function ChatHeader({
  activeConversation,
  onBack,
}: ChatHeaderProps) {
  const t = useTranslations("messaging");

  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("backToConversations")}
          className="rounded-xl p-2 text-white/60 transition hover:bg-white/10 hover:text-white md:hidden"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <div className="relative shrink-0">
          {activeConversation?.participant.avatar_url ? (
            <img
              src={activeConversation.participant.avatar_url}
              alt={activeConversation.participant.name}
              className="h-10 w-10 rounded-2xl object-cover border border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-sm font-bold text-brand">
              {activeConversation?.participant.name.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            {activeConversation?.participant.name ?? t("chooseContact")}
          </h3>
          {activeConversation?.participant.role && (
            <p className="text-xs text-white/50">
              {activeConversation.participant.role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
