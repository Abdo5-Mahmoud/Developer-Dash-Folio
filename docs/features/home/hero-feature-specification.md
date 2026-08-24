# Hero Feature Engineering Specification

## Devfolio AI â€” Home Page Hero

**Parent page:** Home (`/`)  
**Source documents:** [`prd.md`](../../product/prd.md), [`information-architecture.md`](../../architecture/information-architecture.md), [`page-assembly-specification.md`](../../architecture/page-assembly-specification.md), existing Design System  
**Scope:** Product, UX, accessibility, and frontend composition specification only. No implementation.

---

## 1. Feature Purpose

The Hero solves the first-visit evaluation problem: a visitor must understand who the portfolio owner is, what kind of engineering work they do, and why this portfolio is worth more attention before they have to scroll or inspect a project.

It exists because a conventional portfolio hero often stops at a job title. Devfolio AI needs to establish a more credible promise: the owner builds software and documents the reasoning behind itâ€”architecture, trade-offs, performance work, and critical use of AI.

The expected outcome is that, within the first 10 seconds, a visitor can identify the owner role and core specialization, understand the engineering-documentation differentiator, and choose a clear next action:

- browse projects to evaluate work;
- inspect the AI workflow to evaluate process; or
- inspect the Contact page after reviewing evidence.

The Hero is an entry point, not a complete resume, skills directory, project gallery, or contact form.

---

## 2. User Goals

| Visitor                   | Primary goal                                                                                          | Hero must enable                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Recruiter                 | Decide quickly whether the candidate is relevant and credible.                                        | Scan name, role, concise positioning, core technologies, availability/context, and open Projects or Contact without technical overload. |
| Engineering Manager       | Decide whether the candidate demonstrates the kind of engineering judgment needed for a role.         | Understand that projects contain architecture and decision evidence, then open a case study directly.                                   |
| Developer / peer reviewer | Assess technical focus and whether the AI-assisted workflow appears rigorous rather than superficial. | Identify technology focus, understand the documentation-first angle, and enter AI Workflow or Projects.                                 |

---

## 3. Business Goals

- Increase the share of visitors who open a project detail page from Home.
- Make the portfolio ownerâ€™s positioning memorable: software engineer with documented engineering judgment and deliberate AI-assisted development practice.
- Reduce recruiter time-to-fit assessment by making role, specialization, and proof path visible immediately.
- Route visitors to the highest-value portfolio evidence rather than to generic social profiles first.
- Maintain one centrally managed set of profile/hero content so professional positioning stays consistent across Home, About, metadata, and contact pathways.

---

## 4. Content Hierarchy

The hero content is ordered by decision value. The left-to-right or top-to-bottom visual arrangement may adapt by breakpoint, but the reading order must remain as follows.

| Priority | Element                    | Required content / purpose                                                                                                                                            | Rationale                                                                                         |
| -------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1        | Identity and role          | Name and concise professional role.                                                                                                                                   | Answers â€œwho is this?â€ and â€œwhat do they do?â€ immediately.                                  |
| 2        | Positioning headline       | One concise sentence describing the engineering focus and portfolio value, e.g., building production-quality frontend systems and documenting how decisions are made. | States the differentiator before a visitor has to interpret project cards.                        |
| 3        | Proof-oriented description | One short supporting sentence explaining that case studies include architecture, decisions, performance, and AI review where applicable.                              | Turns the headline into a credible reason to continue without making the initial scan text-heavy. |
| 4        | Primary CTA                | `Explore Projects`, routed to `/projects`.                                                                                                                            | This is the core recruiter and hiring-manager path, so it has highest action emphasis.            |
| 5        | Secondary CTA              | `View AI Workflow`, routed to `/ai-workflow`.                                                                                                                         | Supports technical reviewer interest without competing with the portfolioâ€™s primary proof path. |
| 6        | Technology focus           | A concise, curated set of 3â€“5 technology badges.                                                                                                                    | Gives fast relevance signal; it must not become a full skills inventory.                          |
| 7        | Availability/context       | A short factual status, such as Open to frontend opportunities or Available for collaboration, only when current.                                                     | Optional supporting context. It must never displace the two proof-oriented actions.               |
| 8        | Profile image              | Professional avatar/headshot, optional when a strong current image exists.                                                                                            | Optional human context; it must never displace name, role, technology focus, or actions.          |

