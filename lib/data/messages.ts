import "server-only";

import {
  type Conversation,
  type DirectMessage,
  isUuid,
} from "@/lib/messages-shared";
import { createClient } from "@/lib/supabase/server";

export async function getConversations(
  currentUserId?: string,
  recipientId?: string,
): Promise<Conversation[]> {
  if (typeof currentUserId !== "string" || !isUuid(currentUserId)) {
    return [];
  }

  const userId = currentUserId;
  const supabase = await createClient();
  let requestedConversation:
    | {
        id: string;
        participant_one: string;
        participant_two: string;
      }
    | undefined;

  if (isUuid(recipientId) && recipientId !== userId) {
    const { data: recipient, error: recipientError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .eq("id", recipientId)
      .maybeSingle();

    if (recipientError) {
      throw new Error(
        `Unable to load message recipient: ${recipientError.message}`,
      );
    }

    if (recipient) {
      const { data: conversationId, error: conversationError } =
        await supabase.rpc("get_or_create_conversation", {
          p_recipient_id: recipient.id,
        });

      if (conversationError) {
        throw new Error(
          `Unable to open message conversation: ${conversationError.message}`,
        );
      }

      if (conversationId) {
        requestedConversation = {
          id: conversationId,
          participant_one: userId,
          participant_two: recipient.id,
        };
      }
    }
  }

  const [conversationResult, messageResult] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, participant_one, participant_two")
      .or(`participant_one.eq.${userId},participant_two.eq.${userId}`),
    supabase
      .from("direct_messages")
      .select(
        "id, conversation_id, sender_id, receiver_id, content, created_at, is_read",
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true }),
  ]);

  if (conversationResult.error) {
    throw new Error(
      `Unable to load conversations: ${conversationResult.error.message}`,
    );
  }

  if (messageResult.error) {
    throw new Error(`Unable to load messages: ${messageResult.error.message}`);
  }

  const conversationRows = [
    ...(conversationResult.data ?? []),
    ...(requestedConversation ? [requestedConversation] : []),
  ];
  const otherUserIds = new Set<string>();

  for (const conversation of conversationRows) {
    const otherUserId =
      conversation.participant_one === userId
        ? conversation.participant_two
        : conversation.participant_two === userId
          ? conversation.participant_one
          : null;

    if (otherUserId) {
      otherUserIds.add(otherUserId);
    }
  }

  for (const message of messageResult.data ?? []) {
    otherUserIds.add(
      message.sender_id === userId ? message.receiver_id : message.sender_id,
    );
  }

  if (otherUserIds.size === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .in("id", Array.from(otherUserIds));

  if (profilesError) {
    throw new Error(
      `Unable to load message profiles: ${profilesError.message}`,
    );
  }

  const profileMap = new Map(
    (profiles ?? [])
      .filter((profile) => profile.full_name)
      .map((profile) => [profile.id, profile]),
  );
  const conversations = new Map<string, Conversation>();

  for (const row of conversationRows) {
    const otherUserId =
      row.participant_one === userId
        ? row.participant_two
        : row.participant_two === userId
          ? row.participant_one
          : null;
    const profile = otherUserId ? profileMap.get(otherUserId) : undefined;

    if (!otherUserId || !profile) {
      continue;
    }

    conversations.set(row.id, {
      id: row.id,
      participant: {
        id: profile.id,
        name: profile.full_name ?? "",
        avatar_url: profile.avatar_url,
        role: profile.role ?? "",
      },
      last_message: null,
      unread_count: 0,
    });
  }

  for (const message of messageResult.data ?? []) {
    const otherUserId =
      message.sender_id === userId ? message.receiver_id : message.sender_id;
    const profile = profileMap.get(otherUserId);

    if (!profile) {
      continue;
    }

    const conversationId = message.conversation_id;
    let conversation = conversations.get(conversationId);

    if (!conversation) {
      conversation = {
        id: conversationId,
        participant: {
          id: profile.id,
          name: profile.full_name ?? "",
          avatar_url: profile.avatar_url,
          role: profile.role ?? "",
        },
        last_message: null,
        unread_count: 0,
      };
      conversations.set(conversationId, conversation);
    }

    conversation.last_message = {
      content: message.content,
      created_at: message.created_at,
      sender_id: message.sender_id,
      is_read: message.is_read,
    };

    if (!message.is_read && message.receiver_id === userId) {
      conversation.unread_count += 1;
    }
  }

  return Array.from(conversations.values()).sort((a, b) => {
    const aDate = a.last_message?.created_at ?? "";
    const bDate = b.last_message?.created_at ?? "";
    return bDate.localeCompare(aDate);
  });
}

export async function getAllInitialMessagesMap(
  currentUserId?: string,
): Promise<Record<string, DirectMessage[]>> {
  if (typeof currentUserId !== "string" || !isUuid(currentUserId)) {
    return {};
  }

  const userId = currentUserId;
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("direct_messages")
    .select(
      "id, conversation_id, sender_id, receiver_id, content, created_at, is_read",
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load conversation messages: ${error.message}`);
  }

  return (messages ?? []).reduce<Record<string, DirectMessage[]>>(
    (messagesByConversation, message) => {
      const conversationMessages =
        messagesByConversation[message.conversation_id] ?? [];
      conversationMessages.push(message);
      messagesByConversation[message.conversation_id] = conversationMessages;
      return messagesByConversation;
    },
    {},
  );
}
