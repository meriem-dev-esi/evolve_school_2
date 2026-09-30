"use client";

import type { Conversation } from "@/lib/messages-shared";

interface ChatHeaderProps {
  activeConversation?: Conversation;
}

export default function ChatHeader({ activeConversation }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
      <div className="flex items-center gap-3.5">
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
            {activeConversation?.participant.name ?? "Choisissez un contact"}
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
