# DESIGN_SYSTEM.md

# NoveraOS Design System Specifications

> **Rule 5: Never invent colors, typography, or layout rules. DESIGN_SYSTEM.md is authoritative.**

---

## Table of Contents

- [1. Brand & Style Aesthetics](#1-brand--style-aesthetics)
- [2. Design Tokens: Color Palette](#2-design-tokens-color-palette)
- [3. Design Tokens: Typography Scale](#3-design-tokens-typography-scale)
- [4. Design Tokens: Spacing & Grid System](#4-design-tokens-spacing--grid-system)
- [5. Design Tokens: Border Radius & Shapes](#5-design-tokens-border-radius--shapes)
- [6. Design Tokens: Elevation, Depth & Motion](#6-design-tokens-elevation-depth--motion)
- [7. Component Specs](#7-component-specs)
  - [7.1 Buttons](#71-buttons)
  - [7.2 Cards](#72-cards)
  - [7.3 Input Fields & Textareas](#73-input-fields--textareas)
  - [7.4 AI Chips & Badges](#74-ai-chips--badges)
  - [7.5 Lists & Hairlines](#75-lists--hairlines)
  - [7.6 Floating Command Bar](#76-floating-command-bar)
  - [7.7 Thought Cards](#77-thought-cards)
  - [7.8 Chat Bubbles](#78-chat-bubbles)
  - [7.9 Dialogs & Modals](#79-dialogs--modals)
- [8. Layout & Breakpoint Rules](#8-layout--breakpoint-rules)
- [9. Cross References](#9-cross-references)

---

## 1. Brand & Style Aesthetics

NoveraOS embodies a premium **"Warm Minimalist"** aesthetic, blending the precision of high-end productivity tools with the tactile comfort of high-quality stationery. The system is designed for high-output professionals who require an AI operating system that feels calm, organized, and intentional rather than overwhelming or purely technical.

### Aesthetics & Principles
- **Corporate Modernism with Tactile Nuances**: Combines ultra-clean modern typography and structural whitespace with tactile/skeuomorphic cues.
- **Negative Space as Structure**: 70% of spatial separation is achieved through whitespace rather than explicit borders. Traditional outline borders are replaced by intentional whitespace and subtle tonal shifts.
- **Microscopic Paper Grain**: A 2% microscopic grain texture is applied to base layers to remove sterile "digital" coldness and evoke fine stationery.
- **Bone and Onyx Foundation**: Light mode is grounded in warm off-white bone (`#FAF8F4`), and dark mode uses deep warm charcoal (`#181715`) rather than harsh true black.

---

## 2. Design Tokens: Color Palette

### System Theme Tokens (CSS Custom Properties)

```css
:root {
  /* Surface Tokens */
  --color-surface: #fff8f0;
  --color-surface-dim: #e1d9cc;
  --color-surface-bright: #fff8f0;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #fbf3e5;
  --color-surface-container: #f5eddf;
  --color-surface-container-high: #efe7da;
  --color-surface-container-highest: #eae1d4;

  /* On-Surface & Contrast Tokens */
  --color-on-surface: #1f1b13;
  --color-on-surface-variant: #4d4635;
  --color-inverse-surface: #343027;
  --color-inverse-on-surface: #f8f0e2;

  /* Outline Tokens */
  --color-outline: #7f7663;
  --color-outline-variant: #d0c5af;

  /* Primary Accent Tokens (Gold) */
  --color-surface-tint: #735c00;
  --color-primary: #735c00;
  --color-on-primary: #ffffff;
  --color-primary-container: #d4af37;
  --color-on-primary-container: #554300;
  --color-inverse-primary: #e9c349;
  --color-primary-fixed: #ffe088;
  --color-primary-fixed-dim: #e9c349;
  --color-on-primary-fixed: #241a00;
  --color-on-primary-fixed-variant: #574500;

  /* Secondary Neutral Tokens */
  --color-secondary: #5e5e5c;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #e1dfdc;
  --color-on-secondary-container: #636360;
  --color-secondary-fixed: #e4e2df;
  --color-secondary-fixed-dim: #c8c6c4;
  --color-on-secondary-fixed: #1b1c1a;
  --color-on-secondary-fixed-variant: #474745;

  /* Tertiary AI Tokens (Soft Blue / Indigo Accent) */
  --color-tertiary: #415ba4;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #97b0ff;
  --color-on-tertiary-container: #254188;
  --color-tertiary-fixed: #dbe1ff;
  --color-tertiary-fixed-dim: #b4c5ff;
  --color-on-tertiary-fixed: #00174b;
  --color-on-tertiary-fixed-variant: #27438a;

  /* Error & Warning Tokens */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  /* Base App Backgrounds */
  --color-background: #fff8f0;
  --color-on-background: #1f1b13;
  --color-surface-variant: #eae1d4;

  /* Mode Bases */
  --mode-light-base: #faf8f4;
  --mode-dark-base: #181715;
}
```

### Color Usage Rules
1. **Primary Gold (`#735C00` / `#D4AF37`)**: Reserved strictly for critical focus indicators, primary state highlights, and premium feature badges.
2. **Soft Amber**: Reserved specifically for AI-generated content, active suggestions, and thinking states.
3. **Tonal Neutrals**: All grays are warm-tinted to maintain the organic paper feel and prevent metallic coldness.

---

## 3. Design Tokens: Typography Scale

### Typefaces
- **Hanken Grotesk**: Display headings and page titles (sharp, contemporary edge).
- **Inter**: Body text, inputs, labels, and UI controls (generous 1.6x leading for breathing layouts).
- **JetBrains Mono**: Technical metadata, code snippets, monospaced labels, and AI parameters.

### Typography Tokens Table

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display-lg` | `Hanken Grotesk` | 48px | 600 | 1.1 | -0.02em | Hero headers, major splash headlines |
| `headline-lg` | `Hanken Grotesk` | 32px | 600 | 1.2 | -0.01em | Desktop page titles, section hero headers |
| `headline-lg-mobile` | `Hanken Grotesk` | 28px | 600 | 1.2 | normal | Mobile page titles |
| `title-md` | `Inter` | 20px | 500 | 1.4 | normal | Card headings, section titles, modal headers |
| `body-lg` | `Inter` | 16px | 400 | 1.6 | normal | Primary body copy, thought text, chat messages |
| `body-sm` | `Inter` | 14px | 400 | 1.5 | normal | Secondary text, input text, table rows, descriptions |
| `label-caps` | `Inter` | 12px | 600 | 1.0 | 0.05em | Uppercase metadata tags, section labels |
| `mono-label` | `JetBrains Mono` | 12px | 500 | 1.0 | normal | AI parameter tags, timestamps, code tokens |

---

## 4. Design Tokens: Spacing & Grid System

### Spacing Scale & Tokens
- `unit`: `4px` (Base grid unit)
- `container-padding`: `32px`
- `stack-gap-lg`: `40px`
- `stack-gap-md`: `24px`
- `stack-gap-sm`: `12px`
- `grid-gutter`: `24px`

### Layout Rules
- **The 70/30 Rule**: 70% of visual separation is achieved through whitespace rather than lines. Borders should only be used when tonal separation is insufficient for WCAG accessibility.
- **Breathing Padding**: Cards and containers feature internal padding that is at least **1.5x** the external grid gutter to prevent content from feeling trapped.

---

## 5. Design Tokens: Border Radius & Shapes

The shape language is **Soft-Geometric**, avoiding bubbly consumer styling while maintaining smooth, organic containment.

| Token | CSS Value | Rem / Pixel | Usage |
|---|---|---|---|
| `sm` | `0.25rem` | 4px | Small inline badges, tags, code chips |
| `DEFAULT` | `0.5rem` | 8px | Buttons, input fields, standard cards |
| `md` | `0.75rem` | 12px | Medium panels, dropdown menus |
| `lg` | `1rem` | 16px | Large application containers, workspace panels |
| `xl` | `1.5rem` | 24px | Full-screen workspace cards, primary popovers |
| `full` | `9999px` | 9999px | Avatars, rounded pill badges |

*Note: Inner buttons must follow the outer container's roundedness to preserve nested visual harmony.*

---

## 6. Design Tokens: Elevation, Depth & Motion

### Depth & Tonal Layering
Depth is constructed via **Tonal Layers** and **Ambient Shadows** rather than stark borders.

1. **Level 0 (Base)**: Background color (`var(--color-background)`) with a 2% microscopic grain texture overlay.
2. **Level 1 (Cards & Surfaces)**: Surface color (`var(--color-surface)`), borderless, with a `40px` blur shadow at 4% opacity (Warm Umber/Gray tint).
3. **Level 2 (Modals & Popovers)**: Surface container color with a subtle 1px inner stroke (`rgba(255, 255, 255, 0.1)` in dark mode) defining edges against the backdrop.

### Motion Tokens
- **Maximum Transition Duration**: `250ms` (all state transitions must complete within this window).
- **Scale & Fade Standard**: Entry transitions use `opacity: 0 -> 1` paired with `scale: 0.98 -> 1`.
- **No Complex Paths**: Bouncing animations, heavy spring physics, or erratic motion paths are prohibited.

---

## 7. Component Specs

### 7.1 Buttons
- **Primary Buttons**: Solid dark fill in light mode / solid light fill in dark mode. No background gradients. Roundedness matches parent container (`DEFAULT: 0.5rem`).
- **Secondary Buttons**: Ghost-style with a subtle background hover state (`var(--color-surface-container-high)`).
- **Interactive State**: Fast 150ms smooth transition, subtle active scale (`0.98`).

### 7.2 Cards
- Borderless design (relying on Level 1 shadow & tonal contrast between `#FFFFFF` and `#FAF8F4` or `#181715`).
- Internal padding: 24px – 32px (Breathing Padding rule).

### 7.3 Input Fields & Textareas
- Subtle "inset" visual depth using a slightly darker container fill (`var(--color-secondary-container)`).
- Focus State: Indicated by a 1px Gold or Amber underline or a subtle amber glow ring (`0 0 0 2px rgba(212, 175, 55, 0.25)`).

### 7.4 AI Chips & Badges
- Features a soft Amber glow (`blur: 8px`).
- Labels use `mono-label` (`JetBrains Mono`, 12px, 500) to clearly distinguish AI-generated tags from system tags.

### 7.5 Lists & Hairlines
- Rows are separated primarily by whitespace.
- Optional 1px hairline dividers stop `16px` short of container edges to create a floating paper effect rather than rigid structural grids.

### 7.6 Floating Command Bar
- Superhuman-inspired central floating overlay.
- Backdrop blur: `20px` (`backdrop-filter: blur(20px)`).
- Elevation: Level 2 overlay depth with a 1px subtle inner border.

### 7.7 Thought Cards
- Visual container for captured thoughts in Thought Dump.
- Header: Timestamp formatted in `mono-label` (`JetBrains Mono`), extracted concept tags rendered in soft amber AI chips.
- Body: `body-lg` text (`Inter`, 16px, 1.6 leading). Expandable raw view with smooth 200ms height transition.

### 7.8 Chat Bubbles
- User Bubble: Right-aligned, solid container fill (`var(--color-surface-container-highest)`).
- AI Assistant Bubble: Left-aligned, soft surface container (`var(--color-surface-container)`), left accent indicator line in Soft Amber (`var(--color-primary-container)`). Inline thought citation chips.

### 7.9 Dialogs & Modals
- Backdrop: Heavy backdrop blur (`backdrop-filter: blur(12px)`) with 50% dim background.
- Modal Panel: Level 2 elevation, rounded `xl` (`1.5rem` / `24px`), max width `640px`.

---

## 8. Layout & Breakpoint Rules

NoveraOS uses a **Fixed Grid** for main application shells and a **Fluid Content** model for internal workspaces.

### Responsive Breakpoints Table

| Breakpoint | Viewport Range | Grid Columns | Margins / Padding | Navigation Layout |
|---|---|---|---|---|
| **Desktop** | `1440px+` | 12 Columns | 32px Margins | Fixed sidebar / Split dual-workspace view |
| **Tablet** | `768px - 1439px` | 8 Columns | 24px Margins | Collapsible sidebar drawer |
| **Mobile** | `< 768px` | 4 Columns | 16px Margins | Bottom navigation bar / full-width stack |

---

## 9. Cross References

- Design Philosophy: [DESIGN.md](file:///c:/Users/gurpr/noveraos/noveraos/DESIGN.md)
- User Flows & UI Specifications: [USER_FLOWS.md](file:///c:/Users/gurpr/noveraos/noveraos/USER_FLOWS.md)
- Engineering Implementation Rules: [ENGINEERING.md](file:///c:/Users/gurpr/noveraos/noveraos/ENGINEERING.md)
- MVP Product Scope: [MVP.md](file:///c:/Users/gurpr/noveraos/noveraos/MVP.md)
