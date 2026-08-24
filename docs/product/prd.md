# Product Requirements Document

## Devfolio AI — Developer Portfolio & Engineering Knowledge Base

**Document owner:** Product/Architecture
**Status:** Draft v1.0
**Last updated:** August 2026

---

## 1. Product Vision

Most developer portfolios are galleries: a screenshot, a one-line description, a GitHub link. They answer "what did you build" but not "how do you think." Devfolio AI is a portfolio that functions as an **engineering knowledge base** — for every project, it exposes the reasoning behind the code: architecture decisions, trade-offs, data flow, algorithms, performance work, and — distinctively — the AI-assisted development process itself, including the prompts used and the mistakes AI made that the developer had to catch and correct.

The product treats "how I used AI as a collaborator, and where I overrode it" as a first-class, evaluable skill, on par with "what patterns I used" or "what algorithm I chose." The site should read less like a resume and more like a well-documented internal engineering wiki that happens to be public.

**Positioning statement:** For hiring managers, tech leads, and senior engineers evaluating a candidate's real engineering judgment, Devfolio AI is a portfolio-as-documentation-system that proves depth of thinking, not just shipped output — unlike typical portfolios, which show final artifacts without the reasoning that produced them.

---

## 2. Goals

### Business / career goals
- Convert portfolio visits into interview requests by making engineering judgment legible in under 2 minutes per project.
- Differentiate the owner from candidates who used AI tools opaquely, by demonstrating deliberate, critically-supervised AI usage.
- Serve as a living document the owner updates after every project instead of rewriting a portfolio from scratch each job cycle.

### Product goals
- Every project must answer, without the visitor needing to ask: *what was built, why it was built this way, what was hard, what AI got wrong, and what was learned.*
- Admin-side content management must be fast enough that documenting a project takes minutes, not hours — otherwise the "knowledge base" habit dies.
- The system must scale from 3 projects to 30+ without a redesign (skills/technologies as reusable, taggable entities, not free text repeated per project).

### Explicit non-goals (v1)
- Not a blogging platform / CMS for long-form articles unrelated to projects.
- Not a multi-author or team platform — single admin user.
- Not a real-time collaboration tool.
- Not attempting analytics/BI beyond basic visit counts.

---

## 3. Target Users

| User type | What they want | Where they land |
|---|---|---|
| **Recruiters (non-technical)** | Fast signal: is this person legit, what have they shipped, can I forward this | Home → Projects (cards) |
| **Hiring managers / tech leads** | Evidence of architectural thinking, trade-off reasoning, code quality | Project Details → Architecture / Decisions |
| **Senior engineers (peer review, referrals)** | Depth: patterns, algorithms, performance, whether AI use was rigorous or careless | Project Details → full technical sections, AI Workflow page |
| **The owner (admin)** | A low-friction way to document a project once and have it presented well forever | Admin Dashboard |

---

## 4. User Personas

**1. Priya — Technical Recruiter**
Screens 40+ profiles a week. Spends ~90 seconds per portfolio. Needs an immediate, scannable answer to "what tech, what role, is this credible." Bounces if she has to dig. Primary path: Home hero → Projects grid → maybe one Project Detail skim.

**2. Marcus — Engineering Manager**
Has 15 minutes before an interview to form questions to ask. Wants to see one project in depth: the architecture, why certain decisions were made over alternatives, and what went wrong. Uses Project Detail heavily; will open the GitHub repo if the write-up is credible. Skeptical of AI-generated portfolios — looks for signs of real judgment, not polish.

**3. Sofia — Senior Engineer, potential peer/referrer**
Cares about code taste: patterns used, why, algorithmic choices, performance reasoning. Will read the "AI mistakes" section specifically to judge whether the candidate can catch bad AI output — this is often the deciding signal for her. Reads AI Workflow page in full.

**4. The Owner — Admin/Author**
A working developer, not a full-time content creator. Wants to document a project in one sitting right after finishing it, while the decisions are still fresh, without fighting a clunky CMS. Needs structured fields (not blank canvases) so nothing important is forgotten.

---

## 5. Core Features

