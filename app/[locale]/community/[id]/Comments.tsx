"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommentComposer from "@/components/community/CommentComposer";
import CommentItem from "@/components/community/CommentItem";
import type { ProjectComment } from "@/components/community/types";
import { createClient } from "@/lib/supabase/client";

type Props = {
  projectId: string;
};

export default function Comments({ projectId }: Props) {
  const supabase = createClient();

  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const loadComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("community_project_comments")
      .select("id, user_id, content, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Comments]", error);
      setLoading(false);
      return;
    }

    const commentList = data ?? [];
    const userIds = [...new Set(commentList.map((c) => c.user_id))];

    let profiles: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string | null;
    }[] = [];

    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .in("id", userIds);

      profiles = profileData ?? [];
    }

    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const commentsWithProfiles: ProjectComment[] = commentList.map((c) => ({
      ...c,
      profile: profileMap.get(c.user_id) ?? null,
    }));

    setComments(commentsWithProfiles);
    setLoading(false);
  }, [projectId, supabase]);

  const loadUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);
  }, [supabase]);

  useEffect(() => {
    loadComments();
    loadUser();
  }, [loadUser, loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Connectez-vous pour participer à la discussion.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("community_project_comments").insert({
      project_id: projectId,
      user_id: user.id,
      content: content.trim(),
    });

    if (error) {
      console.error("[Comments]", error);
      setSubmitting(false);
      return;
    }

    setContent("");
    await loadComments();
    setSubmitting(false);
  }

  function startEditing(comment: ProjectComment) {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingContent("");
  }

  async function saveEdit() {
    if (!editingId || !editingContent.trim()) return;

    const { error } = await supabase
      .from("community_project_comments")
      .update({
        content: editingContent.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("[Comments]", error);
      return;
    }

    cancelEditing();
    await loadComments();
  }

  async function deleteComment(commentId: string) {
    const confirmed = window.confirm("Supprimer ce commentaire ?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("community_project_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("[Comments]", error);
      return;
    }

    await loadComments();
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Commentaires & Retours
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono font-normal text-brand">
                {comments.length}
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Partagez vos impressions et suggestions constructives.
            </p>
          </div>
        </div>
      </div>

      {/* Input composer */}
      <CommentComposer
        content={content}
        setContent={setContent}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Comment list */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-white/40 gap-2 text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
            Chargement des discussions...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center">
            <p className="text-sm font-medium text-white/70">
              Aucun retour pour l'instant
            </p>
            <p className="mt-1 text-xs text-white/40">
              Soyez le premier à féliciter l'auteur ou à poser une question !
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={comment.user_id === currentUserId}
              isEditing={editingId === comment.id}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onSaveEdit={saveEdit}
              onDeleteComment={deleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
}
