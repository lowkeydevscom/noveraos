# PRODUCT.md

# NoveraOS Product Specification

> **The product is not an editor or a chat window. The product is organized human intelligence.**

---

## Table of Contents

- [1. Product Definition](#1-product-definition)
- [2. Primary Use Cases & Personas](#2-primary-use-cases--personas)
- [3. Core Workflows](#3-core-workflows)
- [4. End-to-End User Journey](#4-end-to-end-user-journey)
- [5. Desired Experience & User Emotions](#5-desired-experience--user-emotions)
- [6. Product Boundaries](#6-product-boundaries)
- [7. Cross-Document References](#7-cross-document-references)

---

## 1. Product Definition

NoveraOS is a personal knowledge application built around two core interfaces:
1. **Thought Dump**: A frictionless capture area where users input unformatted, raw thoughts, ideas, fragments, meeting takeaways, or reflections.
2. **AI Workspace**: An interactive synthesis view where users query their accumulated knowledge, review AI-generated context cards, explore related thoughts, and interact with an intelligence agent that holds persistent memory of their input history.

NoveraOS bridges the gap between chaotic raw brainstorming and structured personal memory.

---

## 2. Primary Use Cases & Personas

### 2.1 Target Users
- **Founders & Executives**: Who generate dozens of strategic ideas, decisions, and meeting notes daily without time to categorize them.
- **Software Engineers & Architects**: Who log technical trade-offs, bug observations, architecture decisions, and code snippets requiring semantic recall later.
- **Researchers & Writers**: Who collect loose quotes, citations, concepts, and thesis fragments that require synthesis into cohesive drafts.
- **Students & Lifelong Learners**: Who record lecture insights, reading summaries, and study notes that need contextual linking.

### 2.2 Primary Use Cases
- **Instant Dump & Recovery**: Recording an fleeting idea during a walk or meeting and knowing it will be indexed instantly.
- **Contextual Inquiry**: Asking natural language questions like *"What trade-offs did I note down last month regarding Postgres vs DynamoDB?"* and receiving precise synthesis with references to original entries.
- **Synthesis & Pattern Recognition**: Reviewing automatic summaries and extracted entities (projects, concepts, tools) without manually tagging notes.

---

## 3. Core Workflows

```
┌─────────────────────────────────────────────────────────┐
│                     THOUGHT DUMP                        │
│ User types raw, unstructured text & hits save/autosave   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   ASYNC AI PIPELINE                     │
│ 1. Vector Embedding Creation (pgvector)                │
│ 2. Summary & Key Concept Extraction                     │
│ 3. Memory & Entity Association                          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     AI WORKSPACE                        │
│ User queries memory, explores related thoughts, and     │
│ interacts with AI grounded in captured knowledge         │
└─────────────────────────────────────────────────────────┘
```

### 3.1 Workflow A: Capture (Thought Dump)
1. User opens NoveraOS. The cursor defaults to the Thought Dump input line immediately.
2. User types or pastes text without worrying about formatting, headings, or folders.
3. System saves the entry automatically with zero latency.
4. Background worker computes vector embeddings and extracts entity references.

### 3.2 Workflow B: Synthesis & Retrieval (AI Workspace)
1. User navigates to AI Workspace.
2. User submits a natural language question or chooses a suggested prompt based on recent thoughts.
3. AI retrieves relevant thought chunks from pgvector, analyzes context, and renders a response citing the exact source thoughts.

---

## 4. End-to-End User Journey

### Phase 1: Onboarding & First Thought
- The user signs up and lands directly on an empty, distraction-free Thought Dump screen.
- A single subtle prompt invites them: *"What's on your mind?"*
- User inputs their first note and saves it.

### Phase 2: Processing & Feedback
- The system visually acknowledges capture with a smooth transition.
- Background jobs derive key topics and build vector embeddings.

### Phase 3: Exploration in AI Workspace
- User opens the AI Workspace.
- The AI presents contextual insights or answers questions grounded in past entries.

For exact UI steps and state representations, see [USER_FLOWS.md](file:///c:/Users/gurpr/noveraos/noveraos/USER_FLOWS.md).

---

## 5. Desired Experience & User Emotions

| Emotion | Operational Reality |
|---|---|
| **Relief** | User dumps an overwhelming mess of thoughts knowing the system will organize it later. |
| **Trust** | The AI never fabricates notes and accurately cites original inputs. |
| **Clarity** | The interface uses generous whitespace, dark mode themes, and clear typography. |
| **Empowerment** | Asking a question yields immediate, synthesized insights from months of personal notes. |

---

## 6. Product Boundaries

NoveraOS strictly maintains boundaries to avoid feature creep:

- **IN MVP**:
  - Unstructured rich text capture (Thought Dump)
  - Automatic background vector embedding generation & entity parsing
  - RAG-powered chat workspace with persistent history (AI Workspace)
  - Semantic search & filtering across captured thoughts

- **EXCLUDED FROM MVP**:
  - Calendars, event scheduling, time-blocking
  - Task checkboxes, sprint boards, kanban lanes
  - Email inbox integrations or third-party webhooks
  - Multi-user sharing, permissions, or collaborative editing
  - Monetization tier setups or team administration controls

---

## 7. Cross-Document References

- Core MVP Scope & Non-Goals: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
- User Interface Flows: [USER_FLOWS.md](file:///c:/Users/gurpr/noveraos/noveraos/USER_FLOWS.md)
- Design Language & Aesthetics: [DESIGN.md](file:///c:/Users/gurpr/noveraos/noveraos/DESIGN.md) & [DESIGN_SYSTEM.md](file:///c:/Users/gurpr/noveraos/noveraos/DESIGN_SYSTEM.md)
- AI & Retrieval Pipeline: [AI.md](file:///c:/Users/gurpr/noveraos/noveraos/AI.md)
