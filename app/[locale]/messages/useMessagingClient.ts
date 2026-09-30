"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectoryProfile } from "@/lib/community-directory";
import {
  type Conversation,
  type DirectMessage,
  isUuid,
} from "@/lib/messages-shared";
import { createClient } from "@/lib/supabase/client";

interface UseMessagingClientProps {
  initialConversations: Conversation[];
  initialMessagesMap: Record<string, DirectMessage[]>;
  initialActiveConvId: string;
  currentUserId?: string;
  recipientId?: string;
  courseTitle?: string;
}

export function useMessagingClient({
  initialConversations,
  initialMessagesMap,
  initialActiveConvId,
  currentUserId = "me",
  recipientId,
  courseTitle,
}: UseMessagingClientProps) {
  const supabase = createClient();

  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(initialActiveConvId);
  const [messagesMap, setMessagesMap] =
    useState<Record<string, DirectMessage[]>>(initialMessagesMap);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Remove conversations and messages previously cached by the demo messaging UI.
  useEffect(() => {
    try {
      window.localStorage.removeItem("evolve_messages_store_v5");
    } catch (error) {
      console.error("[Messaging] Unable to clear cached demo messages:", error);
    }
  }, []);

  // 2. Handle URL parameters (e.g. from community project "Échanger avec l'auteur")
  useEffect(() => {
    if (!recipientId) return;

    const matched = initialConversations.find(
      (conversation) => conversation.participant.id === recipientId,
    );
    if (!matched) {
      setActiveConvId("");
      return;
    }

    setActiveConvId(matched.id);
    if (courseTitle) {
      setNewMessageText(
        `Bonjour ${matched.participant.name}, j'ai découvert votre projet "${courseTitle}" sur la Communauté Evolve ! J'aimerais échanger avec vous à ce sujet : `,
      );
    } else {
      setNewMessageText(`Bonjour ${matched.participant.name}, `);
    }
  }, [recipientId, courseTitle, initialConversations]);

  // 3. Auto-scroll on messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeMessages = messagesMap[activeConvId] || [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: auto scroll on message length change
  useEffect(() => {
    scrollToBottom();
  }, [activeMessages.length, scrollToBottom]);

  // 4. Supabase Realtime subscription (INSERT + UPDATE for read receipts)
  useEffect(() => {
    if (!currentUserId || currentUserId === "me" || !isUuid(currentUserId)) {
      return;
    }

    const channel = supabase
      .channel("direct_messages_live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          const newDbMsg = payload.new as DirectMessage;
          if (!newDbMsg?.conversation_id) return;

          if (
            newDbMsg.sender_id === currentUserId ||
            newDbMsg.receiver_id === currentUserId
          ) {
            setMessagesMap((prev) => {
              const list = prev[newDbMsg.conversation_id] || [];
              if (list.some((m) => m.id === newDbMsg.id)) return prev;
              return {
                ...prev,
                [newDbMsg.conversation_id]: [...list, newDbMsg],
              };
            });

            if (
              newDbMsg.conversation_id === activeConvId &&
              newDbMsg.receiver_id === currentUserId
            ) {
              supabase
                .from("direct_messages")
                .update({ is_read: true })
                .eq("id", newDbMsg.id)
                .then(({ error }) => {
                  if (error) {
                    console.error(
                      "[Messaging] Unable to mark received message as read:",
                      error,
                    );
                    setActionError(
                      `Impossible de marquer le message comme lu : ${error.message}`,
                    );
                  }
                });
            } else if (newDbMsg.receiver_id === currentUserId) {
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === newDbMsg.conversation_id
                    ? {
                        ...c,
                        unread_count: c.unread_count + 1,
                        last_message: {
                          content: newDbMsg.content,
                          created_at: newDbMsg.created_at,
                          sender_id: newDbMsg.sender_id,
                          is_read: false,
                        },
                      }
                    : c,
                ),
              );
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          const updatedMsg = payload.new as DirectMessage;
          if (!updatedMsg?.conversation_id) return;

          setMessagesMap((prev) => {
            const list = prev[updatedMsg.conversation_id];
            if (!list) return prev;
            return {
              ...prev,
              [updatedMsg.conversation_id]: list.map((m) =>
                m.id === updatedMsg.id
                  ? { ...m, is_read: updatedMsg.is_read }
                  : m,
              ),
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeConvId, supabase]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // 5. Select conversation & mark as read
  const handleSelectConversation = async (id: string) => {
    if (!isUuid(currentUserId) || !isUuid(id)) {
      setActionError(
        "Cette conversation n'existe pas dans la base de données.",
      );
      return;
    }

    setActionError("");
    let error: Error | null = null;
    try {
      const result = await supabase
        .from("direct_messages")
        .update({ is_read: true })
        .eq("conversation_id", id)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);
      error = result.error;
    } catch (caughtError) {
      console.error(
        "[Messaging] Unable to mark messages as read:",
        caughtError,
      );
      setActionError(
        `Impossible de marquer les messages comme lus : ${caughtError instanceof Error ? caughtError.message : "erreur inattendue."}`,
      );
      return;
    }

    if (error) {
      setActionError(
        `Impossible de marquer les messages comme lus : ${error.message}`,
      );
      return;
    }

    setActiveConvId(id);
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread_count: 0,
              last_message: conversation.last_message
                ? { ...conversation.last_message, is_read: true }
                : null,
            }
          : conversation,
      ),
    );
    setMessagesMap((previous) => ({
      ...previous,
      [id]: (previous[id] ?? []).map((message) =>
        message.receiver_id === currentUserId
          ? { ...message, is_read: true }
          : message,
      ),
    }));
  };

  // 6. Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed) return;

    if (!activeConversation || !isUuid(currentUserId)) {
      setActionError(
        "Connectez-vous et choisissez un contact avant d'envoyer un message.",
      );
      return;
    }

    if (!isUuid(activeConversation.participant.id) || !isUuid(activeConvId)) {
      setActionError(
        "Le contact ou la conversation n'existe plus dans la base de données.",
      );
      return;
    }

    let newMessage: DirectMessage;
    try {
      const result = await supabase
        .from("direct_messages")
        .insert({
          conversation_id: activeConvId,
          sender_id: currentUserId,
          receiver_id: activeConversation.participant.id,
          content: trimmed,
        })
        .select(
          "id, conversation_id, sender_id, receiver_id, content, created_at, is_read",
        )
        .single();

      if (result.error) {
        setActionError(
          `Impossible d'enregistrer le message : ${result.error.message}`,
        );
        return;
      }
      newMessage = result.data;
    } catch (error) {
      console.error("[Messaging] Unable to send message:", error);
      setActionError(
        `Impossible d'enregistrer le message : ${error instanceof Error ? error.message : "erreur inattendue."}`,
      );
      return;
    }

    setActionError("");
    setMessagesMap((previous) => ({
      ...previous,
      [activeConvId]: previous[activeConvId]?.some(
        (message) => message.id === newMessage.id,
      )
        ? previous[activeConvId]
        : [...(previous[activeConvId] ?? []), newMessage],
    }));
    setConversations((previous) => {
      const updatedConversation = {
        ...activeConversation,
        last_message: {
          content: newMessage.content,
          created_at: newMessage.created_at,
          sender_id: newMessage.sender_id,
          is_read: newMessage.is_read,
        },
        unread_count: 0,
      };
      return [
        updatedConversation,
        ...previous.filter((conversation) => conversation.id !== activeConvId),
      ];
    });
    setNewMessageText("");
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNewMessageText((prev) => (prev ? `${prev} - ${prompt}` : prompt));
  };

  const handleSelectContact = async (contact: DirectoryProfile) => {
    if (!isUuid(currentUserId) || !isUuid(contact.id)) {
      setActionError("Le contact ne correspond pas à un profil enregistré.");
      return;
    }

    setActionError("");
    const existing = conversations.find(
      (conversation) => conversation.participant.id === contact.id,
    );
    let conversationId = existing?.id;

    if (!conversationId) {
      try {
        const { data, error } = await supabase.rpc(
          "get_or_create_conversation",
          { p_recipient_id: contact.id },
        );

        if (error || !data) {
          setActionError(
            `Impossible d'ouvrir la conversation : ${error?.message ?? "aucun identifiant retourné par la base de données."}`,
          );
          return;
        }
        conversationId = data;
      } catch (error) {
        console.error("[Messaging] Unable to open conversation:", error);
        setActionError(
          `Impossible d'ouvrir la conversation : ${error instanceof Error ? error.message : "erreur inattendue."}`,
        );
        return;
      }
    }

    if (!conversationId) {
      setActionError("La base de données n'a pas retourné de conversation.");
      return;
    }

    const conversation: Conversation = existing ?? {
      id: conversationId,
      participant: {
        id: contact.id,
        name: contact.full_name,
        avatar_url: contact.avatar_url,
        role: contact.role,
      },
      last_message: null,
      unread_count: 0,
    };

    setConversations((previous) => [
      conversation,
      ...previous.filter((item) => item.id !== conversation.id),
    ]);
    setActiveConvId(conversation.id);
    setNewMessageText(`Bonjour ${contact.full_name}, `);
  };

  return {
    conversations,
    activeConvId,
    messagesMap,
    newMessageText,
    setNewMessageText,
    searchFilter,
    setSearchFilter,
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    messagesEndRef,
    activeConversation,
    activeMessages,
    actionError,
    handleSelectConversation,
    handleSendMessage,
    handleQuickPromptClick,
    handleSelectContact,
  };
}
