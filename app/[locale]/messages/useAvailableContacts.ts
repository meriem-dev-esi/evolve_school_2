"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { DirectoryProfile } from "@/lib/community-directory";

export function useAvailableContacts(enabled = true) {
  const t = useTranslations("messaging");
  const [contacts, setContacts] = useState<DirectoryProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function loadContacts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/messages/contacts", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          contacts?: DirectoryProfile[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error || t("contactLoadError"));
        }

        if (!cancelled) {
          setContacts(result.contacts ?? []);
        }
      } catch (caughtError) {
        console.error("[Messaging] Unable to load contacts:", caughtError);
        if (!cancelled) {
          setContacts([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : t("contactLoadError"),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadContacts();
    return () => {
      cancelled = true;
    };
  }, [enabled, t]);

  return { contacts, isLoading, error };
}
