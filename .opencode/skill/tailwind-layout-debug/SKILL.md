---
name: tailwind-layout-debug
description: Diagnose Tailwind CSS layout bugs — overflow, nested scrolling, flex/grid sizing, height/width constraints, and unexpected document scroll. Use when debugging "content overflows", "page scrolls when it shouldn't", "scrollbar appears", broken h-full/flex-1/min-h-0 behavior, or any layout sizing issue.
---

# Tailwind Layout Debugging

Diagnosis-first skill for CSS layout and overflow bugs. It explains WHY layout breaks via CSS mechanics, then proposes minimal fixes. Not for visual design, typography, accessibility, or component architecture.

## Prime directive

NEVER hide an overflow symptom before identifying its source. Never blindly add `overflow-hidden`, `overflow-x-hidden`, `overflow-y-hidden`, `h-screen`, `h-full`, `max-h-screen`, `flex-1`, `grow`, `shrink-0`, or `min-h-0`. Every utility must have a concrete CSS reason grounded in the actual layout context. Do not iterate random classes hoping one works.

## Distinguish what actually changed

Before fixing anything, determine WHICH measurement is wrong. These are different problems with different fixes:

| Measurement | Meaning |
|---|---|
| element's layout size (offsetWidth/Height, getBoundingClientRect) | space it occupies in flow |
| clientHeight/clientWidth | padding box visible inside the element |
| scrollHeight/scrollWidth | content extent inside it (incl. hidden overflow) |
| document.documentElement.scrollHeight vs window.innerHeight | whole-page scrollability |

Classify the symptom:
- **A** — an element's *layout* size grew → fix sizing at that element or its constraints
- **B** — only *scrollHeight* grew inside a fixed-height scroll container → normally EXPECTED, not a bug
- **C** — an *ancestor's* layout size grew → trace up; the culprit constraint is usually higher
- **D** — *document* scrollHeight grew → something escapes every constrained ancestor (often a missing height constraint or an unconstrained flex item's automatic minimum)
- **E** — DevTools highlights scrollable overflow but nothing misbehaves visually → not a bug; do not "fix"

`scrollHeight > clientHeight` inside an intentionally scrollable, properly sized container is correct behavior.

## CSS facts that explain most of these bugs

**Overflow & scroll containers**
- `overflow: auto | scroll | hidden` makes the box a scroll container; `visible` does not clip, `clip` forbids even programmatic scrolling. If one axis has a scrollable value, `visible` on the other axis computes to `auto`.
- `overflow-hidden` still allows programmatic scroll — content remains reachable and measurable.
- On `html`/`body`, overflow propagates to the viewport (html → body if html is `visible`). An `overflow-hidden` on body/html hides page-level symptoms without removing their cause.
- A scroll container only scrolls if its own size is constrained by ancestors. An `overflow-y-auto` whose parent has `height: auto` just grows instead of scrolling.
- Scrollbars consume inline space unless accounted for (`scrollbar-gutter`) — can cause horizontal overflow.

**Flexbox**
- Only *direct children* are flex items. `flex-1` (= `flex: 1 1 0%`), `grow`, `shrink-*` do nothing on elements whose parent is not `display: flex`.
- Automatic minimum size: a flex item's used `min-width`/`min-height` defaults to `auto`, resolving to a content-based minimum along the main axis. This makes items refuse to shrink below content size — the classic cause of un-shrinkable columns and overflowing rows. Fix: `min-w-0`/`min-h-0` on the *item*, or give it non-visible overflow.
- Grid items have the same automatic-minimum rule.
- In a column flex container, a child stretches cross-axis by default (`align-items: stretch`) only if its own height is `auto`.
- `height: auto` = content-driven intrinsic sizing; percentage heights require a *definite* ancestor height — otherwise `h-full` computes as if absent.

**min-h-0 specifically**
- Meaningful only on a flex/grid item whose min-size:auto blocks shrinking.
- On an ordinary block child it constrains nothing below its own content and never magically limits grandchildren.

## Diagnostic process

1. Read ONLY files relevant to the reported bug.
2. Map the DOM chain: page shell → main/content area → feature wrapper → component → scroll container → content.
3. For each link in the chain determine: display mode, whether flex/grid item or container, containing block, height/width + min/max constraints, overflow value, padding/border contribution.
4. Identify every scroll container in the chain and decide who SHOULD own the scroll (document / shell / main / section / component). Prefer the fewest scroll contexts; if nested scrolling is intentional, verify each container's size is genuinely constrained from above.
5. Compare layout sizes against scrollable extents down the chain; find the FIRST level where reality diverges from intent. That divergence point is where the root cause lives — not necessarily where the symptom shows.
6. Form one concrete hypothesis; validate it with the smallest inspection (computed styles, measured dimensions) or smallest possible change.
7. Only then propose the fix.

## Tailwind class audit

Interpret classes through their underlying CSS, never by name:
- Verify each utility is *effective* given the element's real layout context (is the parent flex? is there a definite height above?).
- Detect: malformed classes (typos produce no CSS), contradictory pairs (`overflow-x-auto overflow-x-hidden`, `h-screen max-h-full` conflicts), redundancies, utilities on the wrong element, and constraints fighting each other (e.g. `flex-1` item without `min-h-0` inside a fixed-height column).
- Remember variants: `md:`-prefixed utilities override base ones only above the breakpoint — a mobile/base class can be the live culprit at small viewports.

## Scope control

Do not audit the repository, reread project docs, refactor unrelated code, change architecture, touch business logic, inspect unrelated features, redesign UI, or introduce abstractions for a local layout bug. Reuse session context already gathered.

## Approval gate (diagnosis-first)

Before editing any file, output exactly:

```
ROOT CAUSE     <concrete CSS/layout explanation>
EVIDENCE       <exact parent/child/layout relationships supporting it>
MINIMAL FIX    <smallest change that should resolve it>
EXPECTED RESULT <what changes after the fix>
SIDE EFFECTS   <only if applicable>
```

Then STOP and wait for approval.
