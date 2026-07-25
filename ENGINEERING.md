# ENGINEERING.md

# NoveraOS Engineering & Code Standards

> **Rule 10: Simple beats clever. Readable beats short. Maintainable beats optimized.**

---

## Table of Contents

- [1. Core Coding Standards](#1-core-coding-standards)
- [2. Naming Conventions](#2-naming-conventions)
- [3. Directory & Folder Rules](#3-directory--folder-rules)
- [4. Component Architecture & Limits](#4-component-architecture--limits)
- [5. Error Handling & Resilience](#5-error-handling--resilience)
- [6. Logging Standards](#6-logging-standards)
- [7. API & Server Action Conventions](#7-api--server-action-conventions)
- [8. State Management Philosophy](#8-state-management-philosophy)
- [9. Performance & Memory Guidelines](#9-performance--memory-guidelines)
- [10. Testing Strategy](#10-testing-strategy)
- [11. Cross References](#11-cross-references)

---

## 1. Core Coding Standards

- **Language**: TypeScript exclusively in strict mode (`"strict": true` in `tsconfig.json`).
- **No `any` Type Allowed**: Use explicit interfaces, generics, or `unknown` with runtime Zod type guards.
- **Immutability**: Avoid mutating parameters directly. Use spread operators or immutable data transforms.

---

## 2. Naming Conventions

- **Files & Directories**: `kebab-case` (e.g., `thought-card.tsx`, `use-thought-dump.ts`).
- **React Components**: `PascalCase` matching file semantics (e.g., `ThoughtCard`, `WorkspaceChat`).
- **Variables & Functions**: `camelCase` (e.g., `fetchThoughtById`, `isProcessing`).
- **Constants & Environment Variables**: `UPPER_SNAKE_CASE` (e.g., `MAX_TOKEN_LIMIT`, `DATABASE_URL`).
- **Types & Interfaces**: `PascalCase` prefixed cleanly without Hungarian notation (e.g., `ThoughtItem`, `ChatTurn`).

---

## 3. Directory & Folder Rules

- All source files reside in `@/src` (aliased as `@/*`).
- Feature components are grouped co-located by feature under `src/components/<feature-name>/`.
- Generic re-usable UI primitives live strictly inside `src/components/ui/` (managed via shadcn/ui patterns).
- Server actions and domain helpers reside inside `src/lib/`.

---

## 4. Component Architecture & Limits

- **Maximum Component Length**: **150 lines of code**. If a component exceeds 150 lines, split sub-views into co-located sub-components.
- **Single Responsibility**: Each file exports exactly one primary component or custom hook.
- **Server Components by Default**: Mark components with `"use client"` **only** when managing local state, hooks (`useState`, `useEffect`), or event listeners.

---

## 5. Error Handling & Resilience

- **No Swallowed Exceptions**: Never use empty `catch {}` blocks. Every caught error must be logged or transformed into a structured error result.
- **Result Type Pattern**: Server Actions return structured result objects instead of throwing uncaught exceptions to the client:
  ```typescript
  type ActionResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string; code: string };
  ```
- **Zod Input Validation**: Validate all client payload inputs on the server using Zod schemas before database queries or external API calls.

---

## 6. Logging Standards

- Use structured JSON logging in server contexts:
  ```typescript
  console.log(JSON.stringify({
    level: "INFO",
    timestamp: new Date().toISOString(),
    event: "THOUGHT_CREATED",
    userId,
    thoughtId
  }));
  ```
- Debug loggers are stripped in production builds.

---

## 7. API & Server Action Conventions

- REST endpoints (`/api/*`) are reserved for streaming AI connections (`ReadableStream`) or third-party webhooks.
- Standard CRUD mutations use Next.js **Server Actions** stored in `@/src/lib/actions/`.
- All endpoints verify session authorization (`auth()`) before executing domain logic.

---

## 8. State Management Philosophy

- **Server State**: Next.js App Router cache, revalidation tags (`revalidateTag`), and Server Actions manage primary data synchronization.
- **Local Form State**: `react-hook-form` with `@hookform/resolvers/zod`.
- **Transient UI State**: Lightweight **Zustand** stores for global UI toggles (e.g., Command Palette `isKbdOpen`, Search Drawer state).

---

## 9. Performance & Memory Guidelines

- **Image Optimization**: Use `next/image` with explicit width/height parameters.
- **Bundle Control**: Tree-shake imports (e.g., import specific icons from `lucide-react` directly).
- **Database Query Limits**: Every list query includes explicit pagination (`take: 20`, `skip: N`).

---

## 10. Testing Strategy

- **Unit Tests (Vitest)**: Cover pure utility math, Zod schema validations, and prompt template formatters.
- **Integration Tests (Playwright / MSW)**: Validate Thought Dump capture, Server Action database persistence, and RAG retrieval flows.

---

## 11. Cross References

- Overall System Layering: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
- Technology Choices: [TECH_STACK.md](file:///c:/Users/gurpr/noveraos/noveraos/TECH_STACK.md)
- Agent Rules & DoD: [AGENTS.md](file:///c:/Users/gurpr/noveraos/noveraos/AGENTS.md)
