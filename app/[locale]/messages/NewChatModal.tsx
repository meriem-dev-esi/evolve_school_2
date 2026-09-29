"use client";

import { MessageSquare, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  COMMUNITY_PROFILES,
  type DirectoryProfile,
} from "@/lib/data/community-directory";
import { createClient } from "@/lib/supabase/client";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: DirectoryProfile) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onSelectContact,
}: NewChatModalProps) {
  const [search, setSearch] = useState("");
  const [contactsList, setContactsList] = useState<DirectoryProfile[]>(
    Object.values(COMMUNITY_PROFILES),
  );

  useEffect(() => {
    if (!isOpen) return;

    async function loadRealProfiles() {
      try {
        const supabase = createClient();
        const { data: dbProfiles, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, role");

        if (!error && dbProfiles && dbProfiles.length > 0) {
          const map = new Map<string, DirectoryProfile>();
          // Base mentor profiles first
          for (const p of Object.values(COMMUNITY_PROFILES)) {
            map.set(p.id, p);
          }
          // Real Supabase profiles
          for (const p of dbProfiles) {
            if (p.full_name) {
              map.set(p.id, {
                id: p.id,
                full_name: p.full_name,
                avatar_url: p.avatar_url,
                role: p.role || "Membre Evolve",
                online: true,
              });
            }
          }
          setContactsList(Array.from(map.values()));
        }
      } catch {
        // Fallback to COMMUNITY_PROFILES
      }
    }

    loadRealProfiles();
  }, [isOpen]);

  if (!isOpen) return null;

  const contacts = contactsList.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.bio?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand border border-brand/30">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Nouvel échange direct
              </h3>
              <p className="text-xs text-white/50">
                Contactez un formateur ou un créateur de projet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mt-4">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, rôle ou spécialité..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-brand focus:outline-none transition"
          />
        </div>

        {/* Contacts list */}
        <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
          {contacts.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40">
              Aucun membre trouvé pour "{search}".
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  onSelectContact(contact);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 p-3.5 text-left rounded-2xl hover:bg-white/5 transition group"
              >
                <div className="relative shrink-0">
                  {contact.avatar_url ? (
                    <img
                      src={contact.avatar_url}
                      alt={contact.full_name}
                      className="h-10 w-10 rounded-2xl object-cover border border-white/15"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/15 text-sm font-bold text-brand border border-brand/30">
                      {contact.full_name.charAt(0)}
                    </div>
                  )}
                  {contact.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-brand transition-colors">
                      {contact.full_name}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {contact.online ? "En ligne" : "Disponible"}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand/80 truncate">
                    {contact.role}
                  </p>
                  {contact.bio && (
                    <p className="text-[10px] text-white/50 truncate mt-0.5">
                      {contact.bio}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
