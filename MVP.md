# MVP.md

# NoveraOS MVP Specification & Scope Boundaries

> **Rule 1: The MVP is sacred. No feature may be added unless it explicitly exists in MVP.md.**

---

## Table of Contents

- [1. Executive Thesis](#1-executive-thesis)
- [2. In-Scope MVP Capabilities](#2-in-scope-mvp-capabilities)
  - [2.1 Thought Dump](#21-thought-dump)
  - [2.2 AI Workspace](#22-ai-workspace)
- [3. Explicitly Banned Features](#3-explicitly-banned-features)
- [4. MVP Success & Validation Criteria](#4-mvp-success--validation-criteria)
- [5. Trade-Off Matrix](#5-trade-off-matrix)
- [6. Cross References](#6-cross-references)

---

## 1. Executive Thesis

The primary goal of the NoveraOS MVP is to answer a single question:

> **Would users prefer to capture and explore their raw thoughts inside NoveraOS over Apple Notes, Google Docs, or generic ChatGPT conversations?**

To validate this thesis with absolute speed and clarity, all secondary productivity abstractions are removed.

---

## 2. In-Scope MVP Capabilities

The NoveraOS MVP consists exclusively of two core functional surfaces:

```
┌─────────────────────────────────────────────────────────────────┐
│                        NOVERAOS MVP                             │
├────────────────────────────────┬────────────────────────────────┤
│       1. THOUGHT DUMP          │       2. AI WORKSPACE          │
│ • Raw text input area          │ • RAG-grounded chat session     │
│ • Autosave & draft recovery    │ • Contextual semantic search    │
│ • Background AI parsing        │ • Source thought citations      │
│ • Streamlined view of thoughts │ • Suggested follow-up prompts   │
└────────────────────────────────┴────────────────────────────────┘
```

### 2.1 Thought Dump
- **Frictionless Text Area**: Auto-focus text editor designed for rapid capture without structural constraints.
- **Autosave Engine**: Local storage and background database synchronization to guarantee zero lost work.
- **Asynchronous Enrichment**:
  - Generation of vector embeddings via OpenAI text-embedding-3-small stored in Postgres (`pgvector`).
  - Summarization and key concept extraction for indexed retrieval.
- **Thought Feed**: Chronological list of captured thoughts with search and deletion support.

### 2.2 AI Workspace
- **Retrieval Augmented Generation (RAG) Chat Interface**: Natural language conversational assistant bound strictly to the user's past captured thoughts.
- **Context Grounding & Citations**: Every AI response must cite the exact thought ID(s) used to generate the synthesis.
- **Suggested Inquiries**: Dynamic prompt suggestions derived from top entities extracted from recent thoughts.
- **Semantic & Keyword Search**: Unified search input supporting both exact matching and vector similarity.

---

## 3. Explicitly Banned Features

To protect development speed and product focus, the following features are **STRICTLY PROHIBITED** from the MVP:

- 🚫 **No Calendar or Time Blocking**: No scheduling, recurring events, or calendar sync.
- 🚫 **No Task Management Pages**: No task checkboxes, due dates, priority tags, or Kanban boards.
- 🚫 **No Email or Inbox Integration**: No IMAP/SMTP links, newsletter ingestion, or email scraping.
- 🚫 **No Integrations**: No Slack, Notion, GitHub, Google Drive, or Obsidian importers/exporters.
- 🚫 **No Plugins or Extension Marketplace**: No third-party API hooks or script runtimes.
- 🚫 **No Push or In-App Notifications**: No reminders, desktop banners, or email alerts.
- 🚫 **No Team or Collaboration Features**: No multi-tenant spaces, shared links, or comments.
- 🚫 **No Billing or Subscription Paywalls**: No Stripe integrations or pricing tiers during MVP validation.
- 🚫 **No Enterprise Compliance Features**: No SAML, SSO, audit logging, or custom retention policies.

---

## 4. MVP Success & Validation Criteria

The MVP is deemed successful if:
1. **Daily Thought Capture**: Testers log unstructured thoughts daily without resorting to Apple Notes or scratchpads.
2. **High Synthesis Accuracy**: 90%+ of AI Workspace queries retrieve relevant thought context without hallucinating non-existent facts.
3. **Zero Data Loss**: 100% draft persistence during unexpected browser closures or connection drops.

---

## 5. Trade-Off Matrix

| Strategy | Choice Made | Rationale |
|---|---|---|
| **Feature Set** | Deep & Narrow | Validating 2 core features deeply yields clear signal; 20 shallow features creates noise. |
| **Storage** | Single DB + Vector | PostgreSQL with `pgvector` eliminates infrastructure complexity compared to running dedicated vector databases. |
| **Auth** | Minimal Credentials | Simple Auth.js email/password & OAuth prevents user onboarding friction. |

---

## 6. Cross References

- Product Workflows: [PRODUCT.md](file:///c:/Users/gurpr/noveraos/noveraos/PRODUCT.md)
- User Flows & UI States: [USER_FLOWS.md](file:///c:/Users/gurpr/noveraos/noveraos/USER_FLOWS.md)
- Architecture Specs: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
- Technical Decisions: [DECISIONS.md](file:///c:/Users/gurpr/noveraos/noveraos/DECISIONS.md)
