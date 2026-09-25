"use client";

import { Code2, Paperclip, Send, Smile, Sparkles } from "lucide-react";
import type { FormEvent } from "react";

const QUICK_PROMPTS = [
  "Question sur un exercice",
  "Revue de code & Bonnes pratiques",
  "Aide au déploiement",
  "Ressources complémentaires",
];

interface MessageComposerProps {
  newMessageText: string;
  onChangeText: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onQuickPromptClick: (prompt: string) => void;
}

export default function MessageComposer({
  newMessageText,
  onChangeText,
  onSubmit,
  onQuickPromptClick,
}: MessageComposerProps) {
  return (
    <>
      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 border-t border-white/5 bg-zinc-950/60 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-xs text-white/40 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-brand" />
          Suggestions :
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onQuickPromptClick(prompt)}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 hover:border-brand/40 hover:text-brand transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={onSubmit}
        className="border-t border-white/10 p-4 bg-zinc-950/80"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/30 transition">
          <button
            type="button"
            title="Joindre un fichier"
            className="p-2 text-white/40 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Insérer du code"
            onClick={() =>
              onChangeText(`${newMessageText}\`\`\`\n// Votre code\n\`\`\``)
            }
            className="p-2 text-white/40 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={newMessageText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Posez votre question à votre formateur..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
          />

          <button
            type="button"
            title="Emoji"
            onClick={() => onChangeText(`${newMessageText} 💡`)}
            className="p-2 text-white/40 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <Smile className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={!newMessageText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-brand/20 transition hover:opacity-90 disabled:opacity-40 active:scale-95"
          >
            <span>Envoyer</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </>
  );
}
