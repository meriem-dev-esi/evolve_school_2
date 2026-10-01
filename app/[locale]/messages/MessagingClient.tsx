"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("messaging");
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
    handleBackToConversations,
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
      <div className="grid h-[calc(100dvh-13rem)] min-h-[560px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl md:grid-cols-12">
        <ConversationSidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          currentUserRole={props.currentUserRole}
          onSelectContact={handleSelectContact}
          locale={props.locale}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          className={activeConvId ? "hidden md:flex" : "flex"}
        />

        <section
          className={`${activeConvId ? "flex" : "hidden md:flex"} min-h-0 flex-col bg-zinc-950/40 md:col-span-7 lg:col-span-8`}
        >
          <ChatHeader
            activeConversation={activeConversation}
            onBack={handleBackToConversations}
          />

          {activeConversation ? (
            <>
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
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <p className="text-sm font-semibold text-white">
                {t("chooseConversation")}
              </p>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/50">
                {t("chooseConversationDescription")}
              </p>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                className="mt-5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-black transition hover:opacity-90"
              >
                {t("newConversation")}
              </button>
            </div>
          )}
        </section>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectContact={handleSelectContact}
      />
    </>
  );
}
