# Information Architecture

## Devfolio AI — Developer Portfolio & Engineering Knowledge Base

**Source:** [`prd.md`](../product/prd.md)  
**Status:** Architecture blueprint v1.0  
**Last updated:** August 2026

---

## Architecture Principles

- Prioritize a recruiter’s path to credible evidence: project summary → technical decisions → source/demo.
- Keep public information discoverable by meaningful slugs; keep mutable database IDs inside admin routes only.
- Treat each published project as one self-contained engineering case study, with optional sections hidden when no content exists.
- Keep the MVP intentionally small: technology filtering is sufficient before a project library has enough content to justify full-text search.
- Separate content authoring (admin) from content consumption (public) and never expose drafts publicly.

---

## 1. Application Sitemap

```
Devfolio AI
│
├── Public pages
│   ├── Home (/)
│   ├── Projects (/projects)
│   │   └── Project detail (/projects/[slug])
│   ├── AI Workflow (/ai-workflow)
│   ├── About (/about)
│   └── Contact (/contact)
│
├── Authentication pages
│   └── Admin login (/login)
│
├── Protected admin pages
│   └── Dashboard (/dashboard)
│       ├── Overview (/dashboard)
│       ├── Projects (/dashboard/projects)
│       │   ├── Create project (/dashboard/projects/new)
│       │   ├── Project record (/dashboard/projects/[id])
│       │   └── Edit project (/dashboard/projects/[id]/edit)
│       ├── Skills (/dashboard/skills)
│       ├── Technologies (/dashboard/technologies)
│       ├── Media library (/dashboard/media)
│       └── Settings (/dashboard/settings)
│
└── Error and system pages
    ├── Not found (/not-found)
    ├── Unauthorized (/unauthorized)
    ├── Internal error (/error)
    └── Maintenance / temporarily unavailable (/maintenance, only if operationally needed)
```

`/dashboard` is the dashboard overview, avoiding an unnecessary duplicate `/dashboard/overview` route. A temporary `/maintenance` route is optional and should not be built for the MVP unless deployment operations require it.

---

## 2. Navigation Structure

### Public desktop navigation

**Primary navigation:** logo/home, Projects, AI Workflow, About, Contact. The Projects link is the highest-priority destination. A compact primary contact action may appear beside these links.

**Secondary navigation:** only within a project detail page. It links to anchors for populated case-study sections: Overview, Architecture, Data Flow, Engineering Decisions, Performance, Challenges, AI Workflow, and Learnings. This is contextual navigation, not a global menu.

**Footer navigation:** Home, Projects, AI Workflow, About, Contact, GitHub, LinkedIn, email, plus a small admin-login link. It should repeat essential destinations rather than introduce new content areas.

**Breadcrumb behavior:**

- No breadcrumb on Home.
- No breadcrumb required on top-level public pages.
- Project detail: `Home / Projects / [Project title]`.
- Breadcrumb labels use human-readable titles; only the project title is non-linked/current.

### Public mobile navigation

**Primary navigation:** logo/home plus a collapsed menu containing Projects, AI Workflow, About, and Contact. Preserve the same labels and order as desktop.

**Secondary navigation:** project-section links are available as a compact in-page contents control; only sections that exist for that project appear.

**Footer and breadcrumbs:** the footer contains the full public navigation. Project breadcrumbs remain available, but may be shortened to `Projects / [Project title]` where space is constrained.

### Admin dashboard navigation

**Primary navigation:** Dashboard, Projects, Skills, Technologies, Media, Settings. It remains persistent while navigating admin pages.

**Secondary navigation:** context-specific actions, not another global menu:

- Projects: Create Project; filtering by status; project-level View Public, Edit, Publish/Unpublish, and Delete actions.
- Project editor: section navigation for Overview, Media, Tech & Skills, Architecture & Code, AI Workflow, and Decisions & Learnings.
- Media: upload, asset detail, and asset usage context.

**Footer navigation:** no separate dashboard footer is required in the MVP. Include sign-out and a View Site action in the persistent admin context.

