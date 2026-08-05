# Devfolio AI — Design System

A neutral-grayscale, single-blue-accent component library for the Devfolio AI
project: Next.js 16, React 19, TypeScript, Tailwind CSS v4. Built to feel like
Vercel / Linear / GitHub docs, not a generic AI-generated theme.

## What's in here

```
app/
  globals.css        design tokens (Tailwind v4 @theme + light/dark CSS vars)
  layout.tsx          root layout: fonts, ThemeProvider, dark-by-default html
  showcase/page.tsx   every component rendered together — your visual QA page
components/
  theme-provider.tsx
  ui/
    button.tsx         5 variants, 4 sizes, loading state, asChild support
    badge.tsx           default / neutral / outline / success / warning / danger
    card.tsx             Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
    input.tsx  textarea.tsx  label.tsx
    separator.tsx  avatar.tsx  tabs.tsx  tooltip.tsx
    callout.tsx         documentation admonitions (info/success/warning/danger)
    code-block.tsx       ★ signature component — see below
    breadcrumbs.tsx
    navbar.tsx  sidebar-nav.tsx  table-of-contents.tsx
    theme-toggle.tsx
lib/
  utils.ts             cn() — clsx + tailwind-merge
```

## Design tokens

Defined once in `app/globals.css`, consumed everywhere via Tailwind v4's
`@theme inline` mapping — so `bg-background`, `text-muted-foreground`,
`border-border`, `rounded-lg`, `shadow-[var(--shadow-token-md)]` etc. all work
directly as utility classes, and swap automatically between light and dark.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | `#09090b` | `#ffffff` | page background |
| `--surface` | `#101012` | `#ffffff` | cards, panels |
| `--border` | `#232327` | `#e7e7ea` | hairlines |
| `--foreground` | `#ededef` | `#101012` | body text |
| `--muted-foreground` | `#8b8b93` | `#6c6c74` | secondary text |
| `--accent` | `#3e7bfa` | `#2f5fe0` | the one blue accent |

Radius scale: `sm 6px / md 8px / lg 12px / xl 16px`.
Fonts: **Geist** (sans) for UI, **Geist Mono** for code and captions — loaded
via `next/font/google` in `app/layout.tsx`, no extra install needed.

Dark mode is the default (`<html className="dark">`, `defaultTheme="dark"`
in the theme provider); light mode is a fully specified parallel palette
toggled by `ThemeToggle`, not an auto-inversion.

## The signature element

`CodeBlock` is the piece the rest of the system is built around: window-chrome
dots, filename/language label, line numbers, and a copy button, styled to look
like an editor pane rather than a generic `<pre>`. Since every project page in
Devfolio AI needs to show real source, prompts, and terminal output, this
component is the visual anchor that ties "portfolio" to "engineering
documentation."

## Install

```bash
npm install next-themes class-variance-authority clsx tailwind-merge \
  lucide-react framer-motion \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  @radix-ui/react-avatar @radix-ui/react-separator @radix-ui/react-label

npm install -D tailwindcss @tailwindcss/postcss tw-animate-css
```

Copy `app/`, `components/`, `lib/` into your project (merge `globals.css` and
`layout.tsx` with your existing ones if they already exist), then visit
`/showcase` to see everything rendered together.

Requires a `tsconfig.json` path alias:

```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

## Conventions for new components

- Every interactive primitive needs a visible `:focus-visible` ring (already
  handled globally for the accent color) and must respect
  `prefers-reduced-motion` (also handled globally).
- Use `cn()` from `lib/utils.ts` for all conditional class merging.
- Reach for Radix primitives for anything with state/accessibility semantics
  (menus, dialogs, popovers) rather than hand-rolling them.
- Keep animation minimal and purposeful — this system favors precision over
  motion, per the brief.
