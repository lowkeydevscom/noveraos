# TECH_STACK.md

# NoveraOS Technology Stack & Architectural Justifications

> **Rule 10: Simple beats clever. Readable beats short. Maintainable beats optimized.**

---

## Table of Contents

- [1. Executive Stack Overview](#1-executive-stack-overview)
- [2. Detailed Stack Component Analysis](#2-detailed-stack-component-analysis)
  - [2.1 Frontend Framework: Next.js (App Router)](#21-frontend-framework-nextjs-app-router)
  - [2.2 Styling System: Tailwind CSS & shadcn/ui](#22-styling-system-tailwind-css--shadcnui)
  - [2.3 Database & Vector Storage: PostgreSQL + pgvector](#23-database--vector-storage-postgresql--pgvector)
  - [2.4 Object-Relational Mapping (ORM): Prisma](#24-object-relational-mapping-orm-prisma)
  - [2.5 Authentication: Auth.js (NextAuth)](#25-authentication-authjs-nextauth)
  - [2.6 AI Processing & Vector Embeddings: OpenAI API & Vercel AI SDK](#26-ai-processing--vector-embeddings-openai-api--vercel-ai-sdk)
  - [2.7 Package Manager: pnpm](#27-package-manager-pnpm)
  - [2.8 Deployment & Infrastructure: Vercel / Railway](#28-deployment--infrastructure-vercel--railway)
  - [2.9 Observability & Logging: OpenTelemetry & Structured JSON](#29-observability--logging-opentelemetry--structured-json)
  - [2.10 Testing Suite: Vitest & Playwright](#210-testing-suite-vitest--playwright)
- [3. Technology Evaluation Matrix](#3-technology-evaluation-matrix)
- [4. Cross References](#4-cross-references)

---

## 1. Executive Stack Overview

The NoveraOS technology stack is chosen to maximize engineer productivity, maintainability, type safety, and deployment simplicity.

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: Next.js + React 19 + TypeScript      │
│              STYLING: Tailwind CSS + shadcn/ui              │
├─────────────────────────────────────────────────────────────┤
│              BACKEND: Next.js Server Actions & API Routes   │
│              AUTH: Auth.js (NextAuth v5)                    │
├─────────────────────────────────────────────────────────────┤
│              DATABASE & VECTOR: PostgreSQL 16 + pgvector    │
│              ORM: Prisma ORM                                │
├─────────────────────────────────────────────────────────────┤
│              AI PIPELINE: OpenAI API + Vercel AI SDK        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Stack Component Analysis

### 2.1 Frontend Framework: Next.js (App Router)
- **Choice**: Next.js 14+ (App Router, TypeScript).
- **Why Chosen**: Provides full-stack integration in a single codebase. React Server Components reduce client-side JavaScript bundle sizes while Server Actions streamline data mutation without API boilerplate.

### 2.2 Styling System: Tailwind CSS & shadcn/ui
- **Choice**: Tailwind CSS v3/v4 + shadcn/ui component primitives.
- **Why Chosen**: Utility-first CSS eliminates custom CSS bloat and naming friction. `shadcn/ui` copies unstyled, accessible Radix UI components directly into the codebase (`src/components/ui/`), providing full code ownership without external package dependency lock-in.

### 2.3 Database & Vector Storage: PostgreSQL + pgvector
- **Choice**: PostgreSQL 16 with `pgvector` extension.
- **Why Chosen**: Eliminates the operational overhead of running a separate vector database (e.g., Pinecone or Qdrant). Keeping relational data (Users, Thoughts) and vector embeddings in the exact same Postgres engine guarantees ACID transactions, simplifies backups, and reduces cost.

### 2.4 Object-Relational Mapping (ORM): Prisma
- **Choice**: Prisma ORM.
- **Why Chosen**: Delivers end-to-end type safety from database schema to frontend components. Handles schema migrations cleanly while supporting raw SQL queries required for `pgvector` cosine similarity joins.

### 2.5 Authentication: Auth.js (NextAuth)
- **Choice**: Auth.js (NextAuth v5).
- **Why Chosen**: Native Next.js integration supporting lightweight Email/Password authentication and OAuth providers (Google, GitHub) without lock-in to proprietary Auth SaaS platforms.

### 2.6 AI Processing & Vector Embeddings: OpenAI API & Vercel AI SDK
- **Choice**: OpenAI `text-embedding-3-small` + `gpt-4o-mini` via Vercel AI SDK.
- **Why Chosen**: Vercel AI SDK provides unified abstractions for streaming responses (`useChat`), token management, and standardized LLM hooks. OpenAI embeddings offer high performance at minimal cost ($0.02 / 1M tokens).

### 2.7 Package Manager: pnpm
- **Choice**: `pnpm`.
- **Why Chosen**: Fast, disk-efficient package installation with strict dependency isolation, preventing phantom node_modules imports.

### 2.8 Deployment & Infrastructure: Vercel / Railway
- **Choice**: Vercel (Frontend & Serverless Functions) + Railway / Supabase (Managed Postgres with pgvector).
- **Why Chosen**: Provides zero-config CI/CD previews, instant edge distribution, and automated database connection pooling.

### 2.9 Observability & Logging: OpenTelemetry & Structured JSON
- **Choice**: Structured JSON server logs + Vercel Analytics / OpenTelemetry.
- **Why Chosen**: Enables clean log parsing and performance bottleneck tracing across serverless executions.

### 2.10 Testing Suite: Vitest & Playwright
- **Choice**: Vitest (Unit/Integration) + Playwright (E2E browser testing).
- **Why Chosen**: Vitest shares Next.js Vite/ESBuild transformers for ultra-fast unit testing. Playwright automates real browser validation across Chrome, Firefox, and Safari viewports.

---

## 3. Technology Evaluation Matrix

| Category | Selection | Rejected Alternative | Why Alternative Was Rejected |
|---|---|---|---|
| **Vector DB** | PostgreSQL (`pgvector`) | Pinecone | Pinecone adds separate service latency, extra billing, and dual-system data sync complexity. |
| **Styling** | Tailwind CSS | Styled Components | Styled Components increase runtime JS payload and break React Server Components. |
| **ORM** | Prisma | TypeORM | TypeORM relies on legacy experimental decorators and lacks Prisma's auto-generated client types. |

---

## 4. Cross References

- Architecture Layers: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
- Database Entity Schema: [DATABASE.md](file:///c:/Users/gurpr/noveraos/noveraos/DATABASE.md)
- Architecture Decision Records: [DECISIONS.md](file:///c:/Users/gurpr/noveraos/noveraos/DECISIONS.md)
