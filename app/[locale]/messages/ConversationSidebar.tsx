"use client";

import { Search } from "lucide-react";
import type { Conversation } from "@/lib/data/messages";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelectConversation: (id: string) => void;
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  locale: string;
}

export default function ConversationSidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  searchFilter,
  onSearchFilterChange,
  locale,
}: ConversationSidebarProps) {
  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.participant.role.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <aside className="flex flex-col border-b border-white/10 md:col-span-5 lg:col-span-4 md:border-b-0 md:border-r">
      {/* Header & Search */}
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Discussions</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-brand">
              {conversations.length}
            </span>
          </h2>
        </div>

        <div className="relative mt-4">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchFilterChange(e.target.value)}
            placeholder="Rechercher un formateur ou contact..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-2 text-xs text-white placeholder-white/40 focus:border-brand focus:outline-none transition"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-white/40">
            Aucune conversation trouvée.
          </div>
        ) : (
          filteredConversations.map((c) => {
            const isSelected = c.id === activeConvId;
            const formattedTime = new Date(
              c.last_message.created_at,
            ).toLocaleTimeString(locale === "ar" ? "ar-DZ" : "fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConversation(c.id)}
                className={`group relative w-full flex items-start gap-3.5 p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-white/[0.06] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-brand"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="relative shrink-0">
                  {c.participant.avatar_url ? (
                    <img
                      src={c.participant.avatar_url}
                      alt={c.participant.name}
                      className="h-11 w-11 rounded-2xl object-cover border border-white/15"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-sm font-bold text-brand border border-brand/30">
                      {c.participant.name.charAt(0)}
                    </div>
                  )}
                  {c.participant.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="truncate text-xs sm:text-sm font-bold text-white group-hover:text-brand transition-colors">
                      {c.participant.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-white/40 font-mono">
                      {formattedTime}
                    </span>
                  </div>

                  <div className="text-[11px] text-brand/80 truncate font-medium mt-0.5">
                    {c.participant.role}
                  </div>

                  <p className="mt-1 truncate text-xs text-white/60">
                    {c.last_message.content}
                  </p>
                </div>

                {c.unread_count > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-black text-black shadow-md shadow-brand/30">
                    {c.unread_count}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
