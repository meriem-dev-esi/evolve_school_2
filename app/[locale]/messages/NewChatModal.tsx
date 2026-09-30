"use client";

import { MessageSquare, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type DirectoryProfile,
  isStudentTeacherPair,
} from "@/lib/community-directory";
import { createClient } from "@/lib/supabase/client";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  onSelectContact: (contact: DirectoryProfile) => void | Promise<void>;
}

export default function NewChatModal({
  isOpen,
  onClose,
  currentUserRole,
  onSelectContact,
}: NewChatModalProps) {
  const [search, setSearch] = useState("");
  const [contactsList, setContactsList] = useState<DirectoryProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadRealProfiles() {
      setIsLoading(true);
      setLoadError("");
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }
        if (!user) {
          throw new Error("Connectez-vous pour rechercher des membres.");
        }

        const { data: dbProfiles, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, role");

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setContactsList(
            (dbProfiles ?? [])
              .filter(
                (profile) =>
                  profile.id !== user.id &&
                  profile.full_name &&
                  profile.role &&
                  isStudentTeacherPair(currentUserRole, profile.role),
              )
              .map((profile) => ({
                id: profile.id,
                full_name: profile.full_name ?? "",
                avatar_url: profile.avatar_url,
                role: profile.role ?? "",
              })),
          );
        }
      } catch (error) {
        console.error("[Messaging] Unable to load contacts:", error);
        if (!cancelled) {
          setContactsList([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Impossible de charger les membres depuis la base de données.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRealProfiles();

    return () => {
      cancelled = true;
    };
  }, [currentUserRole, isOpen]);

  if (!isOpen) return null;

  const contacts = contactsList.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
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
                Choisissez un étudiant ou un formateur inscrit
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
          {loadError ? (
            <div className="py-8 text-center text-xs text-red-300" role="alert">
              {loadError}
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center text-xs text-white/40">
              Chargement des membres...
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40">
              {search
                ? `Aucun membre trouvé pour "${search}".`
                : "Aucun autre profil disponible dans la base de données."}
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={async () => {
                  await onSelectContact(contact);
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
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-brand transition-colors">
                      {contact.full_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand/80 truncate">
                    {contact.role}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