**Breadcrumb behavior:** `Dashboard / [Area] / [Record title or action]`. Examples: `Dashboard / Projects / Create` and `Dashboard / Projects / Devfolio AI / Edit`. Use the project title after it exists; otherwise use the action label.

---

## 3. Route Architecture

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Establishes the portfolio’s engineering-first value proposition; surfaces featured projects and routes visitors onward. |
| `/projects` | Public | Lists published projects and supports discovery by technology filter, ordering, and direct project selection. |
| `/projects/[slug]` | Public | Canonical public engineering case study for one published project. |
| `/ai-workflow` | Public | Explains the developer’s cross-project AI-assisted engineering methodology and links to relevant project examples. |
| `/about` | Public | Provides professional context, experience narrative, and reusable skill summary. |
| `/contact` | Public | Offers direct contact paths and accepts a validated visitor message. |
| `/login` | Public authentication | Authenticates the single administrator and redirects an existing session to `/dashboard`. |
| `/dashboard` | Admin only | Shows content status, basic project counts, recent updates, and high-value authoring actions. |
| `/dashboard/projects` | Admin only | Manages the complete project inventory, including published and draft records. |
| `/dashboard/projects/new` | Admin only | Creates a structured project record, initially as a draft. |
| `/dashboard/projects/[id]` | Admin only | Provides the administrative record summary and safe actions for one project; uses internal ID because title/slug can change. |
| `/dashboard/projects/[id]/edit` | Admin only | Edits all project documentation fields and controls draft/publish status. |
| `/dashboard/skills` | Admin only | Creates, updates, and safely retires reusable skill entities. |
| `/dashboard/technologies` | Admin only | Creates, updates, and safely retires reusable technology entities. |
| `/dashboard/media` | Admin only | Uploads, reuses, reviews, and removes media assets, with reference awareness. |
| `/dashboard/settings` | Admin only | Manages single-admin account and portfolio-wide settings, including contact and social links. |
| `/unauthorized` | Public system | Explains that an attempted admin route requires authorization, with a route to login. |
| `/not-found` | Public system | Handles invalid public slugs, removed public content, and unknown routes. |
| `/error` | Public system | Provides a safe recovery state for unexpected application errors. |

**Route conventions**

- Public project pages use `/projects/[slug]`; the slug is unique and stable once published. If a slug must change, redirect the old slug to the canonical URL.
- Admin records use `[id]` because operations need stable internal references even if title or slug changes.
- Do not create `/projects/categories` in the MVP. Technologies and skills are filters, not independent public taxonomies.
- Do not create a public `/search` route in the MVP. Use filter state on `/projects` until the library warrants full-text search.

---

## 4. User Flows

### General visitor

| Flow element | Definition |
|---|---|
| Entry points | Direct public URL, shared project link, search result, social profile, or Home. |
| Navigation path | Home → Projects → Project Detail → GitHub/Live Demo/Contact; or Home → About/AI Workflow → Projects. |
| Goals | Understand who the developer is, inspect relevant work, and reach an external proof point or contact route. |
| Exit points | GitHub repository, live demo, email/contact submission, LinkedIn, or a later return to the project listing. |

### Recruiter

| Flow element | Definition |
|---|---|
| Entry points | Home, Projects listing, or a project page shared in an application. |
| Navigation path | Home → Featured Project or Projects → filter by technology → Project Detail overview → Contact. |
| Goals | Quickly determine role fit, relevant technology exposure, credibility, and how to contact the candidate. |
| Exit points | Contact, resume/application system (external), LinkedIn/GitHub, or another project through related/previous-next navigation. |

The recruiter path should make a useful decision possible without requiring the full technical case study: title, summary, technology stack, project status/context, and direct links must be available early in the journey.

### Authenticated administrator

| Flow element | Definition |
|---|---|
| Entry points | `/login`; an attempted protected route redirects to login and retains a safe return destination. |
| Navigation path | Login → Dashboard → Projects → Create or Edit → Save Draft / Publish → View Public; or Dashboard → Skills/Technologies/Media → return to project editor. |
| Goals | Record a project while context is fresh, manage reusable entities and images, validate completeness, and publish reliable documentation. |
| Exit points | View Public project, Dashboard, Sign out, or saved draft for later completion. |

