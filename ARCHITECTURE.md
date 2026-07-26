# ARCHITECTURE.md

# NoveraOS System Architecture Specification

> **Rule 4: Never invent architecture. ARCHITECTURE.md is authoritative.**
> **Rule 8: No duplicated business logic.**

---

## Table of Contents

- [1. Executive System Overview](#1-executive-system-overview)
- [2. High-Level Architecture Diagram](#2-high-level-architecture-diagram)
- [3. System Layering Breakdown](#3-system-layering-breakdown)
  - [3.1 Frontend Layer](#31-frontend-layer)
  - [3.2 Backend Layer](#32-backend-layer)
  - [3.3 AI Processing Pipeline Layer](#33-ai-processing-pipeline-layer)
  - [3.4 Memory & Vector Retrieval Layer](#34-memory--vector-retrieval-layer)
  - [3.5 Database Layer](#35-database-layer)
- [4. Shared Libraries & Utilities](#4-shared-libraries--utilities)
- [5. Component & Code Organization](#5-component--code-organization)
- [6. Strict Dependency Rules](#6-strict-dependency-rules)
- [7. Scalability & Performance Philosophy](#7-scalability--performance-philosophy)
- [8. Cross References](#8-cross-references)

---

## 1. Executive System Overview

NoveraOS is built as a unified Next.js App Router application leveraging PostgreSQL with the `pgvector` extension for relational data and vector embeddings.

The architecture emphasizes clear separation of concerns, single-direction data flow, and non-blocking asynchronous processing for AI operations.

---

## 2. High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Next.js React)                    │
│   • Thought Dump UI    • AI Workspace Chat    • Semantic Search Bar   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Server Actions / API Routes
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SERVER & BUSINESS LOGIC LAYER                      │
│   • Auth Guard (Firebase Auth) • Request Validation (Zod)              │
│   • Thought Orchestrator  • RAG Query Synthesizer                      │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ Async Background Processing    │ Direct Prisma Queries
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        AI PROCESSING PIPELINE        │  │     POSTGRESQL DATABASE      │
│ • OpenAI Embeddings API              │  │ • Relational Tables (Prisma) │
│ • Entity & Summary Extraction (LLM)  │  │ • pgvector Index (HNSW)      │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 3. System Layering Breakdown

### 3.1 Frontend Layer
- **Framework**: Next.js App Router (React 19 / Server Components + Client Components).
- **Styling**: Tailwind CSS & shadcn/ui.
- **State Management**: React state, optimistic UI updates via Server Actions, and Zustand for transient chat workspace drawer state.
- **Rules**: Server components are used by default for data fetching; Client Components (`"use client"`) are isolated to interactive forms and stateful UI surfaces.

### 3.2 Backend Layer
- **Execution Environment**: Next.js Node.js Server Environment.
- **API & Mutations**: Next.js Server Actions for standard CRUD operations and API Routes (`/api/chat`, `/api/embeddings`) for streaming responses.
- **Validation**: Strict schema validation using **Zod** on all input surfaces before reaching database queries or AI pipelines.

### 3.3 AI Processing Pipeline Layer
- **Embedding Provider**: OpenAI API `text-embedding-3-small` (vector dimension 1536).
- **Processing Engine**: When a thought is committed, an asynchronous background trigger processes the text:
  1. Computes vector embeddings.
  2. Extracts key summary & named entities (concepts, tags).
  3. Writes embedding vector and summary back to the `Thought` & `Embedding` tables.

### 3.4 Memory & Vector Retrieval Layer
- **Retrieval Engine**: RAG pipeline executing Cosine Distance (`<=>`) vector similarity queries via `pgvector` HNSW index.
- **Context Synthesis**: Top-K relevant thought chunks are fetched and injected into the LLM system prompt for grounded synthesis.

### 3.5 Database Layer
- **Database Engine**: PostgreSQL 16+ with `pgvector` extension enabled.
- **ORM**: Prisma ORM with raw SQL support for `pgvector` queries.

For exact entity definitions, see [DATABASE.md](file:///c:/Users/gurpr/noveraos/noveraos/DATABASE.md).

---

## 4. Shared Libraries & Utilities

All shared domain logic lives under `@/lib` to prevent duplicate code:
- `@/lib/db`: Prisma database client singleton.
- `@/lib/ai`: AI client wrappers, embedding generators, and prompt builders.
- `@/lib/validations`: Centralized Zod schema definitions.
- `@/lib/utils`: Formatting helpers, spatial calculation math, and string sanitization.

---

## 5. Component & Code Organization

```
src/
├── app/                  # Next.js App Router routes & pages
│   ├── (auth)/           # Authentication layout & pages
│   ├── (dashboard)/      # Main workspace app layout
│   └── api/              # Streaming API endpoints
├── components/           # UI components
│   ├── ui/               # Primitive design system components (shadcn)
│   ├── thought-dump/     # Capture input & feed components
│   ├── workspace/        # AI chat & context synthesis components
│   └── shared/           # Header, sidebar, search modal
├── lib/                  # Server-side business logic & DB
├── hooks/                # Custom React client hooks
└── types/                # TypeScript interface definitions
```

---

## 6. Strict Dependency Rules

1. **Client Components cannot query the database directly.** All data access must pass through Server Actions or API routes.
2. **Business logic must not be embedded in UI components.** Controllers, validation logic, and AI prompt formatting belong strictly inside `@/lib/`.
3. **No direct third-party SDK calls from client components.** All AI calls originate from server contexts to protect API keys.

---

## 7. Scalability & Performance Philosophy

- **Asynchronous Enrichment**: AI parsing does not delay response times during thought capture. The database saves raw text instantly (`<50ms`) and triggers vector embedding updates asynchronously.
- **Connection Pooling**: Database connection pooling via Prisma Postgres proxy / Supabase transaction pooler.
- **Vector Search Indexing**: Uses HNSW (Hierarchical Navigable Small World) indexing in `pgvector` for fast sub-50ms vector queries as thought collections grow.

---

## 8. Cross References

- Database Schema & Entities: [DATABASE.md](file:///c:/Users/gurpr/noveraos/noveraos/DATABASE.md)
- AI & RAG Pipeline Specifications: [AI.md](file:///c:/Users/gurpr/noveraos/noveraos/AI.md)
- Tech Stack Rationale: [TECH_STACK.md](file:///c:/Users/gurpr/noveraos/noveraos/TECH_STACK.md)
- Engineering Rules: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
