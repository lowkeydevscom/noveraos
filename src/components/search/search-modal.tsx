// Added by Antigravity
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { HybridSearchResult } from "@/lib/ai/hybrid-search";

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-[var(--color-primary-container)]/30 text-[var(--color-primary-fixed-dim)] font-semibold px-0.5 rounded font-sans">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); setResults([]); }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setLatencyMs(null); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setLatencyMs(data.latencyMs);
        setSelectedIndex(0);
      }
    } catch { /* Suppress runtime error */ } finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 50);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "ArrowDown" && results.length > 0) { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % results.length); }
    if (e.key === "ArrowUp" && results.length > 0) { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + results.length) % results.length); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Global Hybrid Search">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="w-full max-w-2xl bg-[var(--color-surface-container-lowest)] dark:bg-[var(--mode-dark-base)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl overflow-hidden text-[var(--color-on-surface)]" onKeyDown={handleKeyDown}>
            <div className="flex items-center px-4 py-3 border-b border-[var(--color-outline-variant)] gap-3">
              <Search className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0" aria-hidden="true" />
              <label htmlFor="global-search-input" className="sr-only">Search thoughts</label>
              <input id="global-search-input" ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search thoughts with hybrid pgvector + exact match..." className="flex-1 bg-transparent border-none text-sm text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)]/60 focus:outline-none" />
              {latencyMs !== null && <span className="text-xs font-mono text-[var(--color-primary-fixed-dim)] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded border border-[var(--color-outline-variant)]">⚡ {latencyMs}ms</span>}
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close search modal" className="text-[var(--color-on-surface-variant)] hover:opacity-80 rounded-md p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2 space-y-1" role="listbox">
              {isLoading && query && <p className="text-xs text-[var(--color-on-surface-variant)] p-4 text-center">Searching...</p>}
              {!isLoading && query && results.length === 0 && <p className="text-xs text-[var(--color-on-surface-variant)] p-4 text-center">No matching thoughts found.</p>}
              {results.map((item, idx) => (
                <div key={item.id} role="option" aria-selected={idx === selectedIndex} onClick={() => setIsOpen(false)} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 ${idx === selectedIndex ? "bg-[var(--color-surface-container-high)] border border-[var(--color-outline)]" : "hover:bg-[var(--color-surface-container-low)] border border-transparent"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]">{item.matchType} match</span>
                      <span className="text-[11px] text-[var(--color-on-surface-variant)] font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface)] truncate"><HighlightText text={item.summary || item.rawContent} query={query} /></p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ${idx === selectedIndex ? "text-[var(--color-primary)]" : "text-[var(--color-outline)]"}`} />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
