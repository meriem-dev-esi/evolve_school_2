import { Clock, Pencil, Trash2, X } from "lucide-react";
import type { ProjectComment } from "./types";

interface CommentItemProps {
  comment: ProjectComment;
  isOwner: boolean;
  isEditing: boolean;
  editingContent: string;
  setEditingContent: (val: string) => void;
  onStartEditing: (comment: ProjectComment) => void;
  onCancelEditing: () => void;
  onSaveEdit: () => void;
  onDeleteComment: (id: string) => void;
}

/**
 * CommentItem renders a single community comment, supporting inline editing,
 * deletion for comment authors, and author avatar display.
 */
export default function CommentItem({
  comment,
  isOwner,
  isEditing,
  editingContent,
  setEditingContent,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onDeleteComment,
}: CommentItemProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all hover:border-white/20">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-brand/50 bg-zinc-900 p-3 text-sm text-white focus:outline-none"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancelEditing}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
            >
              <X className="h-3 w-3" /> Annuler
            </button>
            <button
              type="button"
              onClick={onSaveEdit}
              disabled={!editingContent.trim()}
              className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-black hover:opacity-90 disabled:opacity-40 transition"
            >
              Enregistrer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {comment.profile?.avatar_url ? (
                <img
                  src={comment.profile.avatar_url}
                  alt={comment.profile.full_name || "Membre"}
                  className="h-9 w-9 rounded-full object-cover border border-white/15 shadow-sm"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand border border-brand/30">
                  {(comment.profile?.full_name || "E").charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {comment.profile?.full_name || "Membre Evolve"}
                  </span>
                  {comment.profile?.role && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                      {comment.profile.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-0.5">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => onStartEditing(comment)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteComment(comment.id)}
                  className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/80 whitespace-pre-wrap ps-12">
            {comment.content}
          </p>
        </>
      )}
    </div>
  );
}
