# USER_FLOWS.md

# NoveraOS User Flows & Interface Specifications

> **Rule 3: Never invent UI. Every screen must be described inside USER_FLOWS.md.**

---

## Table of Contents

- [1. Executive UX Philosophy](#1-executive-ux-philosophy)
- [2. Flow 1: Landing Page](#2-flow-1-landing-page)
- [3. Flow 2: Authentication (Login / Signup)](#3-flow-2-authentication-login--signup)
- [4. Flow 3: First Thought Capture (Thought Dump)](#4-flow-3-first-thought-capture-thought-dump)
- [5. Flow 4: Background AI Processing](#5-flow-4-background-ai-processing)
- [6. Flow 5: AI Workspace (Chat & Synthesis)](#6-flow-5-ai-workspace-chat--synthesis)
- [7. Flow 6: Unified Search & Retrieval](#7-flow-6-unified-search--retrieval)
- [8. Flow 7: Returning User Experience](#8-flow-7-returning-user-experience)
- [9. Flow 8: Error States & Recovery](#9-flow-8-error-states--recovery)
- [10. Flow 9: Empty States](#10-flow-9-empty-states)
- [11. Flow 10: Loading & Streaming States](#11-flow-10-loading--streaming-states)
- [12. Cross References](#12-cross-references)

---

## 1. Executive UX Philosophy

Every screen inside NoveraOS exists to minimize friction between thought and storage. Navigation is minimal, animations are instantaneous (150ms), and key inputs auto-focus on load.

---

## 2. Flow 1: Landing Page

- **Screen Layout**:
  - Centered hero heading: *"Focus on thinking. AI handles the rest."*
  - Subtitle: *"The AI-native personal workspace for unstructured ideas."*
  - Primary CTA: `Get Started` button (navigates to Signup).
  - Secondary CTA: `Sign In` text link.
- **Interactions**:
  - Clicking `Get Started` triggers a smooth page transition (`duration-normal`) to Authentication.

---

## 3. Flow 2: Authentication (Login / Signup)

- **Screen Layout**:
  - Centered dark surface card (`bg-surface`, `radius-xl`).
  - Inputs: `Email Address` and `Password`.
  - Actions: `Continue with Email` primary button; `Sign in with Google` secondary button.
- **Interactions**:
  - Submitting credentials validates via Zod on the client.
  - On successful Auth.js response, user is redirected directly to **Thought Dump**.

---

## 4. Flow 3: First Thought Capture (Thought Dump)

- **Screen Layout**:
  - Top Bar: Minimal header with NoveraOS logomark and tab toggle (`Thought Dump` | `AI Workspace`).
  - Main Canvas: Auto-focused borderless rich text area with placeholder: *"What's on your mind? Type freely..."*
  - Bottom Bar: Word count indicator, autosave status indicator (`Saved`), and `Save Thought` button (`Cmd+Enter`).
- **Interactions**:
  - As user types, autosave persists draft locally to `localStorage` every 500ms.
  - Pressing `Cmd+Enter` or clicking `Save Thought` executes a Server Action saving raw content to PostgreSQL and resetting editor state.

---

## 5. Flow 4: Background AI Processing

- **Screen Layout**:
  - The captured thought appears immediately at the top of the **Thought Feed** list below the input canvas.
  - A subtle pulse badge (`Processing...`) appears on the card footer.
- **Interactions**:
  - Async server pipeline computes vector embeddings and extracts summary/entities.
  - Upon completion, the pulse badge transitions quietly into extracted entity tag chips (e.g., `#architecture`, `#database`).

---

## 6. Flow 5: AI Workspace (Chat & Synthesis)

- **Screen Layout**:
  - Left Panel / Main Area: Conversational chat stream displaying past turns.
  - Messages display AI answers formatted in clean markdown.
  - Citation Chips: Inline chips (`[Thought #12]`) placed next to synthesized statements. Hovering highlights source text; clicking opens source thought modal.
  - Bottom Input: Fixed chat textarea with prompt suggestions above it (e.g., *"What did I decide about Postgres indexing?"*).

---

## 7. Flow 6: Unified Search & Retrieval

- **Screen Layout**:
  - Activated via `Cmd+K` keyboard shortcut anywhere in app.
  - Centered Modal Overlay (`backdrop-blur-sm`).
  - Search Input: Real-time query input.
  - Results List: Displays exact keyword matches alongside semantic vector matches with relevance scores.

---

## 8. Flow 7: Returning User Experience

- **Screen Layout**:
  - User lands directly in **Thought Dump** with cursor focused immediately in the input area.
  - Recent thoughts feed renders immediately below input area.

---

## 9. Flow 8: Error States & Recovery

- **Network Offline**:
  - Banner appears at top: *"Offline mode active. Thoughts saved locally until connection restores."*
- **AI Processing Error**:
  - Thought card displays: *"Enrichment delayed. Thought saved safely."* with a manual `Retry Processing` action link.

---

## 10. Flow 9: Empty States

- **Empty Thought Feed**:
  - Illustration / Minimal graphic with text: *"No thoughts recorded yet. Type above to begin."*
- **Empty AI Workspace Chat**:
  - Suggested starting prompts:
    - *"Summarize my entries from this week."*
    - *"What are my active open research questions?"*

---

## 11. Flow 10: Loading & Streaming States

- **Initial App Load**: Skeleton surface loader matching exact card bounds (`radius-lg`, pulsing `--bg-surface-hover`).
- **AI Workspace Streaming**: Responses stream token-by-token using Vercel AI SDK text decoding with a subtle flashing cursor inline.

---

## 12. Cross References

- Design Tokens & Colors: [DESIGN_SYSTEM.md](file:///c:/Users/gurpr/noveraos/noveraos/DESIGN_SYSTEM.md)
- Product Use Cases: [PRODUCT.md](file:///c:/Users/gurpr/noveraos/noveraos/PRODUCT.md)
- RAG Context Retrieval: [AI.md](file:///c:/Users/gurpr/noveraos/noveraos/AI.md)
