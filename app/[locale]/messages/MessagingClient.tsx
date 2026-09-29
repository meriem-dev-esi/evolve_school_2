"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectoryProfile } from "@/lib/data/community-directory";
import {
  type Conversation,
  type DirectMessage,
  isUuid,
} from "@/lib/data/messages-shared";
import { createClient } from "@/lib/supabase/client";
import ChatHeader from "./ChatHeader";
import ConversationSidebar from "./ConversationSidebar";
import MessageComposer from "./MessageComposer";
import MessagesThread from "./MessagesThread";
import NewChatModal from "./NewChatModal";

const STORAGE_KEY = "evolve_messages_store_v5";

interface MessagingClientProps {
  initialConversations: Conversation[];
  initialMessagesMap: Record<string, DirectMessage[]>;
  initialActiveConvId: string;
  currentUserId?: string;
  recipientId?: string;
  courseTitle?: string;
  recipientName?: string;
  locale: string;
}

export default function MessagingClient({
  initialConversations,
  initialMessagesMap,
  initialActiveConvId,
  currentUserId = "me",
  recipientId,
  courseTitle,
  recipientName,
  locale,
}: MessagingClientProps) {
  const supabase = createClient();

  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(initialActiveConvId);
  const [messagesMap, setMessagesMap] =
    useState<Record<string, DirectMessage[]>>(initialMessagesMap);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load persisted conversations and messages from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.conversations && parsed.messagesMap) {
          // Merge stored conversations with initial
          const convMap = new Map<string, Conversation>();
          for (const c of initialConversations) {
            convMap.set(c.id, c);
          }
          for (const c of parsed.conversations) {
            if (!convMap.has(c.id)) {
              convMap.set(c.id, c);
            }
          }
          setConversations(Array.from(convMap.values()));

          // Merge messagesMap
          setMessagesMap((prev) => ({
            ...parsed.messagesMap,
            ...prev,
          }));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [initialConversations]);

  // Save changes to localStorage
  const persistState = useCallback(
    (
      newConversations: Conversation[],
      newMessagesMap: Record<string, DirectMessage[]>,
    ) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            conversations: newConversations,
            messagesMap: newMessagesMap,
          }),
        );
      } catch {
        // Storage quota / error
      }
    },
    [],
  );

  // 2. Handle URL parameters (e.g. from community project "Échanger avec l'auteur")
  useEffect(() => {
    if (recipientId) {
      const matched = conversations.find(
        (c) => c.participant.id === recipientId,
      );
      const targetConvId = matched ? matched.id : `conv-${recipientId}`;
      setActiveConvId(targetConvId);

      // Pre-fill greeting message if courseTitle or recipient provided
      const contactName = recipientName || "l'auteur";
      if (courseTitle) {
        setNewMessageText(
          `Bonjour ${contactName}, j'ai découvert votre projet "${courseTitle}" sur la Communauté Evolve ! J'aimerais échanger avec vous à ce sujet : `,
        );
      } else {
        setNewMessageText(`Bonjour ${contactName}, `);
      }
    }
  }, [recipientId, courseTitle, recipientName, conversations]);

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

          // Only process if relevant to current user
          if (
            newDbMsg.sender_id === currentUserId ||
            newDbMsg.receiver_id === currentUserId
          ) {
            setMessagesMap((prev) => {
              const list = prev[newDbMsg.conversation_id] || [];
              if (list.some((m) => m.id === newDbMsg.id)) return prev;
              const updated = {
                ...prev,
                [newDbMsg.conversation_id]: [...list, newDbMsg],
              };
              return updated;
            });

            // If active conversation is this one and we are recipient, mark as read
            if (
              newDbMsg.conversation_id === activeConvId &&
              newDbMsg.receiver_id === currentUserId
            ) {
              supabase
                .from("direct_messages")
                .update({ is_read: true })
                .eq("id", newDbMsg.id)
                .then();
            } else if (newDbMsg.receiver_id === currentUserId) {
              // Increment unread count for other conversation
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

  // Active conversation object
  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // 5. Select conversation & mark as read
  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, unread_count: 0 } : c,
      );
      persistState(next, messagesMap);
      return next;
    });

    // Mark as read in Supabase if real DB conversation
    if (isUuid(currentUserId) && isUuid(id)) {
      supabase
        .from("direct_messages")
        .update({ is_read: true })
        .eq("conversation_id", id)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false)
        .then(({ error }) => {
          if (error) {
            console.warn("[Messaging] Mark as read failed:", error.message);
          }
        });
    }
  };

  // 6. Send message handler (Real direct messaging with Supabase fallback)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed) return;

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();
    const receiverId = activeConversation?.participant.id || "support";

    let targetConvId = activeConvId;

    // If both users are real UUIDs, ensure real Supabase conversation
    if (
      isUuid(currentUserId) &&
      isUuid(receiverId) &&
      currentUserId !== receiverId
    ) {
      if (!isUuid(targetConvId)) {
        try {
          const { data: dbConvId, error } = await supabase.rpc(
            "get_or_create_conversation",
            { p_recipient_id: receiverId },
          );
          if (!error && dbConvId) {
            targetConvId = dbConvId;
            setActiveConvId(dbConvId);
          }
        } catch (rpcErr) {
          console.warn("[Messaging] get_or_create_conversation error:", rpcErr);
        }
      }
    }

    const newMsg: DirectMessage = {
      id: messageId,
      conversation_id: targetConvId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: trimmed,
      created_at: nowIso,
      is_read: true,
    };

    // Update messages map
    const nextActiveMessages = [...(messagesMap[targetConvId] || []), newMsg];
    const updatedMessagesMap = {
      ...messagesMap,
      [targetConvId]: nextActiveMessages,
    };
    setMessagesMap(updatedMessagesMap);
    setNewMessageText("");

    // Update conversation snippet and move to top
    const updatedConversations = [
      {
        ...(activeConversation || {
          id: targetConvId,
          participant: {
            id: receiverId,
            name: "Discussion",
            avatar_url: null,
            role: "Membre Evolve",
          },
          unread_count: 0,
        }),
        id: targetConvId,
        last_message: {
          content: trimmed,
          created_at: nowIso,
          sender_id: currentUserId,
          is_read: true,
        },
        unread_count: 0,
      },
      ...conversations.filter(
        (c) => c.id !== activeConvId && c.id !== targetConvId,
      ),
    ];

    setConversations(updatedConversations);
    persistState(updatedConversations, updatedMessagesMap);

    // Save directly to Supabase if both are real UUIDs and conversation is UUID
    if (isUuid(currentUserId) && isUuid(receiverId) && isUuid(targetConvId)) {
      try {
        const { error: insertError } = await supabase
          .from("direct_messages")
          .insert({
            conversation_id: targetConvId,
            sender_id: currentUserId,
            receiver_id: receiverId,
            content: trimmed,
          });

        if (insertError) {
          console.warn(
            "[Messaging] Supabase insert failed:",
            insertError.message,
          );
        }
      } catch (err) {
        console.warn("[Messaging] Supabase direct message insert failed:", err);
      }
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNewMessageText((prev) => (prev ? `${prev} - ${prompt}` : prompt));
  };

  // 8. Start conversation with selected contact from modal
  const handleSelectContact = async (contact: DirectoryProfile) => {
    let convId = `conv-${contact.id}`;

    // If both are UUIDs, create or fetch existing conversation UUID
    if (
      isUuid(currentUserId) &&
      isUuid(contact.id) &&
      currentUserId !== contact.id
    ) {
      try {
        const { data: dbConvId, error } = await supabase.rpc(
          "get_or_create_conversation",
          { p_recipient_id: contact.id },
        );
        if (!error && dbConvId) {
          convId = dbConvId;
        }
      } catch {
        // Fallback
      }
    }

    const existing = conversations.find(
      (c) => c.id === convId || c.participant.id === contact.id,
    );

    if (existing) {
      setActiveConvId(existing.id);
      return;
    }

    const newConv: Conversation = {
      id: convId,
      participant: {
        id: contact.id,
        name: contact.full_name,
        avatar_url: contact.avatar_url,
        role: contact.role,
        online: contact.online ?? true,
      },
      last_message: {
        content: "Nouvelle discussion initiée",
        created_at: new Date().toISOString(),
        sender_id: contact.id,
        is_read: true,
      },
      unread_count: 0,
    };

    const nextConvs = [newConv, ...conversations];
    setConversations(nextConvs);
    setActiveConvId(convId);
    persistState(nextConvs, messagesMap);
    setNewMessageText(`Bonjour ${contact.full_name}, `);
  };

  return (
    <>
      <div className="grid h-[calc(100vh-14rem)] min-h-[580px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl md:grid-cols-12">
        <ConversationSidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          locale={locale}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
        />

        <section className="flex flex-col md:col-span-7 lg:col-span-8 bg-zinc-950/40">
          <ChatHeader activeConversation={activeConversation} />

          <MessagesThread
            messages={activeMessages}
            currentUserId={currentUserId}
            locale={locale}
            messagesEndRef={messagesEndRef}
          />

          <MessageComposer
            newMessageText={newMessageText}
            onChangeText={setNewMessageText}
            onSubmit={handleSendMessage}
            onQuickPromptClick={handleQuickPromptClick}
            placeholder={
              activeConversation?.participant
                ? `Écrivez à ${activeConversation.participant.name}...`
                : "Posez votre question..."
            }
          />
        </section>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectContact={handleSelectContact}
      />
    </>
  );
}
