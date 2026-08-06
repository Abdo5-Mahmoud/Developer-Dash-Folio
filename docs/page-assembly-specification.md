# Core Page Assembly Specification

## Devfolio AI — UI Composition Blueprint

**Inputs:** `prd.md`, `information-architecture.md`, existing Design System and reusable UI components  
**Scope:** Home, Project Detail, Admin Create Project, AI Development Workflow  
**Status:** Ready for frontend implementation

---

## Assembly rules

- Retain the existing neutral grayscale, single-blue-accent system, dark-first theme, typography, spacing, radius, and elevation tokens. No new visual language is needed.
- Compose from the established primitives: `Navbar`, `ThemeToggle`, `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Label`, `Separator`, `Tabs`, `Callout`, `CodeBlock`, `Breadcrumbs`, `SidebarNav`, and `TableOfContents`.
- Every public page uses the same `Navbar` and a shared footer. The dashboard has a separate, persistent admin shell.
- Content remains data-driven. Do not hard-code section availability: hide optional project sections when their content is absent and use explicit empty/error/loading states while data is unavailable.
- Responsive behavior follows progressive disclosure: full navigation and sidebars at desktop widths; compact controls and stacked content on smaller screens.
- Light mode must use existing theme tokens only. No page-specific dark/light color values.

## Shared composition decisions

| Need | Reuse / minimal addition | Rationale |
|---|---|---|
| Public desktop header | Existing `Navbar` | Already supplies brand, links, sticky behavior, and `ThemeToggle`. |
| Public mobile navigation | Extend `Navbar` with a compact menu control | Required because the current navigation links intentionally disappear below `md`; this is a behavior extension, not a new style system. |
| Public footer | `SiteFooter` (new shared composite) | Required by the Home brief and should be identical across public pages. |
| Project in-page navigation | Existing `TableOfContents` and `Breadcrumbs` | Matches documentation-first content and existing visual language. |
| Workflow expansion | `Disclosure` (new shared primitive/composite) | Required for accessible expandable timeline steps; use it rather than inventing a bespoke accordion on the page. |
| Dashboard frame | `AdminShell` (new layout composite) using existing `SidebarNav`, `Navbar` patterns, `Button`, and `ThemeToggle` | Required to keep all future dashboard pages consistent. |
| Multi-step project form | `FormStepNavigator` (new narrowly-scoped composite) | Required by the brief. It owns only current-step navigation and completion/error state; fields continue using existing primitives. |
| Status / feedback | Existing `Badge`, `Callout`, `Button` loading state | Covers draft/published, validation, recoverable errors, and feedback without new treatments. |

The minimal additions above are reusable behavior/layout composites, not new visual styles. No additional card, badge, button, input, modal, or typography variants are required for this phase.

---

## 1. Home — `/`

### Page purpose

Give a recruiter or engineering reviewer an immediate understanding of the developer’s value, relevant skills, strongest projects, disciplined AI workflow, and contact path. The page must create a credible route to a project detail within one interaction.

### Component tree

```
HomePage
├── Navbar (existing; mobile menu extension)
├── Main
│   ├── HeroSection
│   │   ├── Badge
│   │   └── Button links to Projects and Contact
│   ├── AboutSection
│   │   ├── Avatar (optional profile image)
│   │   └── Button link to About
│   ├── SkillsSection
│   │   └── Badge collection
│   ├── FeaturedProjectsSection
│   │   ├── LoadingState / ErrorState / EmptyState
│   │   └── ProjectCard collection (Card + Badge + Button)
│   ├── WorkflowPreviewSection
│   │   ├── Callout
│   │   └── Button link to AI Workflow
│   └── ContactSection
│       ├── Button mail/contact link
│       └── External profile links
└── SiteFooter (new shared composite)
```

### Layout description

Use a single centered content column (`max-w-6xl`, as established by `Navbar` and Showcase) with consistent vertical section rhythm. The hero is a two-column composition only when sufficient width exists: primary narrative and primary actions first, concise professional evidence second. It collapses to a single content order on smaller screens.

About is a short credibility bridge, not a duplicate About page. Skills are grouped by their existing entity category and presented as compact labels, not proficiency visualizations. Featured projects use the existing `Card` family in a responsive grid; each card has a cover image, title, concise summary, technology badges, and one clear “View case study” action. The AI preview is a compact documentation-oriented prompt: it previews the review discipline and routes to the full process rather than attempting to reproduce it. Contact is an action-oriented close with direct channels and a route to the contact page.

