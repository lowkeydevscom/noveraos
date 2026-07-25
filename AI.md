# AI.md

# NoveraOS AI Architecture & Intelligence Specification

> **Rule 9: Every AI feature must explain: Context source, Memory source, Confidence, and Failure mode.**

---

## Table of Contents

- [1. AI Philosophy](#1-ai-philosophy)
- [2. Memory Strategy & Architecture](#2-memory-strategy--architecture)
- [3. Context Retrieval (RAG Pipeline)](#3-context-retrieval-rag-pipeline)
- [4. Conversation Rules & Persona](#4-conversation-rules--persona)
- [5. Prompt Hierarchy](#5-prompt-hierarchy)
- [6. Thought Parsing & Summarization](#6-thought-parsing--summarization)
- [7. Embedding System](#7-embedding-system)
- [8. Knowledge Graph Philosophy](#8-knowledge-graph-philosophy)
- [9. Confidence Handling & Hallucination Prevention](#9-confidence-handling--hallucination-prevention)
- [10. When AI Asks Questions vs When AI Remains Silent](#10-when-ai-asks-questions-vs-when-ai-remains-silent)
- [11. Cross References](#11-cross-references)

---

## 1. AI Philosophy

Artificial intelligence in NoveraOS is not an addon chatbot or a superficial text generator. 

**AI is the underlying cognitive engine.** Its primary purpose is to convert unstructured human thoughts into accessible, connected personal knowledge without requiring manual user organization.

### Fundamental Tenets
- **Grounding Over Imagination**: The AI synthesizes answer strictly from user-captured thoughts. It does not invent facts about the user's life, work, or opinions.
- **Invisible Organization**: Entity extraction, vector indexing, and topic clustering occur automatically in the background.
- **Respect for Human Focus**: The AI never interrupts the user with unnecessary commentary, unsolicited popups, or chat chatter during Thought Dump capture.

---

## 2. Memory Strategy & Architecture

Memory in NoveraOS is divided into three tiers:

```
┌─────────────────────────────────────────────────────────┐
│ 1. SHORT-TERM MEMORY (Session Context)                   │
│ Active workspace chat message history (last 10 turns)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. EPISODIC MEMORY (Thought Embeddings)                 │
│ Vector embeddings of all captured thoughts (pgvector)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. SEMANTIC MEMORY (Extracted Concepts & Entities)      │
│ Derived topics, summaries, and cross-thought references │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Context Retrieval (RAG Pipeline)

When a user submits a query in the AI Workspace:

1. **Embedding Generation**: The query is converted into a 1536-dimension vector using `text-embedding-3-small`.
2. **Vector Similarity Search**: Cosine similarity (`<=>`) retrieves the Top-K (default K=8) most relevant thought entries from PostgreSQL.
3. **Threshold Filtering**: Thoughts with similarity scores below `0.65` are discarded to maintain context relevance.
4. **Context Injection**: The text content, creation date, and thought ID of remaining entries are formatted into the system prompt context window.

---

## 4. Conversation Rules & Persona

- **Tone**: Professional, analytical, concise, and calm.
- **No Filler**: Never begin responses with *"Sure, I'd be happy to help with that!"* or generic conversational padding.
- **Mandatory Citations**: Every claim synthesized from past notes must include an inline citation linked to the original thought (e.g., `[Thought #104]`).

---

## 5. Prompt Hierarchy

All AI requests assemble prompts according to a strict 4-layer structure:

1. **System Prompt Layer**: Defines identity, non-hallucination rules, citation formats, and constraints.
2. **User Memory / Grounded Context Layer**: Injected RAG retrieved thoughts with metadata (IDs, dates).
3. **Conversation History Layer**: Recent message turns from the current AI Workspace session.
4. **User Input Layer**: Current user prompt or query.

See [PROMPTS.md](file:///c:/Users/gurpr/noveraos/noveraos/PROMPTS.md) for raw prompt templates.

---

## 6. Thought Parsing & Summarization

Immediately after a thought is stored in Thought Dump, an async background task performs structured extraction using LLM function calling / JSON mode:

```json
{
  "summary": "1-sentence concise summary of the thought",
  "entities": ["PostgreSQL", "Authentication", "Prisma"],
  "category": "Technical Architecture",
  "actionable_items": ["Research pgvector HNSW indexing parameters"]
}
```

---

## 7. Embedding System

- **Model**: OpenAI `text-embedding-3-small`.
- **Dimensions**: 1536.
- **Normalization**: Vector values are normalized before storage in `Embedding` table for fast inner-product & cosine distance matching.

---

## 8. Knowledge Graph Philosophy

In the MVP, explicit graph databases (Neo4j) are omitted for simplicity. 

Knowledge graph dynamics are achieved virtually through **vector similarity distance + shared extracted entity tags**. Thoughts sharing high semantic vector proximity or identical entity tags form soft cognitive clusters automatically.

---

## 9. Confidence Handling & Hallucination Prevention

- **Context Source**: Grounded strictly in retrieved user thoughts.
- **Memory Source**: `pgvector` similarity queries + `Thought` relational records.
- **Confidence Assessment**: If top similarity score < 0.65, the AI explicitly states:
  > *"I don't have enough recorded thoughts in your NoveraOS memory to answer this question accurately."*
- **Failure Mode**: Graceful fallback to raw keyword search when vector service API experiences latency or outage.

---

## 10. When AI Asks Questions vs When AI Remains Silent

### When AI Remains Silent
- **During Thought Dump Capture**: Zero interruptions. The user writes without unsolicited advice, popups, or auto-suggestions.
- **When Confidence is Low**: The AI will not construct speculative hypotheses without user guidance.

### When AI Asks Clarifying Questions
- **In AI Workspace Chat**: When a user's question refers to ambiguous references (e.g., *"What did I decide about the architecture?"*) and past notes record two conflicting architecture decisions.

---

## 11. Cross References

- System Prompts & Templates: [PROMPTS.md](file:///c:/Users/gurpr/noveraos/noveraos/PROMPTS.md)
- Database Embeddings Schema: [DATABASE.md](file:///c:/Users/gurpr/noveraos/noveraos/DATABASE.md)
- System Architecture: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
