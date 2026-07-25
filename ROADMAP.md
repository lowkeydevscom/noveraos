# ROADMAP.md

# NoveraOS Milestone-Based Roadmap

> **Rule 1: The MVP is sacred. No feature may be added unless it explicitly exists in MVP.md.**
> **Note: This roadmap is milestone-driven. No calendar dates are used.**

---

## Table of Contents

- [1. Executive Roadmap Architecture](#1-executive-roadmap-architecture)
- [2. Roadmap Phase Breakdown](#2-roadmap-phase-breakdown)
  - [Phase 0: Documentation & Foundation Freeze](#phase-0-documentation--foundation-freeze)
  - [Phase 1: Project & Tech Stack Setup](#phase-1-project--tech-stack-setup)
  - [Phase 2: Database Schema & Persistence](#phase-2-database-schema--persistence)
  - [Phase 3: Thought Dump UI & Capture Engine](#phase-3-thought-dump-ui--capture-engine)
  - [Phase 4: Async AI Enrichment & Embedding Pipeline](#phase-4-async-ai-enrichment--embedding-pipeline)
  - [Phase 5: AI Workspace & Conversational Synthesis](#phase-5-ai-workspace--conversational-synthesis)
  - [Phase 6: Unified Semantic & Keyword Search](#phase-6-unified-semantic--keyword-search)
  - [Phase 7: UI Polish, Performance & Accessibility](#phase-7-ui-polish-performance--accessibility)
  - [Phase 8: Hardening, Monitoring & Private Beta](#phase-8-hardening-monitoring--private-beta)
  - [Phase 9: Public MVP Release](#phase-9-public-mvp-release)
- [3. Post-MVP Future Horizons](#3-post-mvp-future-horizons)
- [4. Cross References](#4-cross-references)

---

## 1. Executive Roadmap Architecture

```
Phase 0
│
├── Documentation
├── Product decisions frozen
└── Design language frozen
      │
      ▼
Phase 1
│
├── Next.js setup
├── Tailwind
├── shadcn/ui
├── Authentication
└── Project structure
      │
      ▼
Phase 2
│
├── Database schema
├── Prisma
├── Migrations
├── User model
└── Thought model
      │
      ▼
Phase 3
│
├── Thought Dump UI
├── Rich text input
├── Autosave
└── Draft recovery
      │
      ▼
Phase 4
│
├── AI pipeline
├── Thought parsing
├── Summaries
├── Entity extraction
├── Embeddings
└── Memory creation
      │
      ▼
Phase 5
│
├── AI Workspace
├── Chat
├── Context retrieval
├── Conversation history
└── Suggested questions
      │
      ▼
Phase 6
│
├── Search
├── Filters
├── Semantic search
└── Related thoughts
      │
      ▼
Phase 7
│
├── UI polish
├── Animations
├── Performance
├── Accessibility
└── Mobile responsiveness
      │
      ▼
Phase 8
│
├── Testing
├── Error handling
├── Monitoring
└── Private beta
      │
      ▼
Phase 9
│
└── Public MVP
```

---

## 2. Roadmap Phase Breakdown

---

### Phase 0: Documentation & Foundation Freeze

- **Goals**: Freeze all architectural, product, design, and database documentation as the single source of truth before writing code.
- **Deliverables**:
  - Complete set of 18 root markdown specification files.
  - Architecture Decision Records (ADRs) signed off in `DECISIONS.md`.
- **Acceptance Criteria**:
  - All 18 documents pass lint checks and contain zero placeholder markers.
- **Exit Criteria**:
  - Team alignment and formal lock on MVP feature boundaries.
- **Explicitly NOT Included**:
  - Any React/Next.js codebase implementation.

---

### Phase 1: Project & Tech Stack Setup

- **Goals**: Initialize repository structure, Next.js App Router, Tailwind CSS, shadcn/ui primitives, and Auth.js.
- **Deliverables**:
  - Base Next.js 14+ TypeScript repository.
  - Configured `@/` directory aliases and tailwind design tokens.
  - Working Auth.js authentication flows (Login/Signup).
- **Acceptance Criteria**:
  - `pnpm build` completes with zero TypeScript or ESLint errors.
  - User can sign up, log in, and see a protected dashboard route.
- **Exit Criteria**:
  - Authentication middleware successfully guards non-authenticated requests.
- **Explicitly NOT Included**:
  - Database thought tables or AI pipeline connections.

---

### Phase 2: Database Schema & Persistence

- **Goals**: Establish PostgreSQL database with `pgvector` extension and Prisma schema ORM models.
- **Deliverables**:
  - Prisma schema containing `User`, `Thought`, `Embedding`, `Conversation`, and `Message` entities.
  - Successful DB migration scripts executing vector HNSW indexes.
- **Acceptance Criteria**:
  - `prisma db push` and `prisma migrate dev` execute cleanly against Postgres target.
- **Exit Criteria**:
  - Integration tests verify raw vector insertion and retrieval queries via Prisma.
- **Explicitly NOT Included**:
  - User interface components or live LLM integration calls.

---

### Phase 3: Thought Dump UI & Capture Engine

- **Goals**: Build the Thought Dump auto-focus capture editor with instant local autosave and persistence.
- **Deliverables**:
  - `ThoughtDump` editor component with rich text capture.
  - LocalStorage draft recovery and Server Action submission handlers.
  - Chronological `ThoughtFeed` component.
- **Acceptance Criteria**:
  - Submitting text saves thought to PostgreSQL in `<50ms`.
  - Closing browser mid-sentence restores text from draft memory upon refresh.
- **Exit Criteria**:
  - Zero lost keystrokes during rapid typing stress testing.
- **Explicitly NOT Included**:
  - Background AI summary generation or vector embeddings.

---

### Phase 4: Async AI Enrichment & Embedding Pipeline

- **Goals**: Connect background OpenAI embedding generation, summary extraction, and entity memory parsing.
- **Deliverables**:
  - Server Action trigger calculating 1536-dim vector embeddings on thought creation.
  - LLM structured extraction saving summaries and entity arrays to DB.
- **Acceptance Criteria**:
  - Thought entries receive embeddings and entity tags within 3 seconds of capture without blocking UI.
- **Exit Criteria**:
  - Vector similarity queries (`<=>`) correctly return top semantic matches.
- **Explicitly NOT Included**:
  - Conversational chat UI surface.

---

### Phase 5: AI Workspace & Conversational Synthesis

- **Goals**: Implement RAG chat interface grounded in user's captured thoughts with citation links.
- **Deliverables**:
  - `WorkspaceChat` component with streaming response support (`useChat`).
  - Context retrieval module injecting relevant thoughts into system prompts.
  - Dynamic prompt suggestions derived from top entity tags.
- **Acceptance Criteria**:
  - AI responses cite exact source thought IDs (`[Thought #N]`).
  - Queries with no relevant context trigger graceful low-confidence responses.
- **Exit Criteria**:
  - End-to-end RAG pipeline answers natural language queries accurately in testing.
- **Explicitly NOT Included**:
  - Keyword search modal overlay.

---

### Phase 6: Unified Semantic & Keyword Search

- **Goals**: Implement `Cmd+K` unified command palette supporting keyword and vector similarity search.
- **Deliverables**:
  - Global `SearchModal` component.
  - Combined SQL ILIKE + `pgvector` similarity query endpoint.
- **Acceptance Criteria**:
  - `Cmd+K` opens modal within 100ms; search results update within 150ms of typing.
- **Exit Criteria**:
  - Selecting a search result opens the source thought card instantly.
- **Explicitly NOT Included**:
  - Advanced boolean logic search query builders.

---

### Phase 7: UI Polish, Performance & Accessibility

- **Goals**: Apply design system tokens, smooth 150ms motion transitions, responsive mobile views, and WCAG AA compliance.
- **Deliverables**:
  - Pixel-perfect dark mode styling using DESIGN_SYSTEM.md color variables.
  - Framer Motion micro-interactions.
  - Full keyboard accessibility focus rings and ARIA attributes.
- **Acceptance Criteria**:
  - Lighthouse performance score ≥ 90; 100% keyboard navigable.
- **Exit Criteria**:
  - Flawless rendering on both desktop (>1200px) and mobile (<768px) screens.
- **Explicitly NOT Included**:
  - New product features outside Thought Dump and AI Workspace.

---

### Phase 8: Hardening, Monitoring & Private Beta

- **Goals**: Deploy staging environment, instrument structured logging, execute error resilience tests, and onboard private beta users.
- **Deliverables**:
  - Production Vercel + Managed Postgres deployment.
  - Error monitoring integration and database backup strategy.
  - Onboarded cohort of initial testers.
- **Acceptance Criteria**:
  - Zero critical crashes during beta testing cohort usage.
- **Exit Criteria**:
  - Beta feedback confirms daily usage of Thought Dump as primary thinking space.
- **Explicitly NOT Included**:
  - Public marketing launches or paid subscriptions.

---

### Phase 9: Public MVP Release

- **Goals**: Open public access to NoveraOS MVP based on frozen documentation and validated stability.
- **Deliverables**:
  - Live production application accessible at primary domain.
  - Complete documentation repository available on GitHub.
- **Acceptance Criteria**:
  - Public user signup and thought capture operating reliably at scale.
- **Exit Criteria**:
  - Validation of MVP thesis: Users choose NoveraOS over Apple Notes for raw thought capture.
- **Explicitly NOT Included**:
  - Post-MVP features (Calendar, Tasks, Kanban, Integrations).

---

## 3. Post-MVP Future Horizons

Subsequent milestones (Phase 10+) will evaluate post-MVP expansion candidates (Calendar sync, local document ingestion, team cognitive spaces) **only after** Phase 9 validation criteria are fully satisfied.

---

## 4. Cross References

- Sacred Scope Guardrails: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
- Product Vision: [VISION.md](file:///c:/Users/gurpr/noveraos/noveraos/VISION.md)
- Engineering Execution Rules: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