### Reused components

`Navbar`, `ThemeToggle`, `Badge`, `Card` and its subcomponents, `Button`, `Avatar`, `Callout`, `Separator`.

### New components

`SiteFooter` is required because the PRD calls for stable footer navigation across public pages. `ProjectCard` is a page-domain composition of existing `Card`, `Badge`, and `Button`, and must be reused by Home and Projects Listing rather than duplicated. No new visual primitive is needed.

### Expected user interactions

- Navigate to Projects, AI Workflow, About, Contact, or toggle theme.
- Open any featured project; external GitHub/demo links belong on the detail page, not the featured card.
- Open the full About or AI Workflow page.
- Use direct contact or external professional links.
- On mobile, open/close the navigation menu and keep keyboard focus contained while it is open.

### Responsive behavior

- Desktop: hero may use two columns; featured cards show up to three columns when width permits.
- Tablet: hero stacks as needed; cards reduce to two columns.
- Mobile: one content column; all cards full width; primary action buttons remain comfortably tappable; navigation moves into the compact menu.
- Images retain an intentional fixed aspect ratio and use meaningful alt text; they never determine the page’s layout width.

### Accessibility notes

- Exactly one page-level `h1`; sections follow logical heading order.
- The hero actions state their destination clearly; external links are identified accessibly.
- Project card action labels include the project title in accessible text.
- Profile/cover images have contextual alt text; decorative images use empty alt text.
- Loading, empty, and error states announce status without replacing navigation or hiding the contact path.

### Future improvements

- Replace static highlights with measured “recently updated” evidence only when content freshness data is reliable.
- Add a concise downloadable resume link when the owner wants that workflow; do not add it by default.
- Consider a testimonial/reference section only with credible source material.

---

## 2. Project Detail — `/projects/[slug]`

### Page purpose

Act as a complete engineering case study. It must let a recruiter skim outcome and relevance, then let technical reviewers inspect implementation reasoning, AI supervision, and external proof without making any one audience read irrelevant depth.

### Component tree

```
ProjectDetailPage
├── Navbar
├── Main
│   ├── Breadcrumbs
│   ├── ProjectHero
│   │   ├── Badge collection (status / technologies)
│   │   ├── Button links (GitHub, Live Demo when present)
│   │   └── Cover image
│   ├── DocumentationLayout
│   │   ├── SidebarNav (desktop section groups)
│   │   ├── CaseStudyContent
│   │   │   ├── OverviewSection
│   │   │   ├── ProblemSection
│   │   │   ├── SolutionSection
│   │   │   ├── ArchitectureSection
│   │   │   ├── FolderStructureSection (CodeBlock)
│   │   │   ├── DataFlowSection
│   │   │   ├── TechStackSection (Badge collection)
│   │   │   ├── ReactPatternsSection
│   │   │   ├── AlgorithmsSection
│   │   │   ├── EngineeringDecisionsSection
│   │   │   ├── PerformanceSection
│   │   │   ├── ChallengesSection
│   │   │   ├── LessonsLearnedSection
│   │   │   ├── AIDevelopmentProcessSection
│   │   │   │   ├── CodeBlock (prompts)
│   │   │   │   └── Callout (AI mistakes / corrections)
│   │   │   ├── GallerySection
│   │   │   └── ProjectLinksSection
│   │   └── TableOfContents (desktop)
│   └── ProjectPager (previous / next)
├── SiteFooter
└── State boundary
    ├── LoadingState
    ├── NotFoundState
    └── RecoverableErrorState
```

### Layout description

The project hero establishes title, summary, project context, technologies, cover image, and external proof links. It is followed by a documentation layout: the reading column is primary, with contextual section navigation on desktop and an on-page contents control on mobile/tablet. Keep section content in the PRD’s deliberate order: narrative first (overview/problem/solution), structural evidence next (architecture/folder/data flow), implementation decisions after, then AI process and visual proof.

Every section is conditional on populated content, except Overview which is required for published projects. Do not create blank headings or placeholders on a public project. Structured collections use repeated documented entries, not a separate generic visual pattern: Decision entries can use `Card`; caveats/results use `Callout`; source-like evidence uses `CodeBlock`; technologies use `Badge`. The gallery is a content collection with an explicit empty state only in authenticated preview/editor contexts; it is omitted on the public page when no images exist.

Place GitHub and Live Demo links in the hero and repeat them after the technical evidence only when present. Previous/next navigation follows public catalog order; optional related projects can be added between the case study and pager once there are enough published records.

