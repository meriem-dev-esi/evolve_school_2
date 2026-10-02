"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DirectoryProfile,
  isStudentTeacherPair,
} from "@/lib/community-directory";
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
  currentUserRole: string;
  recipientId?: string;
  courseTitle?: string;
}

export function useMessagingClient({
  initialConversations,
  initialMessagesMap,
  initialActiveConvId,
  currentUserId = "me",
  currentUserRole,
  recipientId,
  courseTitle,
}: UseMessagingClientProps) {
  const t = useTranslations("messaging");
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
  const knownConversationIdsRef = useRef(
    new Set(initialConversations.map((conversation) => conversation.id)),
  );

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
      setActionError(t("recipientUnavailable"));
      setIsNewChatModalOpen(true);
      return;
    }

    setActiveConvId(matched.id);
    if (courseTitle) {
      setNewMessageText(
        t("projectGreeting", {
          name: matched.participant.name,
          course: courseTitle,
        }),
      );
    } else {
      setNewMessageText(
        t("contactGreeting", { name: matched.participant.name }),
      );
    }
  }, [recipientId, courseTitle, initialConversations, t]);

  useEffect(() => {
    if (courseTitle && !recipientId) {
      setIsNewChatModalOpen(true);
    }
  }, [courseTitle, recipientId]);

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
                      t("receivedMessageReadError", { error: error.message }),
                    );
                  }
                });
            }

            setConversations((prev) =>
              prev
                .map((conversation) =>
                  conversation.id === newDbMsg.conversation_id
                    ? {
                        ...conversation,
                        unread_count:
                          newDbMsg.receiver_id === currentUserId
                            ? newDbMsg.conversation_id === activeConvId
                              ? 0
                              : conversation.unread_count + 1
                            : conversation.unread_count,
                        last_message: {
                          content: newDbMsg.content,
                          created_at: newDbMsg.created_at,
                          sender_id: newDbMsg.sender_id,
                          is_read:
                            newDbMsg.is_read ||
                            (newDbMsg.receiver_id === currentUserId &&
                              newDbMsg.conversation_id === activeConvId),
                        },
                      }
                    : conversation,
                )
                .sort((first, second) =>
                  (second.last_message?.created_at ?? "").localeCompare(
                    first.last_message?.created_at ?? "",
                  ),
                ),
            );

            if (
              newDbMsg.receiver_id === currentUserId &&
              !knownConversationIdsRef.current.has(newDbMsg.conversation_id)
            ) {
              knownConversationIdsRef.current.add(newDbMsg.conversation_id);
              void supabase
                .rpc("get_messaging_contact_profiles", {
                  p_user_ids: [newDbMsg.sender_id],
                })
                .then(
                  ({ data, error }) => {
                    if (error) {
                      knownConversationIdsRef.current.delete(
                        newDbMsg.conversation_id,
                      );
                      console.error(
                        "[Messaging] Unable to load incoming conversation contact:",
                        error,
                      );
                      setActionError(
                        t("openConversationFailure", {
                          error: error.message,
                        }),
                      );
                      return;
                    }

                    const profile = data?.[0];
                    if (!profile?.full_name || !profile.role) {
                      knownConversationIdsRef.current.delete(
                        newDbMsg.conversation_id,
                      );
                      setActionError(t("contactOrConversationUnavailable"));
                      return;
                    }

                    setConversations((previous) => {
                      if (
                        previous.some(
                          (conversation) =>
                            conversation.id === newDbMsg.conversation_id,
                        )
                      ) {
                        return previous;
                      }

                      return [
                        {
                          id: newDbMsg.conversation_id,
                          participant: {
                            id: profile.id,
                            name: profile.full_name,
                            avatar_url: null,
                            role: profile.role,
                          },
                          last_message: {
                            content: newDbMsg.content,
                            created_at: newDbMsg.created_at,
                            sender_id: newDbMsg.sender_id,
                            is_read: newDbMsg.is_read,
                          },
                          unread_count:
                            newDbMsg.conversation_id === activeConvId ? 0 : 1,
                        },
                        ...previous,
                      ].sort((first, second) =>
                        (second.last_message?.created_at ?? "").localeCompare(
                          first.last_message?.created_at ?? "",
                        ),
                      );
                    });
                  },
                  (caughtError: unknown) => {
                    knownConversationIdsRef.current.delete(
                      newDbMsg.conversation_id,
                    );
                    console.error(
                      "[Messaging] Unable to load incoming conversation contact:",
                      caughtError,
                    );
                    setActionError(
                      t("openConversationFailure", {
                        error:
                          caughtError instanceof Error
                            ? caughtError.message
                            : t("unexpectedError"),
                      }),
                    );
                  },
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
  }, [currentUserId, activeConvId, supabase, t]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // 5. Select conversation & mark as read
  const handleSelectConversation = async (id: string) => {
    if (!isUuid(currentUserId) || !isUuid(id)) {
      setActionError(t("conversationUnavailable"));
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
      error =
        caughtError instanceof Error
          ? caughtError
          : new Error(t("unexpectedError"));
    }

    setActiveConvId(id);
    if (error) {
      setActionError(t("markReadError", { error: error.message }));
    } else {
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
    }
  };

  const handleBackToConversations = () => {
    setActiveConvId("");
    setNewMessageText("");
  };

  // 6. Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed) return;

    if (!activeConversation || !isUuid(currentUserId)) {
      setActionError(t("loginBeforeSending"));
      return;
    }

    if (
      !isStudentTeacherPair(
        currentUserRole,
        activeConversation.participant.role,
      )
    ) {
      setActionError(t("studentTeacherOnly"));
      return;
    }

    if (!isUuid(activeConversation.participant.id) || !isUuid(activeConvId)) {
      setActionError(t("contactOrConversationUnavailable"));
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
        setActionError(t("sendMessageError", { error: result.error.message }));
        return;
      }
      newMessage = result.data;
    } catch (error) {
      console.error("[Messaging] Unable to send message:", error);
      setActionError(
        t("sendMessageError", {
          error: error instanceof Error ? error.message : t("unexpectedError"),
        }),
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
    knownConversationIdsRef.current.add(activeConvId);
    setNewMessageText("");
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNewMessageText((prev) => (prev ? `${prev} - ${prompt}` : prompt));
  };

  const handleSelectContact = async (contact: DirectoryProfile) => {
    if (!isUuid(currentUserId) || !isUuid(contact.id)) {
      setActionError(t("invalidSavedContact"));
      return false;
    }

    if (!isStudentTeacherPair(currentUserRole, contact.role)) {
      setActionError(t("studentTeacherOnly"));
      return false;
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
            t("openConversationFailure", {
              error: error?.message ?? t("unexpectedError"),
            }),
          );
          return false;
        }
        conversationId = data;
      } catch (error) {
        console.error("[Messaging] Unable to open conversation:", error);
        setActionError(
          t("openConversationFailure", {
            error:
              error instanceof Error ? error.message : t("unexpectedError"),
          }),
        );
        return false;
      }
    }

    if (!conversationId) {
      setActionError(t("noConversationReturned"));
      return false;
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
    knownConversationIdsRef.current.add(conversation.id);
    setActiveConvId(conversation.id);
    setNewMessageText(
      courseTitle
        ? t("courseGreeting", {
            name: contact.full_name,
            course: courseTitle,
          })
        : t("contactGreeting", { name: contact.full_name }),
    );
    return true;
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
    handleBackToConversations,
    handleSendMessage,
    handleQuickPromptClick,
    handleSelectContact,
  };
}
