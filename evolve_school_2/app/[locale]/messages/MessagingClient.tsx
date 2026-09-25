"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, DirectMessage } from "@/lib/data/messages";
import ChatHeader from "./ChatHeader";
import ConversationSidebar from "./ConversationSidebar";
import MessageComposer from "./MessageComposer";
import MessagesThread from "./MessagesThread";

interface MessagingClientProps {
  initialConversations: Conversation[];
  initialMessages: DirectMessage[];
  currentUserId?: string;
  recipientId?: string;
  courseTitle?: string;
  locale: string;
}

export default function MessagingClient({
  initialConversations,
  initialMessages,
  currentUserId = "me",
  recipientId,
  courseTitle,
  locale,
}: MessagingClientProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversations[0]?.id || "conv-1",
  );
  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages must trigger scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle course-linked pre-fill message if recipientId was passed in query param
  useEffect(() => {
    if (courseTitle && recipientId) {
      setNewMessageText(
        `Bonjour, j'ai une question concernant le cours "${courseTitle}" : `,
      );
    }
  }, [courseTitle, recipientId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: activeConvId,
      sender_id: currentUserId,
      receiver_id: activeConversation?.participant.id || "support",
      content: trimmed,
      created_at: new Date().toISOString(),
      is_read: true,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              last_message: {
                content: trimmed,
                created_at: new Date().toISOString(),
                sender_id: currentUserId,
                is_read: true,
              },
            }
          : c,
      ),
    );

    // Simulate teacher automated response after 2.5 seconds if this is a demo
    setTimeout(() => {
      const replyMsg: DirectMessage = {
        id: `reply-${Date.now()}`,
        conversation_id: activeConvId,
        sender_id: activeConversation?.participant.id || "teacher",
        receiver_id: currentUserId,
        content:
          "Merci pour votre message ! Je regarde cela avec attention et reviens vers vous rapidement. Bon travail sur vos projets !",
        created_at: new Date().toISOString(),
        is_read: true,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2500);
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNewMessageText((prev) => (prev ? `${prev} -${prompt}` : prompt));
  };

  return (
    <div className="grid h-[calc(100vh-14rem)] min-h-[580px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl md:grid-cols-12">
      <ConversationSidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={setActiveConvId}
        searchFilter={searchFilter}
        onSearchFilterChange={setSearchFilter}
        locale={locale}
      />

      <section className="flex flex-col md:col-span-7 lg:col-span-8 bg-zinc-950/40">
        <ChatHeader activeConversation={activeConversation} />

        <MessagesThread
          messages={messages}
          currentUserId={currentUserId}
          locale={locale}
          messagesEndRef={messagesEndRef}
        />

        <MessageComposer
          newMessageText={newMessageText}
          onChangeText={setNewMessageText}
          onSubmit={handleSendMessage}
          onQuickPromptClick={handleQuickPromptClick}
        />
      </section>
    </div>
  );
}
