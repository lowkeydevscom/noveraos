# DESIGN.md

# NoveraOS Design Philosophy & Principles

> **Rule 3: Never invent UI. Every screen must be described inside USER_FLOWS.md.**  
> **Rule 5: Never invent colors. DESIGN_SYSTEM.md is authoritative.**

---

## Table of Contents

- [1. Visual Philosophy](#1-visual-philosophy)
- [2. Interaction Philosophy](#2-interaction-philosophy)
- [3. Animation & Motion Philosophy](#3-animation--motion-philosophy)
- [4. Whitespace as Architecture](#4-whitespace-as-architecture)
- [5. Typography & Readability](#5-typography--readability)
- [6. Delivering a Premium Cognitive Experience](#6-delivering-a-premium-cognitive-experience)
- [7. Accessibility Standards](#7-accessibility-standards)
- [8. UI Anti-Patterns (What UI Must NEVER Become)](#8-ui-anti-patterns-what-ui-must-never-become)
- [9. Cross References](#9-cross-references)

---

## 1. Visual Philosophy

NoveraOS embodies a **"Warm Minimalist"** visual aesthetic, blending the precision of high-end digital productivity tools with the tactile comfort of fine stationery.

Visual clutter is mental friction; friction disrupts thought. The UI establishes a quiet, intentional baseline where user ideas take center stage.

### Key Visual Pillars
- **Bone & Onyx Palette**: Grounded in warm off-white bone (`#FAF8F4`) in light mode and deep warm charcoal (`#181715`) in dark mode to reduce eye strain and avoid sterile "digital" coldness.
- **Tactile Paper Texture**: Base surface layers feature a 2% microscopic paper grain texture that removes cold digital flatness and evokes high-grade paper.
- **Controlled Accents**: **Primary Gold** (`#735C00` / `#D4AF37`) is reserved for critical focus indicators, while **Soft Amber** marks AI-generated content, active suggestions, and thinking states.

---

## 2. Interaction Philosophy

Interaction in NoveraOS must feel **instant, tactile, and predictable**.

- **Zero-Delay Focus**: Navigating to Thought Dump immediately places the focus cursor in the editor without requiring a click.
- **Optimistic UI Updates**: Capturing a thought updates local client state instantly. Server sync occurs asynchronously in the background.
- **Keyboard-First Navigation**: Core workflows (capture, search trigger, AI chat submission) execute without leaving the keyboard (`Cmd+K` / `Ctrl+K` for Floating Command Bar, `Cmd+Enter` to save or send).

---

## 3. Animation & Motion Philosophy

Animations exist solely to convey state transitions and physical spatial hierarchy. They are never decorative.

- **Duration Limit**: All transitions must complete within **150ms to 250ms**.
- **Easing & Scale Standard**: Entry animations transition smoothly from `opacity: 0` to `1` and `scale: 0.98` to `1`. No complex bounce curves or spring paths.
- **State Feedback**: Subtle feedback on button presses, surface elevations, and AI typing indicator pulses.
- **Motion Reduction**: Respect user accessibility settings (`prefers-reduced-motion`) by falling back to instant opacity changes.

---

## 4. Whitespace as Architecture

Whitespace is not empty space; it is structural architecture that replaces heavy borders and visual dividers.

- **The 70/30 Rule**: 70% of visual separation is achieved through whitespace rather than lines. Borders are used only when tonal separation is insufficient for WCAG accessibility.
- **Breathing Padding**: Container padding is at least **1.5x** the external grid gutter so content never feels trapped.
- **Floating Dividers**: List dividers and hairlines stop `16px` short of container edges to reinforce a floating paper appearance.

---

## 5. Typography & Readability

The typography system is engineered for long-form readability and high-density information management:

- **Hanken Grotesk**: Sharp, contemporary headlines and display titles.
- **Inter**: Clean body copy with generous **1.6x leading** for comfortable scanning.
- **JetBrains Mono**: Small-scale monospaced labels for AI parameters, metadata tags, and code tokens to provide clear human-vs-machine contrast.

---

## 6. Delivering a Premium Cognitive Experience

To evoke the feeling of writing on luxury stationery within a modern operating system:
- **Soft-Geometric Shapes**: Base components use `8px` (`0.5rem`) radius; larger container surfaces scale to `16px` or `24px`. Buttons inherit container roundedness for nested visual harmony.
- **Ambient Elevation**: Depth is created using Level 1 soft blur drop shadows (40px blur at 4% opacity) and Level 2 subtle inner strokes.
- **Zero Jank**: Skeletons match exact component geometry to prevent layout shifting during data fetches.

---

## 7. Accessibility Standards

NoveraOS targets **WCAG 2.1 AA** compliance:
- **Color Contrast Ratio**: Minimum 4.5:1 for standard text and 3.0:1 for large text across all surface variants.
- **Keyboard Traversal**: Every button, input, and card is reachable via logical `Tab` indexing with visible focus rings.
- **ARIA Annotations**: Dialogs, command overlays, and live streaming AI responses feature explicit ARIA attributes (`aria-live="polite"`).

---

## 8. UI Anti-Patterns (What UI Must NEVER Become)

To preserve product integrity, the UI must **NEVER**:
- ❌ Become a crowded dashboard with dozens of widgets, meters, or analytics charts.
- ❌ Use bright, saturated rainbow palettes or distracting neon accent overuse.
- ❌ Interrupt the user with popups, tooltips, banners, modal surveys, or rate-us prompts.
- ❌ Hide core actions behind deep multi-level nested dropdown menus.
- ❌ Display raw unformatted AI JSON st