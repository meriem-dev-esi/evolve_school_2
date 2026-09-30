"use client";

import type { Conversation, DirectMessage } from "@/lib/messages-shared";
import ChatHeader from "./ChatHeader";
import ConversationSidebar from "./ConversationSidebar";
import MessageComposer from "./MessageComposer";
import MessagesThread from "./MessagesThread";
import NewChatModal from "./NewChatModal";
import { useMessagingClient } from "./useMessagingClient";

interface MessagingClientProps {
  initialConversations: Conversation[];
  initialMessagesMap: Record<string, DirectMessage[]>;
  initialActiveConvId: string;
  currentUserId?: string;
  currentUserRole: string;
  recipientId?: string;
  courseTitle?: string;
  locale: string;
}

export default function MessagingClient(props: MessagingClientProps) {
  const {
    conversations,
    activeConvId,
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
  } = useMessagingClient(props);

  return (
    <>
      {actionError && (
        <p
          className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {actionError}
        </p>
      )}
      <div className="grid h-[calc(100vh-14rem)] min-h-[580px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl md:grid-cols-12">
        <ConversationSidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          locale={props.locale}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
        />

        <section className="flex flex-col md:col-span-8 lg:col-span-9 bg-zinc-950/40">
          <ChatHeader activeConversation={activeConversation} />

          <MessagesThread
            messages={activeMessages}
            currentUserId={props.currentUserId || "me"}
            locale={props.locale}
            messagesEndRef={messagesEndRef}
          />

          <MessageComposer
            newMessageText={newMessageText}
            onChangeText={setNewMessageText}
            onSubmit={handleSendMessage}
            onQuickPromptClick={handleQuickPromptClick}
            disabled={!activeConversation}
          />
        </section>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        currentUserRole={props.currentUserRole}
        onSelectContact={handleSelectContact}
      />
    </>
  );
}
