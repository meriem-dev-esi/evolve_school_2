import { Loader2, Send, Sparkles } from "lucide-react";

interface CommentComposerProps {
  content: string;
  setContent: (val: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * CommentComposer provides the text input and submit trigger
 * for posting feedbacks/comments on community projects.
 */
export default function CommentComposer({
  content,
  setContent,
  submitting,
  onSubmit,
}: CommentComposerProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6">
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/40 transition">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez un message ou posez une question sur le projet..."
          rows={3}
          disabled={submitting}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
        />

        <div className="flex items-center justify-between border-t border-white/5 pt-2 px-2">
          <span className="text-[11px] text-white/40 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-brand" />
            Markdown & retours bienveillants encouragés
          </span>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-xs font-bold text-black transition-all hover:opacity-90 disabled:opacity-40 active:scale-95 shadow-md shadow-brand/15"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Publication...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Commenter
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