### Public Website
1. **Home** — value proposition, featured projects, skill/tech summary, entry points to Projects and AI Workflow.
2. **Projects (listing)** — filterable/sortable grid of all projects with summary-level info.
3. **Project Details** — the core content unit; full structured write-up per project (see data model in Section 6).
4. **AI Workflow** — a dedicated, cross-project page explaining the owner's general AI-assisted development methodology (tools used, review process, philosophy), distinct from per-project AI prompts/mistakes.
5. **About** — bio, skills summary, experience narrative.
6. **Contact** — contact form and/or direct links (email, LinkedIn, GitHub).

### Admin Dashboard
1. **Login** — single-admin authentication.
2. **Dashboard (overview)** — project list, quick stats, quick actions.
3. **Create Project** — structured multi-section form covering all project fields.
4. **Edit Project** — same form, pre-filled, with save/draft/publish states.
5. **Manage Skills** — CRUD for skill entities (reusable, taggable, used in About + filters).
6. **Manage Technologies** — CRUD for tech-stack entities (reusable, taggable, used in Project filters, includes icon/logo reference).
7. **Upload Images** — cover image + gallery image upload/management, reusable across a project.

---

## 6. Functional Requirements

### 6.1 Project Data Model
Every project record stores the following fields. Fields marked **(rich text)** support formatted long-form content (headings, code blocks, lists); fields marked **(structured list)** are repeatable structured entries, not a single blob.

| Field | Type | Notes |
|---|---|---|
| Title | short text | required |
| Slug | short text | auto-generated from title, editable, used in URL |
| Summary | short text (~1–2 sentences) | shown on cards, listing, home |
| Full description | rich text | shown on detail page, the narrative overview |
| Status | enum: Draft / Published | drafts are admin-only visible |
| Cover image | image | required for listing/cards |
| Gallery | structured list of images | optional, each with caption |
| GitHub repository URL | URL | optional (some projects may be private) |
| Live demo URL | URL | optional |
| Tech stack | structured list, references Technologies entity | required, min 1 |
| Related skills | structured list, references Skills entity | optional, used for site-wide filtering |
| Folder structure | rich text / code block | monospace, tree-style representation |
| Architecture explanation | rich text | narrative + may embed a diagram image |
| Data flow | rich text | narrative + may embed a diagram image |
| React patterns used | structured list (pattern name + short rationale) | e.g., "Compound Components — used for X because Y" |
| Algorithms used | structured list (name + short rationale + optional complexity note) | |
| Performance optimizations | structured list (technique + measured/estimated impact if known) | |
| Challenges | structured list (challenge + how resolved) | |
| Lessons learned | rich text or structured list | |
| AI prompts used | structured list (prompt text + purpose/context) | code-block styled |
| AI mistakes | structured list (what AI got wrong + how it was caught + correction) | this is a differentiating section — must be visually distinct, not buried |
| Engineering decisions | structured list (decision + alternatives considered + why chosen) | ADR-style |
| Created/updated timestamps | system | for sorting and "last updated" display |
| Featured flag | boolean | controls Home page inclusion |
| Display order | integer | manual ordering on listing page |

### 6.2 Skills entity
- Fields: name, category (e.g., Language / Framework / Concept / Soft skill), optional proficiency indicator.
- Reusable across projects and the About page.
- CRUD in Admin: Manage Skills.

### 6.3 Technologies entity
- Fields: name, category (e.g., Frontend / Backend / Database / DevOps / AI Tooling), icon/logo reference, optional official URL.
- Reusable across projects for tagging and listing-page filters.
- CRUD in Admin: Manage Technologies.

### 6.4 Public Website Requirements
- **Home**: hero/value prop, 3–4 featured projects (via Featured flag + Display order), tech/skill highlight strip, CTA to Projects and Contact.
- **Projects listing**: grid of published projects (card = cover image, title, summary, tech stack chips); filter by technology and/or skill; sort by date or manual order.
- **Project Details**: renders every populated field from 6.1 in a consistent, scannable layout; unpopulated optional fields are hidden, not shown empty; AI Prompts and AI Mistakes rendered in the CodeBlock-style component for visual consistency and credibility (looks like real artifacts, not marketing copy).
- **AI Workflow**: static-ish content page (owner-authored, not per-project) describing tools, general process, and philosophy; may reference/link specific projects' AI sections as examples.
- **About**: bio, skills summary pulling from Skills entity, experience/background narrative.
- **Contact**: form (name, email, message) with basic validation and spam protection, plus direct contact links.

