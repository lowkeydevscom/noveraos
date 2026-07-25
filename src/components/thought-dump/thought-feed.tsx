"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ThoughtItem } from "@/lib/types/thought";
import { ThoughtCard } from "./thought-card";

interface ThoughtFeedProps {
  thoughts: ThoughtItem[];
  onArchiveThought?: (id: string) => void;
}

export function ThoughtFeed({ thoughts, onArchiveThought }: ThoughtFeedProps) {
  if (thoughts.length === 0) {
    return (
      <section
        aria-label="Empty thought feed"
        className="py-16 text-center border-2 border-dashed border-[var(--color-outline-variant)]/40 rounded-xl bg-[var(--color-surface-container-lowest)]/40 dark:bg-[var(--color-surface)]/20"
      >
        <p className="font-hanken text-lg font-medium text-[var(--color-on-surface)] mb-1">
          No thoughts recorded yet
        </p>
        <p className="text-sm font-sans text-[var(--color-on-surface-variant)]">
          Type freely above and press Cmd+Enter to capture your first thought.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Captured Thoughts Feed" className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-hanken text-base font-semibold text-[var(--color-on-surface)]">
          Captured Thoughts ({thoughts.length})
        </h2>
        <span className="font-mono text-xs text-[var(--color-on-surface-variant)]">
          Most recent first
        </span>
      </div>

      <div className="space-y-3" role="feed" aria-busy="false">
        <AnimatePresence mode="popLayout">
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onArchive={onArchiveThought}
              isOptimistic={thought.id.startsWith("temp-")}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
