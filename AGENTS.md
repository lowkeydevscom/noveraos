# AGENTS.md

# Instructions & Protocols for AI Coding Agents

> **CRITICAL INSTRUCTION: Documentation is the single source of truth. If code conflicts with documentation, documentation wins.**

---

## Table of Contents

- [1. Fundamental Agent Imperatives](#1-fundamental-agent-imperatives)
- [2. Pre-Execution Mandatory Reading Protocol](#2-pre-execution-mandatory-reading-protocol)
- [3. Prohibited Agent Actions (NEVER DO)](#3-prohibited-agent-actions-never-do)
- [4. Code Modification Rules](#4-code-modification-rules)
- [5. Definition of Done (DoD) Checklist](#5-definition-of-done-dod-checklist)
- [6. Cross References](#6-cross-references)

---

## 1. Fundamental Agent Imperatives

As an AI coding agent operating inside NoveraOS, your job is to implement code that adheres strictly to the pre-established documentation. 

You do not invent product features, choose unapproved styling frameworks, or modify architectural layers arbitrarily.

---

## 2. Pre-Execution Mandatory Reading Protocol

Before editing, creating, or refactoring ANY source file in this repository, you MUST read and cross-reference the following core specifications:

1. [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md): Verify that the target task is inside the sacred MVP scope.
2. [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md): Verify component, API, and database layer boundaries.
3. [DESIGN_SYSTEM.md](file:///c:/Users/gurpr/noveraos/noveraos/DESIGN_SYSTEM.md): Verify exact color tokens, typography, and spacing variables.
4. [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md): Verify code style, maximum line limits (150 lines), and error handling rules.

---

## 3. Prohibited Agent Actions (NEVER DO)

An agent must **NEVER**:

- ❌ **Invent Features**: Never add features outside Thought Dump and AI Workspace (e.g., calendars, tasks, kanban, billing).
- ❌ **Ignore MVP Scope**: Never add third-party plugins, team sharing, or notification popups.
- ❌ **Break System Architecture**: Never execute direct database queries from Client Components.
- ❌ **Duplicate Logic**: Never duplicate Zod validation or string sanitization logic; always import from `@/lib/`.
- ❌ **Change Design Language**: Never introduce arbitrary Tailwind colors, inline style objects, or custom light themes.
- ❌ **Add Unjustified Dependencies**: Never install additional npm packages without explicit authorization and technical justification.
- ❌ **Suppress Log Errors**: Never write empty `catch {}` blocks or return mock dummy fallback data to hide runtime bugs.

---

## 4. Code Modification Rules

- **Component Size Limit**: Keep React components under **150 lines of code**. Split large views into co-located sub-components.
- **Strict Typing**: Use explicit TypeScript interfaces. Do not use `any`.
- **Server Actions**: Put all database mutations in `@/lib/actions/` with Zod schema verification and structured `ActionResult<T>` returns.

---

## 5. Definition of Done (DoD) Checklist

Every task executed by an AI agent must satisfy this checklist before declaring completion:

```markdown
- [ ] 1. Scope Verification: Feature belongs strictly inside Thought Dump or AI Workspace.
- [ ] 2. Documentation Alignment: Implementation conforms 100% to ARCHITECTURE.md and USER_FLOWS.md.
- [ ] 3. Design Tokens: All colors, typography, and radii use exact variables from DESIGN_SYSTEM.md.
- [ ] 4. Component Size: Every modified or created component is strictly under 150 lines.
- [ ] 5. Zero TypeScript Errors: `pnpm build` passes with zero type errors.
- [ ] 6. Zero Unhandled Errors: All server actions return structured result objects with Zod input validation.
- [ ] 7. Unit / Integration Verification: Tests added or updated to cover modified domain logic.
- [ ] 8. Documentation Updated: Any updated interface or schema is reflected back into root markdown specs.
```

---

## 6. Cross References

- Engineering Rules: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
- Architecture Contracts: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
- Product Scope Guardrails: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
