"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectoryProfile } from "@/lib/data/community-directory";
import type { Conversation, DirectMessage } from "@/lib/data/messages";
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
            convMap.set(c.id, c);
          }
          setConversations(Array.from(convMap.values()));

          // Merge messagesMap
          setMessagesMap((prev) => ({
            ...prev,
            ...parsed.messagesMap,
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
      const targetConvId = `conv-${recipientId}`;
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
  }, [recipientId, courseTitle, recipientName]);

  // 3. Auto-scroll on messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeMessages = messagesMap[activeConvId] || [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: auto scroll on message length change
  useEffect(() => {
    scrollToBottom();
  }, [activeMessages.length, scrollToBottom]);

  // 4. Supabase Realtime subscription
  useEffect(() => {
    if (!currentUserId || currentUserId === "me") return;

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
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, supabase]);

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
  };

  // 6. Send message handler (Real direct messaging)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed) return;

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();
    const receiverId = activeConversation?.participant.id || "support";

    const newMsg: DirectMessage = {
      id: messageId,
      conversation_id: activeConvId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: trimmed,
      created_at: nowIso,
      is_read: true,
    };

    // Update messages map
    const nextActiveMessages = [...(messagesMap[activeConvId] || []), newMsg];
    const updatedMessagesMap = {
      ...messagesMap,
      [activeConvId]: nextActiveMessages,
    };
    setMessagesMap(updatedMessagesMap);
    setNewMessageText("");

    // Update conversation snippet and move to top
    const updatedConversations = [
      {
        ...(activeConversation || {
          id: activeConvId,
          participant: {
            id: receiverId,
            name: "Discussion",
            avatar_url: null,
            role: "Membre Evolve",
          },
          unread_count: 0,
        }),
        last_message: {
          content: trimmed,
          created_at: nowIso,
          sender_id: currentUserId,
          is_read: true,
        },
        unread_count: 0,
      },
      ...conversations.filter((c) => c.id !== activeConvId),
    ];

    setConversations(updatedConversations);
    persistState(updatedConversations, updatedMessagesMap);

    // Save directly to Supabase if authenticated
    if (currentUserId && currentUserId !== "me") {
      try {
        await supabase.from("direct_messages").insert({
          conversation_id: activeConvId,
          sender_id: currentUserId,
          receiver_id: receiverId,
          content: trimmed,
        });
      } catch (err) {
        console.warn("[Messaging] Supabase direct message insert failed:", err);
      }
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNewMessageText((prev) => (prev ? `${prev} - ${prompt}` : prompt));
  };

  // 8. Start conversation with selected contact from modal
  const handleSelectContact = (contact: DirectoryProfile) => {
    const convId = `conv-${contact.id}`;
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