**Publishing flow:** Create draft → complete required overview/media/technology information → add relevant technical evidence → validate required fields and unique slug → publish → visit public URL. A published record can be edited without exposing incomplete intermediate work; only an explicit successful save changes the public version.

---

## 5. Page Inventory

### Public and authentication pages

| Page | Purpose | Main sections | Required data | User actions | Related pages |
|---|---|---|---|---|---|
| Home | Communicate positioning and direct visitors to the strongest evidence. | Value proposition, featured projects, skill/technology highlights, AI workflow preview, contact route. | Site profile, featured published projects, reusable skills/technologies, social/contact links. | Open a project, explore AI workflow, navigate to About/Contact. | Projects, Project Detail, AI Workflow, About, Contact. |
| Projects | Provide a scannable inventory of published work. | Project collection, technology filters, sort control, no-results state. | Published project summaries, cover images, technologies, display order/date. | Filter, sort, clear filters, open a project. | Home, Project Detail. |
| Project Detail | Prove engineering judgment for one project. | Overview; gallery; repository/demo links; tech/skills; folder structure; architecture; data flow; patterns; algorithms; performance; challenges; decisions; AI prompts/mistakes; lessons; related and previous/next projects. | All populated published project fields, referenced skills/technologies/media, navigation context. | Navigate sections; visit GitHub/demo; view gallery; open related, previous, or next project; contact owner. | Projects, AI Workflow, Contact, other Project Details. |
| AI Workflow | Explain the owner’s overarching AI-assisted process. | Philosophy, tools, workflow stages, review/correction practices, cross-project examples. | Owner-authored workflow content and linked published project examples. | Open an example project; continue to Projects or Contact. | Project Detail, Projects, About. |
| About | Give professional context behind the case studies. | Bio, experience/background narrative, skills by category, external professional links. | Site profile, experience narrative, Skills entities, links. | Explore projects, open external profile/repository, contact owner. | Home, Projects, Contact. |
| Contact | Convert interest into an actionable conversation. | Contact message submission and direct contact channels. | Contact destination/settings, validation/spam-protection configuration. | Submit message; use email, GitHub, or LinkedIn link. | Home, About, Project Detail. |
| Login | Secure entry to content administration. | Authentication request and recovery/error state. | Admin authentication configuration/session state. | Sign in; return to intended protected route. | Dashboard, Unauthorized. |

### Admin pages

| Page | Purpose | Main sections | Required data | User actions | Related pages |
|---|---|---|---|---|---|
| Dashboard | Orient the owner and expose the next useful authoring task. | Content counts, recent projects/updates, draft attention, quick actions. | All project statuses/timestamps and basic aggregates. | Create project; open project; review drafts; navigate to management areas. | Projects, Skills, Technologies, Media, Settings. |
| Projects admin | Operate the complete project inventory. | Project records, status filter, sort, record actions. | Draft and published projects, timestamps, title, slug, status, feature/order metadata. | Create, inspect, edit, publish/unpublish, delete after confirmation, view public page. | Create Project, Project Record, Project Editor. |
| Create Project | Start a complete, structured case study. | Overview; Media; Tech & Skills; Architecture & Code; AI Workflow; Decisions & Learnings; publishing controls. | Skills, technologies, media assets, draft project fields. | Save draft, add/reorder structured entries, upload/select media, validate, publish when complete. | Projects admin, Media, Skills, Technologies, Project Editor. |
| Project Record | Provide stable admin context for a specific project. | Record metadata, publication state, completeness summary, actions. | One project record and reference counts. | View public, edit, change state, delete after confirmation. | Projects admin, Project Editor, public Project Detail. |
| Edit Project | Maintain a project without losing structured content. | Same content sections as Create Project plus save/publish state. | Existing project, skills, technologies, media, validation state. | Save, save draft, publish/unpublish, edit slug, manage/reorder entries, open public version. | Project Record, Media, Skills, Technologies. |
| Skills | Maintain consistent, reusable skills. | Skill collection, category/proficiency data, usage references. | Skill records and project reference counts. | Add, edit, search/filter collection if needed, retire/delete only after reassignment. | Project Editor, About. |
| Technologies | Maintain consistent, reusable technology labels. | Technology collection, category, official URL/icon reference, usage references. | Technology records and project reference counts. | Add, edit, search/filter collection if needed, retire/delete only after reassignment. | Project Editor, Projects public filter. |
| Media | Manage reusable project imagery. | Asset collection, upload state, metadata/alt text, asset usage references. | Media assets, type/size metadata, alt text, project references. | Upload, inspect, edit accessibility metadata, reuse, delete unreferenced asset. | Project Editor, Project Detail. |
| Settings | Maintain portfolio-level information and administrative account settings. | Profile/contact details, social URLs, public metadata defaults, account/session controls. | Site configuration and admin account data. | Update settings, sign out, optionally rotate credentials. | Home, About, Contact, Dashboard. |

