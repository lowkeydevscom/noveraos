"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { ThoughtItem } from "@/lib/types/thought";
import { ThoughtEditor } from "./thought-editor";
import { ThoughtFeed } from "./thought-feed";
import { createThoughtAction, archiveThoughtAction } from "@/lib/actions/thought-actions";

interface ThoughtDumpViewProps {
  initialThoughts: ThoughtItem[];
}

export function ThoughtDumpView({ initialThoughts }: ThoughtDumpViewProps) {
  const [thoughts, setThoughts] = useState<ThoughtItem[]>(initialThoughts);
  const [, startTransition] = useTransition();

  // Optimistic UI state hook for immediate feedback without page refresh
  const [optimisticThoughts, addOptimisticThought] = useOptimistic<
    ThoughtItem[],
    { type: "add" | "archive"; item?: ThoughtItem; id?: string }
  >(thoughts, (state, action) => {
    if (action.type === "add" && action.item) {
      return [action.item, ...state];
    }
    if (action.type === "archive" && action.id) {
      return state.filter((t) => t.id !== action.id);
    }
    return state;
  });

  const handleCreateThought = async (rawContent: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempThought: ThoughtItem = {
      id: tempId,
      userId: "demo-user-id",
      rawContent,
      summary: rawContent.slice(0, 120),
      entities: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Instantly trigger optimistic update so card appears immediately
    startTransition(() => {
      addOptimisticThought({ type: "add", item: tempThought });
    });

    // 2. Execute Server Action in background
    const result = await createThoughtAction({ rawContent });

    if (result.success) {
      setThoughts((prev) => [result.data, ...prev.filter((t) => t.id !== tempId)]);
    } else {
      // Revert on error
      setThoughts((prev) => prev.filter((t) => t.id !== tempId));
      alert(`Error saving thought: ${result.error}`);
    }
  };

  const handleArchiveThought = async (id: string) => {
    startTransition(() => {
      addOptimisticThought({ type: "archive", id });
    });

    const result = await archiveThoughtAction(id);
    if (result.success) {
      setThoughts((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert(`Error archiving thought: ${result.error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 py-8">
      <div>
        <h1 className="font-hanken text-3xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Thought Dump
        </h1>
        <p className="mt-1 font-sans text-sm text-[var(--color-on-surface-variant)]">
          Capture raw ideas instantaneously. Autosaved to disk and indexed for AI synthesis.
        </p>
      </div>

      <ThoughtEditor onSubmit={handleCreateThought} />

      <ThoughtFeed
        thoughts={optimisticThoughts}
        onArchiveThought={handleArchiveThought}
      />
    </div>
  );
}