**Not included in the Hero:** social/professional links, detailed biography, experience history, technology proficiency percentages, resume download, project cards, metrics, testimonials, animated decorations, or a contact form. Social links belong in the shared footer, About, and Contact pathways. All other content belongs to later Home sections or future scope.

---

## 4.5 Dependencies

### Required Features

- Public Navbar
- Theme Toggle
- Design System
- Profile Data Provider
- Technology Data Provider

### Required Components

- Button
- Badge
- Avatar
- Container
- Section

### Required Layouts

- Public Layout

### Independent Of

- Authentication
- Dashboard
- Project CRUD
- AI Workflow Page


## 5. Data Requirements

This specification defines content inputs, not a database schema.

| Field                   | Required    | Use / validation expectation                                                                                                    |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | Yes         | Portfolio ownerâ€™s full professional name.                                                                                     |
| `role`                  | Yes         | Concise role, such as Frontend Developer or Software Engineer.                                                                  |
| `headline`              | Yes         | One-sentence positioning statement; concise enough to scan.                                                                     |
| `supportingDescription` | Yes         | Short evidence-oriented explanation of the portfolioâ€™s content.                                                               |
| `primaryCtaLabel`       | Yes         | Default: `Explore Projects`.                                                                                                    |
| `primaryCtaHref`        | Yes         | Default: `/projects`.                                                                                                           |
| `secondaryCtaLabel`     | Yes         | Default: `View AI Workflow`.                                                                                                    |
| `secondaryCtaHref`      | Yes         | Default: `/ai-workflow`.                                                                                                        |
| `technologyHighlights`  | Yes         | Curated list of 3â€“5 reusable Technology entities; display name and canonical internal reference are needed.                   |
| `availabilityText`      | No          | Current, date-reviewed availability/context statement; omitted if empty or outdated.                                            |
| `avatarUrl`             | No          | Optimized profile image source.                                                                                                 |
| `avatarAlt`             | Conditional | Required when the image conveys identity; empty only when the image is strictly decorative and adjacent text supplies identity. |
| `githubUrl`             | Yes         | Public professional GitHub destination.                                                                                         |
| `linkedinUrl`           | Yes         | Public professional LinkedIn destination.                                                                                       |

| `profileLastReviewedAt` | Recommended | Internal content-governance datum used to identify stale availability/headline information; not displayed in the Hero. |

No counter or availability indicator should render from a missing or invalid value.

---

## 5.5 Data Sources

### MVP

All Hero data comes from the mock Profile Service.

Example:

profileService.getProfile()

technologyService.getFeaturedTechnologies()

### Future

The services will read from MongoDB.

The Hero component must never know where the data originates.

It only consumes the service.

## 6. Component Tree

```
HeroSection
|-- HeroContent
|   |-- StatusBadge (existing Badge; conditional and subordinate)
|   |-- IdentityBlock
|   |   |-- Page heading: name
|   |   `-- Role
|   |-- PositioningBlock
|   |   |-- Headline
|   |   `-- Supporting description
|   |-- TechnologyHighlights
|   |   `-- Badge collection (existing Badge)
|   `-- HeroActions
|       |-- Primary action (existing Button)
|       `-- Secondary action (existing Button)
`-- HeroProfile
    `-- Avatar (existing Avatar; conditional)
