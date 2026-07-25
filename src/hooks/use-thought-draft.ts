"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "noveraos_thought_draft";

export interface UseThoughtDraftResult {
  draft: string;
  updateDraft: (content: string) => void;
  clearDraft: () => void;
  isSaved: boolean;
  isRecovered: boolean;
  lastSavedAt: Date | null;
}

export function useThoughtDraft(): UseThoughtDraftResult {
  const [draft, setDraft] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isRecovered, setIsRecovered] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Restore draft from LocalStorage on initial client mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft && savedDraft.trim().length > 0) {
        setDraft(savedDraft);
        setIsRecovered(true);
      }
    } catch {
      // LocalStorage unavailable (e.g. incognito restriction)
    }
  }, []);

  // Synchronous <50ms autosave on text change
  const updateDraft = useCallback((content: string) => {
    setDraft(content);
    setIsSaved(false);

    try {
      if (content.length > 0) {
        localStorage.setItem(STORAGE_KEY, content);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setIsSaved(true);
      setLastSavedAt(new Date());
    } catch {
      // Fallback gracefully if LocalStorage quota exceeded
    }
  }, []);

  const clearDraft = useCallback(() => {
    setDraft("");
    setIsSaved(true);
    setIsRecovered(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage clear error
    }
  }, []);

  return {
    draft,
    updateDraft,
    clearDraft,
    isSaved,
    isRecovered,
    lastSavedAt,
  };
}