### Reused components

`Navbar`, `Breadcrumbs`, `SidebarNav`, `TableOfContents`, `Badge`, `Button`, `Card`, `Callout`, `CodeBlock`, `Separator`, `SiteFooter`.

### New components

`ProjectHero`, `ProjectCard`, and `ProjectPager` are domain compositions built once and reused. `DocumentationLayout` is layout composition rather than a visual component. A dedicated gallery primitive is not needed: use semantic figure/figure-caption markup with existing spacing and image token behavior. No visual style departure is justified.

### Expected user interactions

- Return to Projects through breadcrumbs; navigate directly to a populated technical section.
- Open GitHub, live demo, and gallery images when provided.
- Copy a documented AI prompt or folder structure from `CodeBlock`.
- Open the previous/next project; preserve prior project-list filter context only in a “Back to projects” link.
- Recover from a missing project with a route back to Projects; never disclose whether a missing slug is a draft.

### Responsive behavior

- Desktop: reading column remains readable; left section navigation and right table of contents appear only where width permits.
- Tablet: retain the content column and a compact in-page contents control; remove persistent side rails.
- Mobile: hero stacks, actions wrap without truncation, long code blocks scroll horizontally within their own container, and gallery items become one column.
- The document order is identical on all sizes; side navigation is supplementary, never the only route to content.

### Accessibility notes

- `Breadcrumbs` uses a navigation landmark and marks the current project correctly.
- Each populated section has a unique `id`, logical heading, and targetable anchor.
- Code blocks identify their language/file label and keep copy feedback programmatically available.
- Screenshots use meaningful captions/alt text; gallery controls, if implemented, use fully labelled buttons and do not trap keyboard focus.
- External links make the destination clear; do not rely on an icon alone.
- Error and not-found states retain document landmarks and a safe route back to public content.

### Future improvements

- Related projects based on shared technologies/skills when at least three useful relationships exist.
- Optional downloadable architecture diagram/source attachment if it adds evidence beyond the written content.
- Per-section share links only after there is a proven sharing need; anchors already cover direct technical references.

---

## 3. Admin Create Project — `/dashboard/projects/new`

### Page purpose

Let the single administrator capture a project as structured engineering documentation, save incomplete work safely, validate publication readiness, and inspect a non-publishing preview. It should optimize for completeness and speed, not imitate a general-purpose CMS.

### Component tree

```
CreateProjectPage
├── AdminShell
│   ├── AdminSidebar (SidebarNav)
│   ├── AdminTopNavigation
│   │   ├── Breadcrumbs
│   │   ├── ThemeToggle
│   │   ├── View Site action
│   │   └── Account / Sign out control
│   └── Main
│       ├── PageHeader
│       │   ├── Save Draft button
│       │   ├── Live Preview button
│       │   └── Publish button
│       ├── FormStepNavigator
│       ├── ProjectForm
│       │   ├── BasicInformationStep
│       │   │   ├── Input fields
│       │   │   └── Publish status (Badge / control)
│       │   ├── DescriptionAndSEOStep
│       │   │   └── Textarea fields
│       │   ├── MediaStep
│       │   │   ├── CoverImageField
│       │   │   └── GalleryField
│       │   ├── TechnologyAndStructureStep
│       │   │   ├── TechStack field
│       │   │   └── FolderStructure field (CodeBlock-style editor affordance)
│       │   ├── ArchitectureAndImplementationStep
│       │   │   ├── Architecture Notes
│       │   │   ├── React Patterns
│       │   │   ├── Algorithms
│       │   │   └── Engineering Decisions
│       │   └── LearningsAndReviewStep
│       │       ├── Challenges
│       │       ├── Lessons Learned
│       │       ├── AI process evidence
│       │       └── Publish readiness summary (Callout)
│       └── Form feedback
│           ├── Inline field errors
│           ├── Saving state
│           ├── Recoverable error state
│           └── Empty prerequisite states
└── Optional PreviewPanel / preview route
```

### Layout description

The dashboard shell provides one stable administrative context. The new-project page is a structured sequential form with a persistent action area: Save Draft is always available, Publish is available only after validation, and Live Preview is clearly non-publishing. Steps organize related fields; they do not hide required errors. The default progression is:

1. Basic Information — title, slug, summary, status.
2. Description & SEO — full description and page metadata.
3. Media — cover image, gallery, captions/alt text.
4. Technology & Structure — technologies/skills and folder structure.
5. Architecture & Implementation — architecture, data flow, patterns, algorithms, decisions, performance.
6. Learnings & Review — challenges, lessons, AI prompts/mistakes, publication readiness.