```

`HeroSection`, `HeroContent`, `IdentityBlock`, and `HeroActions` are semantic page compositions, not new design-system primitives. Reuse the existing `Badge`, `Button`, `Avatar`, and design tokens. The Hero needs no custom card, illustration, statistic tile, decorative background, social-link cluster, or component variant.

---

## 7. User Interactions

| Interaction                | Expected behavior                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Pointer hover on CTA       | Uses the existing `Button` hover treatment only; no Hero-specific animation or color change.                                        |
| Keyboard focus on CTA/link | Uses the global visible focus ring from the design system; focus order follows visual/document order.                               |
| Primary CTA click/tap      | Navigates to `/projects`. It is an internal navigation and must preserve normal browser navigation behavior.                        |
| Secondary CTA click/tap    | Navigates to `/ai-workflow`.                                                                                                        |
| Availability status        | Informational only; it is not clickable or interactive.                                                                             |
| Avatar                     | Informational only; it is not clickable unless a future explicit profile action is introduced.                                      |
| Mobile navigation          | The Hero does not own navigation; the shared `Navbar` mobile menu remains available above it and must retain proper focus behavior. |
| Touch                      | CTAs meet usable touch-target size through existing component sizing; no hover-only essential content.                              |

Do not add parallax, auto-rotating technology labels, typewriter effects, cursor effects, scroll-jacking, or animated counters. They do not improve recruiter evaluation and could diminish performance or accessibility.

---

## 7.5 Rendering Strategy

Rendering Type

Server Component

Reason

The Hero contains mostly static public information.

Rendering on the server improves:

- SEO
- Performance
- First Contentful Paint

Interactive Elements

- Theme Toggle
- Navigation
- CTA Buttons

These remain client-side where necessary.

No client-side data fetching is required for the Hero.

## 8. Responsive Behaviour

### Desktop

- Use the established centered content width and generous vertical breathing room.
- Present content and optional profile image in a two-column composition when the profile image is available.
- The identity, headline, supporting description, technologies, and actions remain the dominant column; the avatar is supporting evidence.
- Keep action buttons on one row when width allows. Availability, when present, remains visually subordinate to the actions.

### Tablet

- Retain a two-column composition only when both columns keep readable line lengths and the image does not compress primary content.
- Otherwise stack the profile image after the content without changing semantic reading order.
- Technology badges may wrap across lines; buttons may wrap to a clear vertical sequence without changing priority.

### Mobile

- Use one column with identity and positioning first, then technology highlights, actions, and professional links.
- Place optional avatar after the primary actions or omit it from the initial viewport if it would displace the core proof path; do not reorder the page heading after it.
- Primary and secondary CTAs stack or expand to available width when needed, preserving clear hierarchy.
- Use compact but readable badge wrapping; do not create horizontal scrolling for technologies.
- Preserve sufficient space between the `Navbar` and Hero heading so the sticky header never obscures the beginning of content.

The same data and action set is present across breakpoints. Responsive behavior only changes layout density and positioning.

---

## 8.5 Performance Considerations

- Use next/image for avatar.
- Optimize image sizes.
- No unnecessary JavaScript.
- No expensive animations.
- Avoid client-side rendering.
- Lazy-load only non-critical assets.
- Hero content should be available immediately.

## 9. Accessibility

### Keyboard

- Every actionable CTA is reachable in a predictable top-to-bottom order.
- Focus indicators use existing design-system focus styles and maintain contrast in both themes.
- No keyboard interaction is required for noninteractive avatar, availability, or technology labels.

### Semantics and ARIA

- The ownerâ€™s name is the single page-level `h1` on Home; role is supporting text, not another page-level heading.
- The Hero is a labelled page section only if needed to distinguish it from other landmark content; do not add redundant ARIA roles to native semantic elements.
- CTA labels communicate destination and purpose.

### Text alternatives

- An identity-bearing headshot uses `avatarAlt` such as â€œPortrait of [name].â€
- Decorative visual content, if any is ever approved, uses empty alt text and is absent from the accessibility tree.

### Visual accessibility

- Use existing foreground, muted-foreground, accent, border, and background tokens only, ensuring the design systemâ€™s contrast rules carry into dark and light modes.
- Availability cannot rely on a green dot or color alone; its text must express the status.
- Technology badges do not communicate essential meaning solely through color or logos.

### Motion and zoom

- The Hero requires no essential animation. Any optional transition obeys `prefers-reduced-motion` via the existing global approach.
- Content remains readable and functional at browser zoom and large text settings; text must wrap rather than overlap the avatar or action area.

---



## 9.5 SEO Considerations

The Hero contributes to:

- Home Page Title
- Meta Description
- Open Graph Description
- Structured Data (Person)

Requirements

- Single H1
- Semantic HTML
- Proper heading hierarchy
- Accessible links
- Descriptive image alt text

## 10. States

| State                         | Required behavior                                                                                                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading                       | Reserve the Heroâ€™s content structure using restrained text/image placeholders; retain the site header and avoid layout shift. CTA destinations must not become misleading before their labels/data are ready.                        |
| Complete                      | Render identity, positioning, curated technologies, and primary/secondary CTAs. Render availability/avatar only when valid data exists.                                                                                                |
| Partial / empty optional data | Omit missing availability or avatar without leaving an empty slot. If no technologies are available, replace the badge collection with a concise text fallback only when an approved specialization summary exists; otherwise omit it. |
| Required-content error        | If profile content cannot load, show a concise error state in the Hero area with a retry action where supported and a visible route to Projects/Contact. Do not show placeholder claims or broken calls to action.                     |
| Success                       | No form success state applies. Successful action means navigation to Projects, AI Workflow, or Contact.                                                                                                                                |

The Hero must not ship with static placeholder identity, fabricated availability, â€œcoming soonâ€ technologies, or broken external links.

---

## 11. Acceptance Criteria

- [ ] The Hero appears at the beginning of Home beneath the shared `Navbar` and before About content.
- [ ] It uses only existing design-system tokens, typography, spacing, controls, and approved shared compositions.
- [ ] It identifies the owner by name and role in the first visible content group.
- [ ] It includes one concise positioning headline and a short evidence-oriented supporting description.
- [ ] `Explore Projects` is the visually primary action and links to `/projects`.
- [ ] `View AI Workflow` is the secondary action and links to `/ai-workflow`.
- [ ] It displays a curated set of 3â€“5 technology highlights when configured; it does not present a complete skills inventory or proficiency meter.
- [ ] Availability appears only when a current, validated text value is provided.
- [ ] Avatar rendering is optional and never blocks or displaces essential identity/action content.
- [ ] The Hero contains no social/profile link cluster; GitHub and LinkedIn remain available through the footer, About, and Contact pathways.
- [ ] The Hero supports dark mode and light mode with no page-specific color overrides.
- [ ] At desktop width, the Hero has a readable content-first composition; at tablet and mobile widths, it adapts without horizontal scroll, clipped text, or lost actions.
- [ ] All interactive items are keyboard reachable, show the existing visible focus treatment, and have usable touch targets.
- [ ] The page contains only one `h1`, and it represents the portfolio ownerâ€™s name.
- [ ] Avatar alternatives, status text, external-link semantics, contrast, and reduced-motion behavior meet the requirements in this specification.
- [ ] Loading, optional-content-empty, and profile-load-error states are defined and do not create broken navigation or misleading claims.
- [ ] No Hero-specific animated effects, visual styles, redundant components, backend logic, or business logic are introduced.

---


## 11.5 Testing Strategy

Unit Testing

- Correct rendering
- CTA links
- Conditional rendering

Accessibility

- Keyboard navigation
- Screen reader
- Focus visibility

Responsive

Desktop

Tablet

Mobile

Manual

- Dark Mode
- Light Mode
- Different viewport sizes

Performance

- Lighthouse
- Core Web Vitals

## 12. Future Enhancements

- Add a resume download/link only if it supports a demonstrated recruiter workflow and the document is actively maintained.
- Add a concise current-location or timezone field only if it matters to target roles.
- Add a verified availability date or hiring preference metadata once there is a clear maintenance process.
- Test alternative positioning copy using privacy-conscious analytics after there is sufficient traffic; retain one clear default in the MVP.
- Add a small â€œrecently updatedâ€ signal only if project freshness is reliably tracked and useful to visitors.
- Add a verified social/profile destination beyond GitHub and LinkedIn only when it contributes substantive professional evidence.
- Add an optional visual project/architecture artifact only if it reinforces the technical documentation focus without competing with the primary content hierarchy.

_End of Hero Feature Engineering Specification._
