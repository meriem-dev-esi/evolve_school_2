"use client";

import { CheckCheck, MessageSquare } from "lucide-react";
import type { RefObject } from "react";
import type { DirectMessage } from "@/lib/data/messages-shared";

interface MessagesThreadProps {
  messages: DirectMessage[];
  currentUserId: string;
  locale: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function MessagesThread({
  messages,
  currentUserId,
  locale,
  messagesEndRef,
}: MessagesThreadProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand border border-brand/20 mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-white">
            Démarrez la conversation
          </h4>
          <p className="mt-1 text-xs text-white/50 max-w-xs">
            Posez votre première question ou partagez vos impressions pour
            débuter cet échange direct.
          </p>
        </div>
      ) : (
        messages.map((m) => {
          const isMe = m.sender_id === currentUserId;
          const time = new Date(m.created_at).toLocaleTimeString(
            locale === "ar" ? "ar-DZ" : "fr-FR",
            { hour: "2-digit", minute: "2-digit" },
          );

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md rounded-3xl px-5 py-3 text-xs sm:text-sm shadow-md leading-relaxed ${
                  isMe
                    ? "rounded-br-xs bg-brand text-black font-semibold shadow-md shadow-brand/20"
                    : "rounded-bl-xs border border-white/10 bg-zinc-900/90 text-white backdrop-blur-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/40 px-1 font-mono">
                <span>{time}</span>
                {isMe && <CheckCheck className="h-3 w-3 text-brand" />}
              </div>
            </div>
          );
        })
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