Use cards only to group distinct form concerns within a step; do not wrap every individual field in a card. Use existing labels, inputs, textareas, badges, callouts, separators, and buttons. Reorderable structured entries (patterns, decisions, challenges, AI evidence) are repeated form groups with add/remove/reorder actions; they share one interaction pattern across the editor. The page requires no new styling for a rich text engine or uploader—those are future implementation integrations and should inherit existing field and feedback styles.

### Reused components

`SidebarNav`, `Breadcrumbs`, `ThemeToggle`, `Button` including loading state, `Card`, `Input`, `Textarea`, `Label`, `Badge`, `Callout`, `CodeBlock`, `Separator`, `Tooltip`.

### New components

`AdminShell` and `FormStepNavigator` are necessary shared composites. `StructuredEntryList` is necessary only if it is used consistently for every repeatable project field; it must compose existing inputs, buttons, and cards rather than introduce its own style. `MediaField` is a form-domain composition required by both create and edit project flows. The Create page should be the same editor composition later used by Edit Project.

### Expected user interactions

- Move between steps without losing entered values; view step completion and blocking validation errors.
- Enter/edit metadata, choose technologies/skills, add structured entries, and arrange their order.
- Select or upload cover/gallery images; enter required alt text/captions; remove an uncommitted selection.
- Save as draft at any time; see saving, saved, and recoverable failure feedback.
- Open Live Preview without changing publication state.
- Publish after all mandatory checks pass; receive a clear completion result and public-link action.
- Navigate to Skills, Technologies, or Media only when a prerequisite is absent, then return to the draft without data loss.

### Responsive behavior

- Desktop: persistent sidebar, compact top navigation, form content has a readable maximum width, actions remain available at the top and after long steps.
- Tablet: sidebar collapses to an accessible menu; step navigation is horizontally scrollable or collapsible without cutting labels.
- Mobile: one-column form, field groups stack, action order is Save Draft then Preview then Publish, and no critical action relies on hover or a sticky element that obscures fields.
- The admin experience is desktop-optimized but remains fully operable with touch and keyboard at all widths.

### Accessibility notes

- Use a real form with grouped fields (`fieldset`/`legend` where applicable) and visible associated labels.
- Step navigation communicates current step, completion, and error state in text—not color alone.
- Validation messages are tied to their fields and announced when they change; publish readiness describes every blocking field.
- Upload controls are keyboard-operable and expose accepted files, current selection, replace/remove actions, and alt-text requirements.
- Save/preview/publish button state is clear to assistive technology, including loading and disabled reasons.
- Do not rely on drag-and-drop as the only way to add media or reorder entries.

### Future improvements

- Autosave and restore after interruption, after explicit draft saving is stable.
- Side-by-side preview only if it remains usable at desktop widths; otherwise prefer a dedicated preview route/panel.
- Project revision history, scheduled publish, and multi-user review are explicitly post-MVP.

---

## 4. AI Development Workflow — `/ai-workflow`

### Page purpose

Demonstrate a repeatable, critically supervised AI-assisted engineering method. The page explains the owner’s approach across projects; it does not replace the project-specific prompts, mistakes, and decisions in each case study.

### Component tree

```
AIWorkflowPage
├── Navbar
├── Main
│   ├── Breadcrumbs (optional; only when beneficial from project context)
│   ├── WorkflowHero
│   │   ├── Badge
│   │   ├── Introductory narrative
│   │   └── Button links to Projects
│   ├── WorkflowPrinciples (Callout collection)
│   ├── VerticalWorkflowTimeline
│   │   ├── WorkflowStepDisclosure: Requirements
│   │   ├── WorkflowStepDisclosure: Planning
│   │   ├── WorkflowStepDisclosure: Wireframes
│   │   ├── WorkflowStepDisclosure: Design
│   │   ├── WorkflowStepDisclosure: Architecture
│   │   ├── WorkflowStepDisclosure: AI Coding
│   │   ├── WorkflowStepDisclosure: Manual Review
│   │   ├── WorkflowStepDisclosure: Refactoring
│   │   ├── WorkflowStepDisclosure: Testing
│   │   └── WorkflowStepDisclosure: Deployment
│   ├── EvidenceLinksSection
│   │   └── ProjectCard collection (when examples exist)
│   └── Contact CTA
└── SiteFooter
```

### Layout description

