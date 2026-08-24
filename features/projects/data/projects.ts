import type { Project } from "../types/project";

// Representative mock case studies keep this UI ready for a future API-backed
// source without introducing a second project data contract.
export const PROJECTS: Project[] = [
  {
    id: "p1",
    slug: "devfolio-ai",
    title: "Devfolio AI",
    category: "Full Stack",
    summary:
      "A developer portfolio that documents engineering reasoning, architectural decisions, and AI prompts alongside shipped code.",
    fullDescription:
      "Devfolio AI reframes the developer portfolio as an internal engineering wiki: every project ships with its architecture rationale, data flow, and — distinctively — the AI prompts used during development and the mistakes the AI made along the way.",
    features: [
      "Documented architecture rationale and data flow diagrams per project",
      "Logged AI prompt history, tool iterations, and recorded failure modes",
      "Clean separation between Server Components and thin DB data access layer",
      "Responsive design with dark/light themes and accessible primitives",
    ],
    status: "published",
    gallery: [],
    githubUrl: "https://github.com/Abdo5-Mahmoud/Developer-Dash-Folio",
    techStack: [
      { technologyId: "t1", name: "Next.js" },
      { technologyId: "t3", name: "TypeScript" },
      { technologyId: "t4", name: "MongoDB" },
      { technologyId: "t5", name: "Tailwind CSS" },
    ],
    skillIds: ["s1", "s3"],
    folderStructure: `app/\n  (public)/\n    page.tsx\n    projects/[slug]/page.tsx\n  admin/\n    dashboard/page.tsx\nlib/\n  models/\n  data.ts\ncomponents/\n  ui/\n  project/`,
    architectureExplanation:
      "Server components fetch project data directly from MongoDB via a thin data-access layer (lib/data.ts), keeping the client bundle free of DB drivers. The admin dashboard is a separate route group behind middleware-based auth, sharing the same design system components as the public site so admin-authored content previews accurately before publish.",
    dataFlow:
      "Admin submits a project form → API route validates payload → Mongoose writes to MongoDB with status='draft' → owner reviews on a preview route → status flips to 'published' → public routes (ISR-revalidated) start serving it.",
    reactPatterns: [
      { name: "Server Components for data fetching", rationale: "Keeps MongoDB queries off the client and avoids a client-side loading waterfall on project detail pages." },
      { name: "Compound components (Tabs, Card)", rationale: "Project detail sections (Architecture / AI Workflow / Decisions) share one Tabs primitive instead of bespoke toggle state per section." },
    ],
    algorithms: [
      { name: "Slug uniqueness check", rationale: "Debounced check against existing slugs on title change in the admin form, with a fallback suffix strategy.", complexity: "O(1) indexed lookup" },
    ],
    performanceOptimizations: [
      { technique: "Next.js Image with responsive sizes for cover/gallery", impact: "Reduced largest contentful paint on project detail pages" },
      { technique: "ISR (revalidate on publish) instead of full SSR per request", impact: "Public pages served from cache except right after edits" },
    ],
    challenges: [
      { challenge: "Rich-text fields needed to render consistently as both admin-editable and public-safe HTML.", resolution: "Sanitized markdown pipeline shared between admin preview and public render, single source of truth." },
    ],
    lessonsLearned:
      "Structuring the AI Mistakes field as its own first-class entity made it far more likely to actually get filled in per project.",
    aiPrompts: [
      { purpose: "Initial data model scaffolding", prompt: "Given this PRD, generate a MongoDB/Mongoose schema for Project, Skill, and Technology with the fields listed in section 6.1." },
    ],
    aiMistakes: [
      {
        mistake: "AI embedded full Technology objects inside every Project document instead of referencing by ID.",
        caughtBy: "Renaming one technology in the admin didn't propagate to already-published projects.",
        correction: "Switched techStack to store technologyId + denormalized name only for display.",
      },
    ],
    engineeringDecisions: [
      {
        decision: "MongoDB over PostgreSQL for the content store",
        alternatives: ["PostgreSQL + Prisma", "Headless CMS (Sanity/Contentful)"],
        rationale: "Project documents are deeply nested and schema-flexible; a document DB avoids a join-heavy relational model.",
      },
    ],
    featured: true,
    displayOrder: 1,
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "p2",
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    category: "Dashboard",
    summary:
      "Real-time performance monitoring dashboard with interactive time-series visualizations, custom threshold alerts, and telemetry streaming.",
    fullDescription:
      "Pulse Analytics provides engineering teams with immediate visibility into web application metrics. Built for high-frequency data streams, it aggregates client-side performance timings, error spikes, and endpoint latencies with sub-second dashboard updates.",
    features: [
      "Interactive time-series telemetry charts with customizable metric overlays",
      "Dynamic threshold alert rules with automated webhook dispatching",
      "Optimistic UI updates and cache invalidation using TanStack Query",
      "Responsive layout with accessible data table fallbacks",
    ],
    status: "published",
    gallery: [],
    techStack: [
      { technologyId: "t2", name: "React" },
      { technologyId: "t3", name: "TypeScript" },
      { technologyId: "t5", name: "Tailwind CSS" },
      { technologyId: "t9", name: "Recharts" },
      { technologyId: "t10", name: "TanStack Query" },
    ],
    skillIds: ["s2", "s4"],
    folderStructure: `app/
  dashboard/
  api/
components/
  charts/
  alerts/
lib/
  telemetry/
  queries/`,
    architectureExplanation:
      "Representative mock content: telemetry ingestion is separated from read-optimized chart queries. A query boundary converts time-series responses into stable view models so visualization components do not need to understand transport shapes.",
    dataFlow:
      "Representative flow: browser instrumentation sends batched measurements to an ingestion endpoint, the service validates and stores events, and dashboard queries return time-bucketed aggregates for the selected range.",
    reactPatterns: [
      {
        name: "Container and presentation split",
        rationale:
          "Keeps chart controls and query-state coordination separate from reusable visualizations so each can change independently.",
      },
      {
        name: "Optimistic mutation feedback",
        rationale:
          "Makes alert-rule edits feel immediate while retaining an explicit rollback path when validation rejects a change.",
      },
    ],
    algorithms: [
      {
        name: "Time-bucket aggregation",
        rationale:
          "Groups raw measurements into a bounded series appropriate for the selected time window instead of sending every event to the chart.",
        complexity: "Representative: O(n) for n measurements in the selected range",
      },
    ],
    performanceOptimizations: [
      {
        technique: "Windowed chart data",
        impact:
          "Representative: bounds client rendering work by requesting only the visible time range and resolution.",
      },
      {
        technique: "Stable query keys for dashboard controls",
        impact:
          "Representative: avoids refetching unchanged panels when unrelated controls change.",
      },
    ],
    challenges: [
      {
        challenge: "Making volatile telemetry readable without hiding important spikes.",
        resolution:
          "Representative approach: preserve the selected aggregation level in the URL and show the underlying interval beside each chart.",
      },
    ],
    lessonsLearned:
      "Representative lesson: a fast dashboard is only useful when the time range and aggregation behind each visualization are explicit.",
    aiPrompts: [
      {
        purpose: "Exploring query-state boundaries",
        prompt:
          "Propose a component boundary for a telemetry dashboard where chart controls update URL state, query code owns request serialization, and chart components receive only display-ready series data.",
      },
    ],
    aiMistakes: [
      {
        mistake: "Suggested sharing one loading state across every dashboard panel.",
        caughtBy:
          "Representative review found that one delayed panel would make unrelated cached panels appear unavailable.",
        correction:
          "Keep loading and error ownership at the panel query boundary while retaining page-level context.",
      },
    ],
    engineeringDecisions: [
      {
        decision: "Model dashboard controls as URL state",
        alternatives: ["Component-only state", "Global client store"],
        rationale:
          "Representative rationale: an addressable time range and selected metric make a useful dashboard view repeatable without a cross-page state dependency.",
      },
    ],
    featured: true,
    displayOrder: 2,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "p3",
    slug: "collaborative-canvas",
    title: "Collaborative Canvas",
    category: "Real-time",
    summary:
      "Low-latency collaborative whiteboard with real-time multi-cursor sync, CRDT conflict resolution, and offline undo/redo history.",
    fullDescription:
      "Collaborative Canvas enables distributed teams to brainstorm and sketch in real-time. By leveraging WebSocket pipelines and conflict-free replicated data types, it maintains synchronized state across dozens of concurrent editors with zero central server locking.",
    features: [
      "Sub-50ms multi-user cursor position broadcast and state synchronization",
      "CRDT-backed conflict resolution for concurrent path and shape manipulations",
      "Local IndexedDB persistence for offline work and reconnect syncing",
      "Export capability to SVG, PNG, and vector JSON payloads",
    ],
    status: "published",
    gallery: [],
    techStack: [
      { technologyId: "t1", name: "Next.js" },
      { technologyId: "t3", name: "TypeScript" },
      { technologyId: "t7", name: "Node.js" },
      { technologyId: "t11", name: "Socket.IO" },
    ],
    skillIds: ["s1", "s2"],
    folderStructure: `app/
  board/[boardId]/
components/
  canvas/
  presence/
lib/
  collaboration/
  history/`,
    architectureExplanation:
      "Representative mock content: the drawing surface owns local interaction state, while a collaboration adapter translates durable board operations to and from the transport. Presence is separate from document state because cursor updates are transient.",
    dataFlow:
      "Representative flow: a pointer interaction becomes a local board operation, the collaboration adapter broadcasts it, peers merge the operation into their local document, and a separate presence channel updates cursors without changing board history.",
    reactPatterns: [
      {
        name: "Imperative canvas adapter",
        rationale:
          "Contains high-frequency drawing updates at the canvas boundary instead of forcing every pointer movement through React rendering.",
      },
      {
        name: "External-store subscription",
        rationale:
          "Lets focused UI controls subscribe to collaboration state without coupling the full board tree to every remote operation.",
      },
    ],
    algorithms: [
      {
        name: "Operation-based conflict resolution",
        rationale:
          "Represents edits as mergeable operations so concurrent changes can converge without a single editor holding a lock.",
        complexity: "Representative: depends on the number of concurrent operations being merged",
      },
    ],
    performanceOptimizations: [
      {
        technique: "Separate transient presence from persisted board operations",
        impact:
          "Representative: cursor movement does not create document-history churn or trigger persistence work.",
      },
    ],
    challenges: [
      {
        challenge: "Avoiding visual jitter while remote operations arrive during a local draw gesture.",
        resolution:
          "Representative approach: retain the local in-progress path until it is committed, then reconcile it with the merged board state.",
      },
    ],
    lessonsLearned:
      "Representative lesson: real-time collaboration is clearer when transient feedback and durable document changes have separate ownership.",
    aiPrompts: [
      {
        purpose: "Reviewing collaboration boundaries",
        prompt:
          "Review this whiteboard data flow. Identify which updates should be durable operations, which should be transient presence, and what each boundary must do when a peer reconnects.",
      },
    ],
    aiMistakes: [
      {
        mistake: "Suggested persisting every cursor position as a board mutation.",
        caughtBy:
          "Representative review identified that cursor positions are ephemeral and would flood history with non-document changes.",
        correction:
          "Route cursor positions through a presence channel and persist only operations that change the board document.",
      },
    ],
    engineeringDecisions: [
      {
        decision: "Keep transport concerns behind a collaboration adapter",
        alternatives: ["Call socket APIs directly from canvas components", "Centralize all state in one global store"],
        rationale:
          "Representative rationale: the drawing UI can evolve independently from connection, retry, and operation-serialization concerns.",
      },
    ],
    featured: true,
    displayOrder: 3,
    createdAt: "2026-07-15T00:00:00Z",
    updatedAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "p4",
    slug: "auth-gateway-service",
    title: "Auth Gateway Service",
    category: "Backend",
    summary:
      "Stateless JWT authentication and distributed rate-limiting middleware service built for microservice architectures.",
    fullDescription:
      "A high-throughput API security gateway that sits in front of backend microservices, handling token verification, cryptographic signature rotation, and Redis-backed sliding-window rate limiting.",
    features: [
      "Stateless JWT verification with asymmetric public key validation",
      "Sliding-window rate limiter with Redis backend preventing DDoS",
      "Schema-based request payload validation powered by Zod",
      "Structured JSON audit logging with trace ID propagation",
    ],
    status: "published",
    gallery: [],
    techStack: [
      { technologyId: "t7", name: "Node.js" },
      { technologyId: "t3", name: "TypeScript" },
      { technologyId: "t12", name: "Express.js" },
      { technologyId: "t13", name: "Zod" },
    ],
    skillIds: ["s1"],
    folderStructure: `src/
  middleware/
  auth/
  rate-limit/
  validation/
  observability/`,
    architectureExplanation:
      "Representative mock content: authentication, request validation, and rate limiting run as ordered middleware with a narrow request context passed between them. Policy code stays separate from protocol-specific HTTP concerns so it can be tested with request fixtures.",
    dataFlow:
      "Representative flow: a request receives trace context, credentials are verified, a rate-limit policy evaluates the caller and route, the payload is validated, and the downstream service receives a normalized request or structured rejection.",
    reactPatterns: [],
    algorithms: [
      {
        name: "Sliding-window rate limiting",
        rationale:
          "Tracks request timestamps in a rolling interval so a caller cannot burst across a fixed-window boundary.",
        complexity: "Representative: O(log n) or O(1) per request depending on the backing-store primitive",
      },
    ],
    performanceOptimizations: [
      {
        technique: "Short-circuit rejected requests before downstream dispatch",
        impact:
          "Representative: prevents invalid or over-limit traffic from consuming application work.",
      },
    ],
    challenges: [
      {
        challenge: "Returning safe authentication failures without making client integration opaque.",
        resolution:
          "Representative approach: use stable public error codes, preserve a trace identifier, and keep token-validation detail out of the response.",
      },
    ],
    lessonsLearned:
      "Representative lesson: security middleware needs observability that helps operators diagnose policy decisions without exposing sensitive verification detail.",
    aiPrompts: [
      {
        purpose: "Threat-model review",
        prompt:
          "Review this gateway middleware order for token verification, request validation, rate limiting, and audit logging. Identify information leaks and failure-order trade-offs.",
      },
    ],
    aiMistakes: [
      {
        mistake: "Suggested logging full authorization headers to make invalid-token failures easier to debug.",
        caughtBy:
          "Representative security review identified the token value as sensitive credential material.",
        correction:
          "Log only non-sensitive metadata, a trace identifier, and a stable failure code.",
      },
    ],
    engineeringDecisions: [
      {
        decision: "Use ordered middleware with a normalized request context",
        alternatives: ["Route-specific security logic", "A single all-purpose gateway handler"],
        rationale:
          "Representative rationale: policy checks remain inspectable and testable while each downstream handler receives the same validated contract.",
      },
    ],
    featured: false,
    displayOrder: 4,
    createdAt: "2026-07-20T00:00:00Z",
    updatedAt: "2026-08-11T00:00:00Z",
  },
];
