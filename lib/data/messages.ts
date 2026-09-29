import "server-only";

import { resolveAuthorProfile } from "@/lib/data/community-directory";
import { createClient } from "@/lib/supabase/server";

export interface MessageUser {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
  online?: boolean;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  participant: MessageUser;
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
    is_read: boolean;
  };
  unread_count: number;
}

export const BASE_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participant: {
      id: "teacher-amina",
      name: "Amina Benali",
      avatar_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      role: "Instructrice UI/UX Design",
      online: true,
    },
    last_message: {
      content:
        "Superbe progression ! N'hésitez pas à partager votre projet dans l'onglet Communauté.",
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      sender_id: "teacher-amina",
      is_read: false,
    },
    unread_count: 1,
  },
  {
    id: "conv-2",
    participant: {
      id: "teacher-yacine",
      name: "Yacine Mansouri",
      avatar_url:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      role: "Lead Formateur Web Fullstack",
      online: true,
    },
    last_message: {
      content: "Merci Yacine ! Les exemples sur Next.js 15 sont très clairs.",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      sender_id: "me",
      is_read: true,
    },
    unread_count: 0,
  },
  {
    id: "conv-3",
    participant: {
      id: "support-evolve",
      name: "Support Evolve Academy",
      avatar_url: "/logo.png",
      role: "Équipe Pédagogique",
      online: true,
    },
    last_message: {
      content:
        "Votre inscription à l'atelier présentiel du samedi est confirmée. Rendez-vous à 10h !",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      sender_id: "support-evolve",
      is_read: true,
    },
    unread_count: 0,
  },
];

export const BASE_MESSAGES_MAP: Record<string, DirectMessage[]> = {
  "conv-1": [
    {
      id: "m-101",
      conversation_id: "conv-1",
      sender_id: "teacher-amina",
      receiver_id: "me",
      content:
        "Bonjour ! Avez-vous pu tester les maquettes Figma du dernier atelier ?",
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      is_read: true,
    },
    {
      id: "m-102",
      conversation_id: "conv-1",
      sender_id: "me",
      receiver_id: "teacher-amina",
      content:
        "Oui, j'ai terminé l'écran d'accueil et le responsive sur mobile !",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      is_read: true,
    },
    {
      id: "m-103",
      conversation_id: "conv-1",
      sender_id: "teacher-amina",
      receiver_id: "me",
      content:
        "Superbe progression ! N'hésitez pas à partager votre projet dans l'onglet Communauté pour avoir des retours.",
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      is_read: false,
    },
  ],
  "conv-2": [
    {
      id: "m-201",
      conversation_id: "conv-2",
      sender_id: "teacher-yacine",
      receiver_id: "me",
      content:
        "Bienvenue sur le module Next.js 15 & Supabase. Si vous rencontrez un problème sur l'authentification ou les requêtes, écrivez-moi.",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      is_read: true,
    },
    {
      id: "m-202",
      conversation_id: "conv-2",
      sender_id: "me",
      receiver_id: "teacher-yacine",
      content: "Merci Yacine ! Les exemples sur Next.js 15 sont très clairs.",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      is_read: true,
    },
  ],
  "conv-3": [
    {
      id: "m-301",
      conversation_id: "conv-3",
      sender_id: "support-evolve",
      receiver_id: "me",
      content:
        "Votre inscription à l'atelier présentiel du samedi est confirmée. Rendez-vous à 10h à l'académie.",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      is_read: true,
    },
  ],
};

export async function getConversations(
  currentUserId?: string,
  recipientId?: string,
  recipientName?: string,
): Promise<Conversation[]> {
  const conversationsMap = new Map<string, Conversation>();

  // If a specific recipient is requested (e.g. from community project author)
  if (recipientId) {
    const authorProfile = resolveAuthorProfile(recipientId);
    const convId = `conv-${recipientId}`;
    conversationsMap.set(convId, {
      id: convId,
      participant: {
        id: recipientId,
        name: recipientName || authorProfile.full_name,
        avatar_url: authorProfile.avatar_url,
        role: authorProfile.role,
        online: true,
      },
      last_message: {
        content: "Nouvelle discussion initiée",
        created_at: new Date().toISOString(),
        sender_id: recipientId,
        is_read: true,
      },
      unread_count: 0,
    });
  }

  // Populate base conversations
  for (const conv of BASE_CONVERSATIONS) {
    if (!conversationsMap.has(conv.id)) {
      conversationsMap.set(conv.id, conv);
    }
  }

  // Fetch real messages from Supabase if user is logged in
  if (currentUserId && currentUserId !== "me") {
    try {
      const supabase = await createClient();
      const { data: dbMessages, error } = await supabase
        .from("direct_messages")
        .select(
          "id, conversation_id, sender_id, receiver_id, content, created_at, is_read",
        )
        .order("created_at", { ascending: false });

      if (!error && dbMessages && dbMessages.length > 0) {
        for (const msg of dbMessages) {
          const otherUserId =
            msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
          const convId = msg.conversation_id || `conv-${otherUserId}`;
          const isUnreadForMe =
            !msg.is_read && msg.receiver_id === currentUserId;

          if (!conversationsMap.has(convId)) {
            const authorProfile = resolveAuthorProfile(otherUserId);
            conversationsMap.set(convId, {
              id: convId,
              participant: {
                id: otherUserId,
                name: authorProfile.full_name,
                avatar_url: authorProfile.avatar_url,
                role: authorProfile.role,
                online: false,
              },
              last_message: {
                content: msg.content,
                created_at: msg.created_at,
                sender_id: msg.sender_id,
                is_read: msg.is_read,
              },
              unread_count: isUnreadForMe ? 1 : 0,
            });
          } else if (isUnreadForMe) {
            const existing = conversationsMap.get(convId);
            if (existing) {
              existing.unread_count += 1;
            }
          }
        }
      }
    } catch {
      // Fallback smoothly to map
    }
  }

  return Array.from(conversationsMap.values());
}

export async function getConversationMessages(
  conversationId: string,
): Promise<{ participant: MessageUser; messages: DirectMessage[] }> {
  // If in Supabase
  try {
    const supabase = await createClient();
    const { data: dbMessages, error } = await supabase
      .from("direct_messages")
      .select(
        "id, conversation_id, sender_id, receiver_id, content, created_at, is_read",
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && dbMessages && dbMessages.length > 0) {
      const firstMsg = dbMessages[0];
      const otherId = firstMsg ? firstMsg.sender_id : "teacher-amina";
      const profile = resolveAuthorProfile(otherId);

      return {
        participant: {
          id: otherId,
          name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: profile.role,
          online: true,
        },
        messages: dbMessages,
      };
    }
  } catch {
    // Continue
  }

  // Check community author conversation: e.g. conv-10000000-...
  if (conversationId.startsWith("conv-1000")) {
    const authorId = conversationId.replace("conv-", "");
    const profile = resolveAuthorProfile(authorId);
    return {
      participant: {
        id: authorId,
        name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        online: true,
      },
      messages: [],
    };
  }

  const baseConv = BASE_CONVERSATIONS.find((c) => c.id === conversationId);
  const fallbackParticipant: MessageUser = {
    id: "teacher-amina",
    name: "Amina Benali",
    avatar_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Instructrice UI/UX Design",
    online: true,
  };
  const participant = baseConv?.participant ?? fallbackParticipant;
  const messages = BASE_MESSAGES_MAP[conversationId] ?? [];

  return {
    participant,
    messages,
  };
}

export function getAllInitialMessagesMap(): Record<string, DirectMessage[]> {
  return BASE_MESSAGES_MAP;
}