This is a documentation page, not a marketing timeline. The hero states the engineering premise: AI accelerates exploration and execution, while human review owns correctness, trade-offs, quality, and delivery. A small principles area establishes those rules before the timeline.

The vertical timeline is the primary structure. Each step has a short visible title and goal; it expands using the shared `Disclosure` component. Expanded content follows the same order in every step: Goal, Prompt, AI Output Summary, Manual Improvements, Engineering Notes, Lessons Learned. Use `CodeBlock` for prompts; use `Callout` for cautions, corrections, and consequential outcomes; use plain structured text for the rest. Do not make all ten steps expanded by default—the overview must remain skimmable. A single expanded step is the default, with optional multi-expand behavior only if it is easier to scan without excess page movement.

Finish with links to projects that substantiate the workflow. If examples are unavailable, omit the section and retain the Projects CTA; do not show invented evidence.

### Reused components

`Navbar`, `ThemeToggle`, `Badge`, `Button`, `Callout`, `CodeBlock`, `Card` (only for project evidence), `Separator`, `SiteFooter`.

### New components

`Disclosure` is necessary to meet the expandable-step requirement accessibly and can serve other documentation content later. `VerticalWorkflowTimeline` and `WorkflowStepDisclosure` are domain compositions: they use existing typography, borders, tokens, and `Disclosure`; they do not introduce a separate timeline style family.

### Expected user interactions

- Open and close individual workflow steps using pointer, keyboard, or touch.
- Copy an illustrative prompt from a code block.
- Follow an evidence project to see concrete per-project prompts, corrections, and decisions.
- Navigate to Projects or Contact; toggle theme and use mobile navigation.
- Encounter a loading state while workflow content/example projects load, an error state with retry/fallback, or a concise empty state when no project examples are configured.

### Responsive behavior

- Desktop: maintain a readable timeline column with a restrained visual connector; expanded content aligns to the same content edge.
- Tablet/mobile: keep one vertical sequence; reduce secondary spacing but never compress the step title or disclosure target below usable touch size.
- Code blocks scroll within themselves; prompt content never forces horizontal page scrolling.
- There is no horizontal timeline or carousel because it impairs reading and keyboard navigation.

### Accessibility notes

- Each disclosure trigger is a real button with `aria-expanded` and a controlled region relationship.
- The timeline conveys order in document order even if decorative connectors are not perceived.
- Step names and headings remain meaningful when read out of visual context.
- Prompt code has an accessible title; lessons/corrections are expressed as text and not by color/icon alone.
- Respect reduced motion; opening a step should not require animation to understand the changed state.

### Future improvements

- Filter timeline evidence by project only after multiple projects have comparable documented AI process data.
- Add anonymized links to real design/architecture artifacts when they strengthen credibility and can be shared safely.
- Add workflow revision/date metadata once the author is actively evolving the documented process.

---

## Cross-page state requirements

| State | Home | Project Detail | Create Project | AI Workflow |
|---|---|---|---|---|
| Loading | Skeleton structure for featured projects; preserve heading/CTA. | Preserve document frame; use section-level loading only where content streams independently. | Keep form unavailable until prerequisites load; show field-sized loading state, not an empty form. | Preserve intro and show timeline-step placeholders. |
| Empty | Explain there are no featured projects and route to Projects. | Omit optional sections; missing slug uses Not Found. | Explain missing technologies/media and provide a route to manage them. | Omit absent evidence projects; retain methodology content and Projects CTA. |
| Error | Explain failed content retrieval with retry and Projects route. | Recoverable retrieval error with retry and Projects route; no draft disclosure. | Preserve entered values and describe the failed save/publish action with retry. | Recoverable content error with retry and Projects route. |
| Success feedback | No transient feedback required for navigation. | Copy and external-link feedback when relevant. | Visible saved/draft/published confirmation, followed by public-link action after publish. | Copy feedback for prompts only. |

## Implementation guardrails for the next phase

1. Build shared public layout (`Navbar` with mobile behavior + `SiteFooter`) before individual pages.
2. Build the project case-study section composition once; map data fields to it rather than scattering field-specific markup through the route.
3. Build `AdminShell`, `FormStepNavigator`, media field, and structured-entry behavior once; Create and Edit must reuse the same project editor.
4. Build the accessible `Disclosure` before the workflow page. Do not use `Tabs` for the vertical workflow: hidden tab panels would make the timeline semantics and long-form reading worse.
5. Preserve the design-system showcase as the visual source of truth; any required refinement must happen there and apply to all uses.

*End of specification.*