### Error/system pages

| Page | Purpose | Main sections | Required data | User actions | Related pages |
|---|---|---|---|---|---|
| Not Found | Recover from invalid or unavailable URLs without leaking draft information. | Explanation and safe public destinations. | Requested path context only; never private record detail. | Go Home, browse Projects. | Home, Projects. |
| Unauthorized | Recover from unauthenticated admin access. | Access explanation, login route, public-site route. | Session/return-path state. | Log in; return to public site. | Login, Dashboard. |
| Error | Recover gracefully from an unexpected failure. | Safe explanation, retry action, public fallback. | Error correlation/logging metadata, not raw internals. | Retry; go Home or Projects. | Home, Projects. |

---

## 6. Access Control

| Access level | Pages | Why |
|---|---|---|
| Public | `/`, `/projects`, `/projects/[slug]` for published projects only, `/ai-workflow`, `/about`, `/contact`, `/login`, system error pages. | These pages are marketing and evaluative content intended for visitors and search engines. |
| Protected | Any route that requires a valid session, currently all `/dashboard/*` routes. | Prevents unauthorized viewing of drafts, internal media, project management data, and site configuration. |
| Admin only | All protected dashboard routes and all write actions. In MVP, the sole authenticated role is the administrator. | The PRD specifies a single-admin authoring system; separating “protected” from “admin only” is future-ready terminology but has the same effective membership in v1. |

Additional rules:

- Draft, unpublished, preview-only, and deleted project content must never resolve on public project URLs.
- A public slug resolves only to a published project; otherwise respond with Not Found, not an “unpublished” message.
- Login attempts and contact submission must be rate limited. Administrative write operations must validate server-side authorization.
- Media access should not reveal an asset’s project association or draft status to unauthenticated users.

---

## 7. Search & Navigation Strategy

### Project discovery

- Home exposes a deliberately small, curated set of featured projects.
- `/projects` is the complete public catalog and the source of truth for discovery.
- Every project card must expose title, summary, relevant technologies, and cover image so recruiters can decide whether to open it quickly.
- The About and AI Workflow pages link to evidence-rich project examples, rather than duplicating their technical detail.

### Filtering and sorting

- MVP filter: technology, using reusable Technology entities.
- Filter state belongs in query parameters so it can be bookmarked/shared, e.g. `/projects?tech=next-js`.
- A visitor can clear all filters in one action.
- Default ordering is the owner-defined display order. Offer newest-updated/date ordering only if project timestamps are meaningful to visitors; do not add complex relevance ranking in the MVP.
- Skills may be displayed on projects but are not an MVP public filter, keeping recruiter decision-making focused on concrete stack relevance.

### Search

- Do not implement public full-text search in the MVP; the PRD explicitly defers it.
- Add a search field only after the catalog contains enough projects that technology filtering and scannable summaries stop being sufficient. At that stage, search title, summary, technologies, and selected technical headings, returning published projects only.
- Admin collections may use simple local/server-side text filtering to reduce authoring friction; this does not require a public search architecture.

### Related, previous, and next projects

