import type { Project, Skill, Technology } from "./types";

// ---------------------------------------------------------------------------
// MOCK DATA LAYER
// Every function here is what an API route / server component calls.
// To wire up MongoDB: replace the function bodies with Mongoose queries
// against the models in lib/models/*, keep the signatures identical, and
// the entire UI layer above needs zero changes. See BUSINESS-LOGIC.md.
// ---------------------------------------------------------------------------

const technologies: Technology[] = [
  { id: "t1", name: "Next.js", category: "Frontend" },
  { id: "t2", name: "React", category: "Frontend" },
  { id: "t3", name: "TypeScript", category: "Frontend" },
  { id: "t4", name: "MongoDB", category: "Database" },
  { id: "t5", name: "Tailwind CSS", category: "Frontend" },
  { id: "t6", name: "Claude API", category: "AI Tooling" },
  { id: "t7", name: "Node.js", category: "Backend" },
  { id: "t8", name: "Docker", category: "DevOps" },
];

const skills: Skill[] = [
  { id: "s1", name: "System Design", category: "Concept", proficiency: "Proficient" },
  { id: "s2", name: "React", category: "Framework", proficiency: "Expert" },
  { id: "s3", name: "AI-assisted development", category: "Concept", proficiency: "Expert" },
  { id: "s4", name: "Performance optimization", category: "Concept", proficiency: "Proficient" },
];

const projects: Project[] = [
  {
    id: "p1",
    slug: "devfolio-ai",
    title: "Devfolio AI",
    summary:
      "A developer portfolio that documents engineering reasoning, not just finished screenshots.",
    fullDescription:
      "Devfolio AI reframes the developer portfolio as an internal engineering wiki: every project ships with its architecture rationale, data flow, and — distinctively — the AI prompts used during development and the mistakes the AI made along the way.",
    status: "published",
    coverImage: "/covers/devfolio-ai.png",
    gallery: [
      { url: "/gallery/devfolio-1.png", caption: "Project detail page, architecture section" },
      { url: "/gallery/devfolio-2.png", caption: "Admin project editor" },
    ],
    githubUrl: "https://github.com/example/devfolio-ai",
    liveUrl: "https://devfolio.example.com",
    techStack: [
      { technologyId: "t1", name: "Next.js" },
      { technologyId: "t3", name: "TypeScript" },
      { technologyId: "t4", name: "MongoDB" },
      { technologyId: "t5", name: "Tailwind CSS" },
    ],
    skillIds: ["s1", "s3"],
    folderStructure: `app/
  (public)/
    page.tsx
    projects/[slug]/page.tsx
  admin/
    dashboard/page.tsx
lib/
  models/
  data.ts
components/
  ui/
  project/`,
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
      "Structuring the AI Mistakes field as its own first-class entity (not a paragraph inside 'lessons learned') made it far more likely to actually get filled in per project — generic reflection fields get skipped, structured prompts don't.",
    aiPrompts: [
      { purpose: "Initial data model scaffolding", prompt: "Given this PRD, generate a MongoDB/Mongoose schema for Project, Skill, and Technology with the fields listed in section 6.1. Keep relations by ObjectId, not embedded duplication." },
    ],
    aiMistakes: [
      {
        mistake: "AI embedded full Technology objects inside every Project document instead of referencing by ID.",
        caughtBy: "Renaming one technology in the admin didn't propagate to already-published projects — caught during manual QA of the Manage Technologies flow.",
        correction: "Switched techStack to store technologyId + denormalized name only for display, with the name refreshed on write, not just embedded once.",
      },
    ],
    engineeringDecisions: [
      {
        decision: "MongoDB over PostgreSQL for the content store",
        alternatives: ["PostgreSQL + Prisma", "Headless CMS (Sanity/Contentful)"],
        rationale: "Project documents are deeply nested and schema-flexible (structured lists of varying shape per project); a document DB avoids a join-heavy relational model for content that's read far more than it's queried analytically.",
      },
    ],
    featured: true,
    displayOrder: 1,
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
];

export async function getAllProjects(includeUnpublished = false) {
  return projects
    .filter((p) => includeUnpublished || p.status === "published")
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getFeaturedProjects() {
  const all = await getAllProjects();
  return all
    .filter((p) => p.featured)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      coverImageAlt: p.title,
      tech: p.techStack.map((t) => t.name),
      featured: p.featured,
    }));
}

export async function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug && p.status === "published") ?? null;
}

export async function getAllTechnologies() {
  return technologies.map((t) => t.name);
}

export async function getAllTechnologyEntities() {
  return technologies;
}

export async function getAllSkills() {
  return skills;
}