### 6.5 Admin Dashboard Requirements
- **Login**: email/password auth, session-based, single admin account (v1 does not need multi-user roles).
- **Dashboard**: list of all projects (draft + published) with status, last updated, quick edit/delete/publish actions; basic counts (total projects, published, drafts).
- **Create/Edit Project**: form organized into logical sections matching the data model (Overview, Media, Tech & Skills, Architecture & Code, AI Workflow, Decisions & Learnings); autosave or explicit save-as-draft; validation on required fields before publish; slug uniqueness check.
- **Manage Skills / Manage Technologies**: simple CRUD list views (add/edit/delete), with a guard against deleting an entity that's currently referenced by a project (warn or require reassignment).
- **Upload Images**: drag-and-drop or file-picker upload, preview, delete, reuse existing uploaded images across gallery/cover without re-uploading.

### 6.6 Cross-cutting Functional Requirements
- All admin routes require authentication; public routes never expose draft projects.
- Rich text fields support at minimum: headings, bold/italic, bullet/numbered lists, inline code, code blocks with language labels, links, images.
- Structured list fields (AI prompts, decisions, patterns, etc.) support add/reorder/delete of individual entries.
- Image uploads are validated for type/size and produce a web-optimized version for display.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Public pages should achieve good Core Web Vitals (LCP < 2.5s on cover images); images served responsively/optimized; project detail pages should not block render on optional sections. |
| **Accessibility** | WCAG 2.1 AA baseline: semantic headings, alt text on all images (cover + gallery, enforced at upload/edit time), keyboard-navigable admin forms, sufficient color contrast (relevant given the dark-by-default, single-accent design direction). |
| **SEO** | Server-rendered/prerendered public pages, per-project meta title/description (derived from Title/Summary, editable), sitemap, Open Graph tags for social sharing of project links. |
| **Security** | Admin auth required for all write operations and draft content; input sanitization on rich text to prevent stored XSS; rate-limiting on Contact form and Login. |
| **Reliability** | Draft/publish separation prevents half-written projects from going live; image uploads and form saves should fail gracefully with clear error states. |
| **Maintainability** | Skills/Technologies as normalized entities, not repeated free text, so a rename/re-tag propagates everywhere. |
| **Scalability** | Data model and listing/filter UI should perform reasonably from 1 to 50+ projects without redesign. |
| **Content integrity** | AI Prompts and AI Mistakes sections should be structured so they render consistently even with long text (code-block wrapping, no layout breakage). |
| **Responsiveness** | Full public site usable on mobile (recruiters often review on phone); admin dashboard optimized primarily for desktop but not broken on tablet. |

---

## 8. User Stories

### Public visitor (Recruiter — Priya)
- As a recruiter, I want to see a project grid with tech stack chips, so I can quickly judge relevance without opening every project.
- As a recruiter, I want a one-line summary per project on the card, so I don't have to read a full description to decide if I should click in.

### Public visitor (Hiring Manager — Marcus)
- As a hiring manager, I want to read the architecture explanation and engineering decisions for a project, so I can understand how the candidate reasons about trade-offs.
- As a hiring manager, I want to see the challenges and how they were resolved, so I can gauge problem-solving ability, not just final output.

### Public visitor (Senior Engineer — Sofia)
- As a senior engineer, I want to see which React patterns and algorithms were used and why, so I can evaluate technical depth.
- As a senior engineer, I want to see the AI prompts used and the mistakes AI made (and how they were caught), so I can judge whether the candidate supervises AI output critically or ships it blindly.
- As a visitor, I want a dedicated AI Workflow page describing the general methodology, so I understand the philosophy behind AI usage across all projects, not just one.

