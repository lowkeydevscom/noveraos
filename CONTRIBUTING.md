# CONTRIBUTING.md

# NoveraOS Engineering & Documentation Contribution Guidelines

> **Rule 7: Every pull request updates documentation first.**

---

## Table of Contents

- [1. Executive Contribution Philosophy](#1-executive-contribution-philosophy)
- [2. The Documentation-First Workflow](#2-the-documentation-first-workflow)
- [3. Git Branching Strategy](#3-git-branching-strategy)
- [4. Commit Message Standards](#4-commit-message-standards)
- [5. Pull Request Guidelines](#5-pull-request-guidelines)
- [6. Local Development Setup](#6-local-development-setup)
- [7. Cross References](#7-cross-references)

---

## 1. Executive Contribution Philosophy

NoveraOS is a documentation-first repository. Code generation comes AFTER documentation.

If you propose a change to a user flow, database entity, API route, or UI component, you must update the relevant root markdown specification file **before or alongside** submitting your code changes.

---

## 2. The Documentation-First Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Read Root Documentation Specs                        │
│ Cross-reference MVP.md, ARCHITECTURE.md & DESIGN.md     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Update Documentation Specs First                     │
│ Modify relevant root markdown files (e.g. DATABASE.md)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Implement Source Code                                │
│ Write clean TypeScript code adhering to ENGINEERING.md  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Submit Pull Request with DoD Checklist               │
│ Verify all items in AGENTS.md Definition of Done pass  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Git Branching Strategy

Branch names must be descriptive and follow conventional prefixes:

- `feat/feature-name` (e.g., `feat/thought-dump-autosave`)
- `fix/bug-description` (e.g., `fix/vector-similarity-threshold`)
- `docs/doc-update` (e.g., `docs/update-prompts-spec`)
- `refactor/component-name` (e.g., `refactor/workspace-chat-stream`)

---

## 4. Commit Message Standards

Commits must follow **Conventional Commits**:

- `docs(mvp): update RAG context retrieval specifications`
- `feat(thought-dump): implement LocalStorage draft recovery hook`
- `fix(ai-pipeline): resolve pgvector cosine operator query join`
- `style(design-system): update card background token variables`

---

## 5. Pull Request Guidelines

Every Pull Request must include a clear description answering:
1. **Which documentation file was updated first?**
2. **How does this change keep the MVP thesis simple?**
3. **Does this satisfy the Definition of Done in `AGENTS.md`?**

PRs that modify code without updating corresponding documentation will be automatically rejected.

---

## 6. Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/noveraos/noveraos.git
cd noveraos

# 2. Install dependencies with pnpm
pnpm install

# 3. Spin up PostgreSQL with pgvector (via Docker)
docker-compose up -d

# 4. Run Prisma database migrations
pnpm prisma migrate dev

# 5. Start Next.js development server
pnpm dev
```

---

## 7. Cross References

- Agent Instructions & DoD: [AGENTS.md](file:///c:/Users/gurpr/noveraos/noveraos/AGENTS.md)
- Code Standards: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
- Project Roadmap: [ROADMAP.md](file:///c:/Users/gurpr/noveraos/noveraos/ROADMAP.md)
