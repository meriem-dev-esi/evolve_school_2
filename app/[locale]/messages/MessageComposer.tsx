"use client";

import { Code2, Send, Smile, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

const QUICK_PROMPTS = ["exercise", "codeReview", "deployment", "resources"];

interface MessageComposerProps {
  newMessageText: string;
  onChangeText: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onQuickPromptClick: (prompt: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MessageComposer({
  newMessageText,
  onChangeText,
  onSubmit,
  onQuickPromptClick,
  placeholder,
  disabled = false,
}: MessageComposerProps) {
  const t = useTranslations("messaging");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <>
      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 border-t border-white/5 bg-zinc-950/60 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-xs text-white/40 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-brand" />
          {t("suggestions")}:
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onQuickPromptClick(t(`prompts.${prompt}`))}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 hover:border-brand/40 hover:text-brand transition"
          >
            {t(`prompts.${prompt}`)}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={onSubmit}
        className="border-t border-white/10 p-4 bg-zinc-950/80"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/30 transition">
          <button
            type="button"
            title={t("insertCode")}
            aria-label={t("insertCode")}
            onClick={() =>
              onChangeText(
                newMessageText
                  ? `${newMessageText}\n\`\`\`javascript\n${t("codePlaceholder")}\n\`\`\``
                  : `\`\`\`javascript\n${t("codePlaceholder")}\n\`\`\``,
              )
            }
            disabled={disabled}
            className="mb-0.5 rounded-xl p-2 text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={newMessageText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder ?? t("messagePlaceholder")}
            aria-label={t("messagePlaceholder")}
            rows={1}
            className="max-h-36 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none disabled:opacity-50 sm:text-sm"
          />

          <button
            type="button"
            title={t("insertEmoji")}
            aria-label={t("insertEmoji")}
            onClick={() => onChangeText(`${newMessageText} 💡`)}
            disabled={disabled}
            className="mb-0.5 rounded-xl p-2 text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <Smile className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={disabled || !newMessageText.trim()}
            aria-label={t("send")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-brand/20 transition hover:opacity-90 disabled:opacity-40 active:scale-95 sm:px-5"
          >
            <span className="hidden sm:inline">{t("send")}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </>
  );
}