### Admin (Owner)
- As the site owner, I want to log in securely, so only I can create or edit content.
- As the site owner, I want a structured project form with clearly labeled sections, so I don't forget to document something important while it's fresh.
- As the site owner, I want to save a project as a draft, so I can write it over multiple sessions before publishing.
- As the site owner, I want to manage a reusable list of Skills and Technologies, so I don't retype "React" or "PostgreSQL" for every project and can filter consistently.
- As the site owner, I want to upload and reuse images across a project's cover and gallery, so I don't have to re-upload the same asset.
- As the site owner, I want to mark a project as Featured and set its order, so I control what appears on the Home page and in what sequence.
- As the site owner, I want to edit a published project without it disappearing from the public site while I make changes, so the live site stays credible (edits apply on save, not mid-edit).

---

## 9. MVP Scope

The MVP is scoped tightly around **recruiter/hiring-manager evaluation speed** and **low-friction content creation** — not every possible feature.

### In scope for MVP
**Public site**
- Home (hero, featured projects, tech/skill highlights, CTAs)
- Projects listing (grid, filter by technology, no advanced search)
- Project Details — full data model from Section 6.1, all fields
- AI Workflow (single static-ish page, owner-authored)
- About
- Contact (simple form, no CRM integration — email notification is enough)

**Admin**
- Login (single admin account)
- Dashboard (project list + status + quick actions)
- Create/Edit Project (full form covering all fields, draft/publish states)
- Manage Skills (CRUD)
- Manage Technologies (CRUD)
- Upload Images (upload, preview, delete, reuse)

**Data/infra**
- Draft vs. Published states
- Basic image optimization on upload
- Basic SEO tags per page

### Explicitly out of scope for MVP (see Section 10)
- Multi-admin / roles / permissions
- Comments, likes, or any social features
- Analytics dashboards beyond basic page-view counts
- Full-text search across projects
- Versioning/history of project edits
- Localization / multi-language
- Blog/articles separate from projects
- Automated AI-assisted content generation inside the admin (e.g., "auto-write my architecture section")

---

## 10. Future Enhancements

| Enhancement | Rationale |
|---|---|
| Full-text/semantic search across all projects | Useful once project count grows past what a filtered grid handles well |
| Project edit history / versioning | Lets the owner show "before/after" refactors as their own case study |
| Analytics dashboard (which projects get read, drop-off points) | Helps the owner learn what content actually converts to interview requests |
| Tagging/linking related projects to each other | Shows evolution of skills over time |
| Embedded interactive code sandboxes | Lets visitors run small code snippets in-browser |
| AI Workflow auto-summary per project | Aggregate prompts/mistakes across projects into a meta-analysis (e.g., "common AI failure modes I catch") |
| Public API for project data | Allows the portfolio content to be reused (e.g., resume generator, LinkedIn sync) |
| Comments/annotations from viewers (e.g., recruiters leaving private notes) | Speculative — would need auth for viewers, likely low priority |
| Multi-language support | Only relevant if targeting non-English-speaking markets |
| CMS-style block editor for Full Description | Nice-to-have polish once structured fields prove sufficient |

---

## 11. Success Metrics

| Metric | Target signal |
|---|---|
| **Time-to-comprehension** | A recruiter/hiring manager can state what a project does and one key technical decision within ~2 minutes of landing on Project Details |
| **Content completeness** | % of published projects with all "differentiating" fields populated (Architecture, Decisions, AI Prompts, AI Mistakes) — target 100% for featured projects |
| **Admin authoring speed** | Time to go from "project finished" to "published on site" — target under 30 minutes for a straightforward project |
| **Funnel signal** | Ratio of Projects-listing visits → Project-Detail opens (indicates card/summary quality) |
| **Outbound signal** | Ratio of Project-Detail views → GitHub repo / Live demo clicks (indicates the write-up builds enough credibility to warrant deeper inspection) |
| **Contact conversion** | Contact form submissions per N unique visitors, as a proxy for overall portfolio effectiveness |
| **Content freshness** | Number of projects added/updated per quarter (proxy for whether the "knowledge base" habit is sticking, per Goal in Section 2) |

---

*End of document.*