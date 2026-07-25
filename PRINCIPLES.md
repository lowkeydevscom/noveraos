# PRINCIPLES.md

# NoveraOS Guiding Architectural & Product Principles

> **Rule 6: Every new feature must answer: Why does this make thinking easier? If it cannot answer that question, reject it.**

---

## Table of Contents

- [1. Product & Cognitive Principles](#1-product--cognitive-principles)
- [2. Engineering & Architectural Principles](#2-engineering--architectural-principles)
- [3. Design & Interface Principles](#3-design--interface-principles)
- [4. AI & Intelligence Principles](#4-ai--intelligence-principles)
- [5. Cross References](#5-cross-references)

---

## 1. Product & Cognitive Principles

1. **Thinking Beats Organizing**
   - *Why*: Organization creates mental tax that suppresses raw creative expression. The system must bear 100% of structural responsibility.

2. **Zero-Friction Capture**
   - *Why*: Ideas evaporate in seconds. If capture requires selecting a folder, tagging, or filling out metadata fields, the user's focus is lost.

3. **Depth Before Breadth**
   - *Why*: Building two core surfaces (Thought Dump, AI Workspace) with exceptional quality delivers high cognitive utility, whereas 20 shallow features create clutter.

4. **Preserve Raw Context**
   - *Why*: AI summaries lose subtle human nuance over time. Original raw thought entries are preserved unchanged as permanent source material.

5. **Memory Is the Product**
   - *Why*: Without persistent knowledge context across sessions, AI remains a disposable utility rather than a trusted cognitive partner.

6. **Silence Is a Feature**
   - *Why*: Popups, notifications, and visual badges demand attention. NoveraOS respects human attention by remaining ambient and quiet.

---

## 2. Engineering & Architectural Principles

7. **Documentation First**
   - *Why*: Writing specs before code forces clear decision-making, prevents wasteful rewrites, and allows human and AI engineers to align flawlessly.

8. **Simple Beats Clever**
   - *Why*: Complex, hyper-abstract code incurs massive maintenance debt. Readable, straightforward patterns ensure longevity and auditability.

9. **No Duplicated Business Logic**
   - *Why*: Duplicating domain rules across client components and API endpoints introduces subtle bugs and maintenance drift.

10. **Strict Layer Separation**
    - *Why*: Isolating UI, server orchestration, database ORM, and AI pipelines guarantees modules can be refactored or replaced independently.

11. **Empirical Log Diagnostics**
    - *Why*: Guessing the cause of bugs leads to symptom patching. All engineering fixes must be justified by explicit log traces and verified root causes.

12. **Asynchronous Enrichment**
    - *Why*: Blocking user inputs to wait for background LLM processing introduces unacceptable latency. Storage must happen instantly.

13. **Local State Mutation Only**
    - *Why*: Mutating global array states or third-party DOM properties directly creates unpredictable side-effects and race conditions.

---

## 3. Design & Interface Principles

14. **Whitespace As Architecture**
    - *Why*: Generous whitespace reduces visual scanning load, allowing the human brain to process text effortlessly.

15. **Dark-Mode Exclusive**
    - *Why*: Maintaining a single high-contrast dark visual system eliminates theme fragmentation and reduces eye fatigue during extended thinking sessions.

16. **Subtle Intentional Motion**
    - *Why*: Animations exceeding 200ms feel sluggish. Motion exists strictly to signal structural transformations, never as visual decoration.

17. **Keyboard First Execution**
    - *Why*: Switching between keyboard and mouse breaks flow state. Primary operations must be executable via intuitive key commands.

---

## 4. AI & Intelligence Principles

18. **Strict Retrieval Grounding**
    - *Why*: AI hallucinations destroy trust. The AI assistant must synthesize answers grounded strictly in user-captured thoughts with explicit citations.

19. **Explainable AI Failure Modes**
    - *Why*: When context is insufficient or retrieval yields low confidence, the system must clearly state its limitations rather than inventing answers.

20. **Context Source Transparency**
    - *Why*: Users must always know which stored thoughts influenced an AI-generated insight, ensuring complete accountability.

---

## 5. Cross References

- Product Boundaries: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
- Code Standards: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
- System Architecture: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
