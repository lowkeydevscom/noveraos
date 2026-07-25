# DECISIONS.md

# NoveraOS Architecture Decision Records (ADR)

> **Rule 4: Never invent architecture. ARCHITECTURE.md is authoritative.**

---

## Table of Contents

- [1. ADR-001: Next.js App Router as Full-Stack Framework](#1-adr-001-nextjs-app-router-as-full-stack-framework)
- [2. ADR-002: PostgreSQL + pgvector for Storage and Embeddings](#2-adr-002-postgresql--pgvector-for-storage-and-embeddings)
- [3. ADR-003: Integrated Vector Search over Standalone Vector DB](#3-adr-003-integrated-vector-search-over-standalone-vector-db)
- [4. ADR-004: AI-First Operating Paradigm](#4-adr-004-ai-first-operating-paradigm)
- [5. ADR-005: Strict Two-Surface Minimal MVP](#5-adr-005-strict-two-surface-minimal-mvp)
- [6. ADR-006: Documentation-First Development Process](#6-adr-006-documentation-first-development-process)
- [7. Cross References](#7-cross-references)

---

## 1. ADR-001: Next.js App Router as Full-Stack Framework

- **Status**: Accepted
- **Context**: We need a full-stack framework that enables rapid iteration, strong type safety, efficient UI rendering, and serverless scalability without maintaining separate frontend and backend repositories.
- **Decision**: Adopt Next.js 14+ (App Router, React Server Components, Server Actions).
- **Consequences**:
  - Positive: Single TypeScript codebase; zero REST boilerplate for internal data mutations using Server Actions; reduced client JS bundle via React Server Components.
  - Negative: Vercel/Next.js vendor coupling requires care when writing node backend modules.

---

## 2. ADR-002: PostgreSQL + pgvector for Storage and Embeddings

- **Status**: Accepted
- **Context**: Relational user/thought records and high-dimensional vector embeddings must be persisted. We evaluated separate vector databases (Pinecone, Qdrant) versus unified storage in PostgreSQL.
- **Decision**: Use PostgreSQL with the `pgvector` extension managed via Prisma ORM.
- **Consequences**:
  - Positive: Single database instance reduces infrastructure costs and ops complexity; guaranteed ACID transactional consistency when saving thoughts and vector vectors together.
  - Negative: Requires raw SQL queries inside Prisma for vector similarity operations (`<=>`).

---

## 3. ADR-003: Integrated Vector Search over Standalone Vector DB

- **Status**: Accepted
- **Context**: Standalone vector databases offer complex multi-tenant cluster management, but add substantial latency and sync complexity for personal workspaces.
- **Decision**: Standardize on `pgvector` HNSW vector indexes directly inside PostgreSQL.
- **Consequences**:
  - Positive: Simplifies local development (Docker / Supabase / Railway); eliminates double-writes and network hops between DB and vector store.
  - Negative: HNSW index creation requires tuning `m` and `ef_construction` parameters as dataset sizes grow.

---

## 4. ADR-004: AI-First Operating Paradigm

- **Status**: Accepted
- **Context**: Traditional productivity software requires users to act as manual folder/tag administrators.
- **Decision**: Build NoveraOS as an AI-first operating system where post-hoc background AI structuring handles organization completely.
- **Consequences**:
  - Positive: Zero-friction user capture experience; users store raw thoughts without organization overhead.
  - Negative: Strong dependence on background AI API processing latency and reliability.

---

## 5. ADR-005: Strict Two-Surface Minimal MVP

- **Status**: Accepted
- **Context**: Broad feature sets dilute core product testing signal and delay release timelines.
- **Decision**: Restrict MVP strictly to **Thought Dump** and **AI Workspace**. Explicitly ban calendars, tasks, kanban, email, and team features.
- **Consequences**:
  - Positive: Maximizes engineering velocity; focuses 100% of effort on validating our core cognitive thesis.
  - Negative: Users seeking traditional task checklists will find the initial MVP incomplete by design.

---

## 6. ADR-006: Documentation-First Development Process

- **Status**: Accepted
- **Context**: Writing code before architecture and design decisions are frozen results in churn, inconsistent UI, duplicate business logic, and broken AI agent code generation.
- **Decision**: Freeze 18 root markdown specification documents as the single authoritative source of truth before writing code.
- **Consequences**:
  - Positive: Eliminates ambiguity; establishes binding contracts for human engineers and AI coding agents.
  - Negative: Requires initial upfront discipline before producing user-facing code.

---

## 7. Cross References

- Tech Stack Specifications: [TECH_STACK.md](file:///c:/Users/gurpr/noveraos/noveraos/TECH_STACK.md)
- Product Scope Boundaries: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
- System Architecture: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
