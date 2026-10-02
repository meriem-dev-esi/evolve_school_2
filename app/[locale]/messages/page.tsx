import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import {
  getAllInitialMessagesMap,
  getConversations,
} from "@/lib/data/messages";
import { createClient } from "@/lib/supabase/server";
import MessagingClient from "./MessagingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "messaging" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    recipient?: string;
    course?: string;
  }>;
};

export default async function MessagesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { recipient, course } = await searchParams;
  const t = await getTranslations({ locale, namespace: "messaging" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile, error: profileError } = user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null, error: null };

  if (profileError) {
    throw new Error(
      `Impossible de charger votre profil : ${profileError.message}`,
    );
  }

  const currentUserId = user?.id || "me";

  const conversations = user
    ? await getConversations(currentUserId, recipient)
    : [];
  const matchedRecipientConv = recipient
    ? conversations.find((c) => c.participant.id === recipient)
    : null;
  const initialActiveConvId = matchedRecipientConv
    ? matchedRecipientConv.id
    : conversations[0]?.id || "";
  const initialMessagesMap = user
    ? await getAllInitialMessagesMap(
        currentUserId,
        conversations.map((conversation) => conversation.id),
      )
    : {};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand selection:text-black">
      <Navbar />

      <main className="flex-1 px-4 pt-28 pb-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-brand/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="mx-auto max-w-7xl relative z-10">
          {/* Header & Status Strip */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                <MessageSquare className="h-3.5 w-3.5" />
                {t("badge")}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {t("title")}
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-white/60">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {user ? (
            <MessagingClient
              initialConversations={conversations}
              initialMessagesMap={initialMessagesMap}
              initialActiveConvId={initialActiveConvId}
              currentUserId={currentUserId}
              currentUserRole={profile?.role ?? ""}
              recipientId={recipient}
              courseTitle={course}
              locale={locale}
            />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-white/70">{t("loginPrompt")}</p>
              <Link
                href="/sign-in"
                className="mt-5 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-black"
              >
                {t("loginButton")}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
