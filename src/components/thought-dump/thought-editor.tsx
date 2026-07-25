"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useThoughtDraft } from "@/hooks/use-thought-draft";

interface ThoughtEditorProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function ThoughtEditor({ onSubmit, isSubmitting = false }: ThoughtEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { draft, updateDraft, clearDraft, isSaved, isRecovered } = useThoughtDraft();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const charCount = draft.length;

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSubmitting) return;
    clearDraft();
    await onSubmit(trimmed);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.section
      aria-label="Thought capture editor"
      whileFocus={{ scale: 1.002 }}
      transition={{ duration: 0.15 }}
      className="w-full bg-[var(--color-surface-container-lowest)] dark:bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[var(--color-primary-container)] focus-within:border-[var(--color-primary)]"
    >
      {isRecovered && (
        <div
          className="mb-3 inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono text-[#735c00] bg-[#fbf3e5] dark:bg-[#2d2925] dark:text-[#e9c349] rounded-md border border-[#d0c5af]/40"
          role="status"
        >
          <span>● Draft recovered from previous session</span>
        </div>
      )}

      <label htmlFor="thought-input" className="sr-only">
        Capture your thought
      </label>

      <textarea
        id="thought-input"
        ref={textareaRef}
        value={draft}
        onChange={(e) => updateDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's on your mind? Type freely..."
        rows={4}
        aria-describedby="thought-editor-status"
        className="w-full bg-transparent text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)]/60 text-base leading-relaxed resize-none focus:outline-none font-sans"
      />

      <div
        id="thought-editor-status"
        className="mt-4 pt-3 border-t border-[var(--color-outline-variant)]/40 flex items-center justify-between text-xs font-mono text-[var(--color-on-surface-variant)]"
      >
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span aria-hidden="true">•</span>
          <span>{charCount} chars</span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-1.5" aria-live="polite">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSaved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
              aria-hidden="true"
            />
            {isSaved ? "Autosaved (<50ms)" : "Saving..."}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline opacity-70">Cmd+Enter to save</span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || isSubmitting}
            aria-label="Save thought to memory"
            className="px-4 py-2 bg-[var(--color-on-surface)] text-[var(--color-background)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed font-sans font-medium rounded-lg text-xs transition-opacity shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
          >
            {isSubmitting ? "Saving..." : "Save Thought"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
