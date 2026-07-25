"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspaceChat } from "@/hooks/use-workspace-chat";
import { Send, Bot, User, Sparkles } from "lucide-react";

function renderContentWithCitations(content: string) {
  const parts = content.split(/(\[Thought\s*#\d+\])/gi);
  return parts.map((part, idx) => {
    const match = part.match(/\[Thought\s*#(\d+)\]/i);
    if (match) {
      const num = match[1];
      return (
        <button
          key={idx}
          type="button"
          aria-label={`View source Thought #${num}`}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 shadow-sm hover:bg-cyan-900 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" aria-hidden="true" />
          Thought #{num}
        </button>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function WorkspaceChat() {
  const { messages, input, setInput, handleSubmit, isLoading } = useWorkspaceChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      aria-label="AI Workspace Chat"
      className="flex flex-col h-[600px] w-full max-w-4xl mx-auto rounded-xl border border-neutral-800 bg-neutral-950/90 text-neutral-100 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">AI Workspace Chat</h2>
            <p className="text-xs text-neutral-400">RAG-Grounded Memory Synthesizer</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-6 space-y-3">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" aria-hidden="true" />
            <p className="text-sm font-medium">Ask questions grounded in your past thoughts.</p>
            <p className="text-xs text-neutral-500 max-w-sm">
              Answers will synthesize your personal notes with explicit [Thought #N] citations.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className={`flex gap-3 text-sm ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white rounded-br-none shadow-md"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none"
                  }`}
                >
                  {msg.role === "assistant" ? renderContentWithCitations(msg.content) : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800/80 bg-neutral-900/30 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Query your memory
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Query your memory..."
          disabled={isLoading}
          className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send query"
          className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-4 py-2.5 flex items-center justify-center transition-colors disabled:opacity-40 shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
