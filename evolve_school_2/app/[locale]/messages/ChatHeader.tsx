"use client";

import { Clock, ShieldCheck } from "lucide-react";
import type { Conversation } from "@/lib/data/messages";

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
          {activeConversation?.participant.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              {activeConversation?.participant.name || "Discussion"}
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-brand">
              <ShieldCheck className="h-3 w-3" />
              Formateur certifié
            </span>
          </div>
          <p className="text-xs text-white/50">
            {activeConversation?.participant.role}
            {activeConversation?.participant.online
              ? " · En ligne"
              : " · Absent"}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
          <Clock className="h-3 w-3 text-brand" />
          Réponse rapide
        </span>
      </div>
    </div>
  );
}
