---
name: Devfolio AI
description: Engineering-focused developer portfolio and technical case studies
colors:
  dark-background: "#09090b"
  dark-surface: "#101012"
  dark-surface-hover: "#17171a"
  dark-border: "#232327"
  dark-border-strong: "#2f2f34"
  dark-foreground: "#ededef"
  dark-muted-foreground: "#8b8b93"
  dark-accent: "#3e7bfa"
  dark-accent-hover: "#5c92ff"
  light-background: "#ffffff"
  light-surface: "#ffffff"
  light-surface-hover: "#f6f6f7"
  light-border: "#e7e7ea"
  light-border-strong: "#d7d7db"
  light-foreground: "#101012"
  light-muted-foreground: "#6c6c74"
  light-accent: "#2f5fe0"
  light-accent-hover: "#2650c2"
  success: "#16a34a"
  warning: "#b45309"
  danger: "#dc2626"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: "Geist Mono, monospace"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
---

# Design System: Devfolio AI

## Visual Identity & Atmosphere

Devfolio AI embodies a precision engineering aesthetic: calm, high-contrast, structured, and credible. It avoids visual clutter, cartoonish bounce animations, and gimmickry in favor of sharp typographic rhythm, clear information density, and subtle micro-interactions.

Dark mode is the primary canvas, with deep neutral obsidian backgrounds (`#09090b`) elevated by structured card surfaces (`#101012`) and delicate borders (`#232327`). Accent blue (`#3e7bfa` in dark, `#2f5fe0` in light) is applied purposefully for key calls-to-action, focus indicators, and active state signals.

## Color System

- **Background & Surfaces**: Layered neutrals (`background` → `surface` → `surface-hover`) establish depth without relying on heavy dropshadows.
- **Borders**: Subdued structural dividers (`border` at 1px) provide spatial rhythm, transitioning to `border-strong` on hover.
- **Text Contrast**: High contrast primary text with muted secondary text (`muted-foreground`) calibrated for WCAG AA/AAA readability.
- **Accent**: Focused cobalt blue used strictly for interactive highlights and primary actions.

## Typography

- **Headings & Display**: Geist Sans with tight letter spacing (`tracking-tight`) and balanced hierarchy.
- **Prose & Longform**: Bounded reading width (`max-w-[68ch]` via `.prose-docs`) with generous line-height (`1.75`) for technical audits and architecture documents.
- **Technical Symbols & Code**: Geist Mono for file paths, HTTP statuses, badges, and code blocks.

## Motion & Interaction Craft

- **Deceleration**: Transitions use exponential or ease-out curves (`easeOut`, `cubic-bezier(0.21, 0.47, 0.32, 0.98)`). Bouncing and elastic easing are strictly banned.
- **Pulsing Indicators**: Asynchronous and typing states utilize subtle opacity and scale pulses with staggered cadence.
- **Focus Rings**: Standardized visible focus rings (`2px solid var(--accent)`) with `2px` offset on all keyboard-navigable elements.
- **Reduced Motion**: Respects `prefers-reduced-motion` by zeroing out translational shifts and intense animations while keeping essential loading status indicators functional.