- On every public Project Detail page, show related projects based first on shared technologies, then shared skills; exclude the current project and include only published records.
- Limit related results to a small, explainable set (three is sufficient). Prefer projects with the most shared technologies; use display order as a tie-breaker.
- Previous/next navigation follows the active public catalog order, not database creation order. It helps a reviewer inspect the portfolio sequentially.
- When a visitor arrived with an active technology filter, preserve the filter context in list-return links; do not force it into canonical project URLs.

---

## 8. URL Design

### Public URLs

```
/
/projects
/projects?tech=next-js
/projects/devfolio-ai
/projects/realtime-chat-app
/ai-workflow
/about
/contact
/login
```

Rules:

- Use lower-case, hyphenated, descriptive slugs: `devfolio-ai`, not `DevfolioAI`, `project-3`, or an internal ID.
- Use one canonical project URL per published record; redirect changed historical slugs to the new slug.
- Keep filter, sort, and pagination state (if later needed) in query parameters, not path segments.
- Do not create separate public URLs for individual case-study sections; use page anchors such as `/projects/devfolio-ai#architecture` so one project remains one shareable case study.

### Administrative URLs

```
/dashboard
/dashboard/projects
/dashboard/projects/new
/dashboard/projects/[id]
/dashboard/projects/[id]/edit
/dashboard/skills
/dashboard/technologies
/dashboard/media
/dashboard/settings
```

Administrative IDs are intentionally internal and may be opaque. They are not part of public SEO or sharing strategy.

---

## 9. Missing Pages, Flows, States, and Tools Review

### Recommended additions to the PRD architecture

| Gap | Recommendation | Priority |
|---|---|---|
| Media is listed as “Upload Images,” but lacks a durable destination. | Name it **Media Library** and use `/dashboard/media`; track asset references before deletion. | MVP |
| Portfolio-wide content has no owner. | Add `/dashboard/settings` for biography, contact channels, social links, and default SEO metadata. | MVP |
| Admin records need a safe operational view separate from the long editor. | Keep `/dashboard/projects/[id]` as a record/status page; the editor stays at `/edit`. | MVP |
| Editorial completeness is not explicit. | Add a project-editor completeness check before publish: required title, summary, cover image, technology, unique slug, and accessibility text. Distinguish warnings for optional but differentiating sections (Architecture, Decisions, AI Prompts, AI Mistakes). | MVP |
| Contact delivery failure is unspecified. | Define success, validation-error, rate-limit, and delivery-failure states; preserve the visitor’s entered message on recoverable error. | MVP |
| Administrative destructive flows are unspecified. | Require confirmation for delete/unpublish and block or require reassignment when deleting referenced skills, technologies, or media. | MVP |
| Empty collections have no defined behavior. | Define empty states for no published projects, no filter results, no related projects, no media, and no skills/technologies. | MVP |
| Project changes need safe public behavior. | Use save semantics so edits to published projects change public content only after a successful explicit save; drafts remain private. | MVP |
| Accessibility information for media needs ownership. | Require meaningful alt text/caption during upload or project assignment, and identify decorative assets explicitly. | MVP |

### Explicitly defer to avoid overengineering

- A public category index (`/projects/categories`) or separate technology landing pages.
- Public full-text or semantic search.
- Multi-user roles, editorial approvals, activity logs, and content version history.
- Resume page, blog, newsletter, comments, saved projects, and recruiter accounts.
- Dedicated project preview URLs for drafts; preview may be added only when a future authoring workflow truly requires it.
- Advanced analytics screens; capture only the metrics needed by the PRD’s success measures first.

### Implementation readiness checklist

Before implementation, resolve these content-model decisions:

1. Define which project fields are mandatory to publish versus recommended evidence fields.
2. Confirm the media storage provider, image size/type limits, and deletion/reuse rules.
3. Define one source of truth for the AI Workflow page: site settings/static content versus a dedicated editable content record.
4. Decide whether the contact form sends email directly or through a form-delivery provider; this determines delivery and failure handling.
5. Establish canonical metadata fields and redirect policy for changed public slugs.

---

*End of Information Architecture.*
