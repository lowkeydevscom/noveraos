"use client";

import React from "react";
import { motion } from "framer-motion";
import { ThoughtItem } from "@/lib/types/thought";

interface ThoughtCardProps {
  thought: ThoughtItem;
  onArchive?: (id: string) => void;
  isOptimistic?: boolean;
}

export function ThoughtCard({ thought, onArchive, isOptimistic = false }: ThoughtCardProps) {
  const formattedDate = new Date(thought.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`p-5 bg-[var(--color-surface-container-lowest)] dark:bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/60 rounded-xl transition-shadow hover:shadow-md ${
        isOptimistic ? "opacity-75 animate-pulse border-amber-400/50" : ""
      }`}
      aria-label={`Thought saved on ${formattedDate}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <time
            dateTime={new Date(thought.createdAt).toISOString()}
            className="font-mono text-xs text-[var(--color-on-surface-variant)]"
          >
            {formattedDate}
          </time>
          {isOptimistic && (
            <span
              className="px-2 py-0.5 text-[10px] font-mono bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 rounded font-semibold"
              aria-live="polite"
            >
              Saving...
            </span>
          )}
        </div>

        {onArchive && !isOptimistic && (
          <button
            type="button"
            onClick={() => onArchive(thought.id)}
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-rose-400 focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors px-2.5 py-1 rounded-md hover:bg-[var(--color-surface-container-high)] font-medium"
            aria-label={`Archive thought created on ${formattedDate}`}
          >
            Archive
          </button>
        )}
      </div>

      <p className="text-[var(--color-on-surface)] text-sm leading-relaxed whitespace-pre-wrap font-sans">
        {thought.rawContent}
      </p>

      {thought.entities && thought.entities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-outline-variant)]/30">
          {thought.entities.map((entity, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 text-xs font-mono bg-[#f5eddf] text-[#554300] dark:bg-[#2d2925] dark:text-[#e9c349] rounded-md font-medium"
            >
              #{entity}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
