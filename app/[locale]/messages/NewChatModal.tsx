"use client";

import { MessageSquare, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { DirectoryProfile } from "@/lib/community-directory";
import { useAvailableContacts } from "./useAvailableContacts";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: DirectoryProfile) => Promise<boolean>;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onSelectContact,
}: NewChatModalProps) {
  const t = useTranslations("messaging");
  const [search, setSearch] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const [selectingContactId, setSelectingContactId] = useState("");
  const {
    contacts: contactsList,
    isLoading,
    error: loadError,
  } = useAvailableContacts(isOpen);

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
                {t("newChatTitle")}
              </h3>
              <p className="text-xs text-white/50">{t("newChatSubtitle")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
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
            placeholder={t("searchContacts")}
            aria-label={t("searchContacts")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 ps-10 pe-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-brand focus:outline-none transition"
          />
        </div>

        {/* Contacts list */}
        <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
          {selectionError && (
            <div className="mb-3 text-center text-xs text-red-300" role="alert">
              {selectionError}
            </div>
          )}
          {loadError ? (
            <div className="py-8 text-center text-xs text-red-300" role="alert">
              {loadError}
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center text-xs text-white/40">
              {t("loadingContacts")}
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40">
              {search ? t("noContactForSearch", { search }) : t("noContacts")}
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                disabled={Boolean(selectingContactId)}
                onClick={async () => {
                  setSelectingContactId(contact.id);
                  setSelectionError("");
                  try {
                    if (await onSelectContact(contact)) {
                      onClose();
                    } else {
                      setSelectionError(t("openConversationError"));
                    }
                  } catch (error) {
                    console.error(
                      "[Messaging] Unable to open conversation:",
                      error,
                    );
                    setSelectionError(t("openConversationError"));
                  } finally {
                    setSelectingContactId("");
                  }
                }}
                className="w-full flex items-center gap-3.5 p-3.5 text-left rounded-2xl hover:bg-white/5 transition group disabled:cursor-wait disabled:opacity-50"
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
                    {selectingContactId === contact.id && (
                      <span className="text-[10px] text-white/50">
                        {t("openingConversation")}
                      </span>
                    )}
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
