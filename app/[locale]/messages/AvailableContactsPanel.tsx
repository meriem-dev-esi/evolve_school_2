"use client";

import { Search, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { DirectoryProfile } from "@/lib/community-directory";
import { isStudentRole } from "@/lib/community-directory";
import { useAvailableContacts } from "./useAvailableContacts";

interface AvailableContactsPanelProps {
  currentUserRole: string;
  onSelectContact: (contact: DirectoryProfile) => Promise<boolean>;
}

export default function AvailableContactsPanel({
  currentUserRole,
  onSelectContact,
}: AvailableContactsPanelProps) {
  const t = useTranslations("messaging");
  const [search, setSearch] = useState("");
  const [selectingContactId, setSelectingContactId] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const { contacts, isLoading, error } = useAvailableContacts();
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.full_name.toLowerCase().includes(search.toLowerCase()) ||
      contact.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="flex max-h-[45%] min-h-48 flex-col border-t border-white/10">
      <div className="border-b border-white/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <UsersRound className="h-4 w-4 text-brand" />
          {isStudentRole(currentUserRole)
            ? t("availableTeachers")
            : t("availableStudents")}
          <span className="ms-auto rounded-full bg-brand/15 px-2 py-0.5 text-[10px] text-brand">
            {contacts.length}
          </span>
        </h3>
        <div className="relative mt-3">
          <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={t("searchContacts")}
            placeholder={t("searchContacts")}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 ps-9 pe-3 text-xs text-white placeholder-white/40 focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
        {selectionError && (
          <p className="p-3 text-center text-xs text-red-300" role="alert">
            {selectionError}
          </p>
        )}
        {error ? (
          <p className="p-4 text-center text-xs text-red-300" role="alert">
            {error}
          </p>
        ) : isLoading ? (
          <p className="p-4 text-center text-xs text-white/40">
            {t("loadingContacts")}
          </p>
        ) : filteredContacts.length === 0 ? (
          <p className="p-4 text-center text-xs text-white/40">
            {search
              ? t("noContactForSearch", { search })
              : t("noAvailableContacts")}
          </p>
        ) : (
          filteredContacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              disabled={Boolean(selectingContactId)}
              onClick={async () => {
                setSelectingContactId(contact.id);
                setSelectionError("");
                try {
                  if (!(await onSelectContact(contact))) {
                    setSelectionError(t("openConversationError"));
                  }
                } catch (caughtError) {
                  console.error(
                    "[Messaging] Unable to open conversation:",
                    caughtError,
                  );
                  setSelectionError(t("openConversationError"));
                } finally {
                  setSelectingContactId("");
                }
              }}
              className="flex w-full items-center gap-3 p-3 text-start transition hover:bg-white/5 disabled:cursor-wait disabled:opacity-50"
            >
              {contact.avatar_url ? (
                <img
                  src={contact.avatar_url}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-xl border border-white/15 object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/15 text-sm font-bold text-brand">
                  {contact.full_name.charAt(0)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-white">
                  {contact.full_name}
                </span>
                <span className="block truncate text-[10px] text-brand/80">
                  {contact.role}
                </span>
              </span>
              {selectingContactId === contact.id && (
                <span className="text-[10px] text-white/50">
                  {t("openingConversation")}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
