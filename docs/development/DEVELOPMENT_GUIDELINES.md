Refactor the existing codebase to adopt a consistent feature-based architecture
across the entire application.

This is NOT a Projects-only refactor.

The goal is to migrate the existing application from a mixed/global structure
into a feature-oriented structure based on responsibility and page/domain
ownership.

Core principle:

"Local by default, shared by necessity."

The architecture should be applied consistently to ALL existing features,
not only the Projects feature.

Before changing files:

1. Inspect the entire existing source structure.
2. Identify the existing pages/features and their responsibilities.
3. Determine which components, data, functions, hooks, and types belong to
   each feature.
4. Then propose the migration structure before executing it.

Target concept:

features/
├── home/
│ ├── components/
│ ├── data/
│ ├── lib/
│ └── types/
│
├── projects/
│ ├── components/
│ ├── data/
│ ├── lib/
│ └── types/
│
├── about/
│ ├── components/
│ ├── data/
│ └── types/
│
├── skills/
│ ├── components/
│ └── data/
│
└── other-feature/
└── ...

The exact feature list must be determined from the existing codebase.
Do not blindly create empty folders for features that do not exist.

Important:

The Home page IS a feature.

Anything whose responsibility is specifically part of the Home page
should be considered for ownership by:

features/home/

For example:

features/home/components/

- Hero
- About section used specifically on Home
- Skills preview used specifically on Home
- Featured Projects presentation used specifically on Home

However, shared primitives remain shared.

For example:

components/ui/

- Button
- Card
- Badge
- Dialog
- Input
- etc.

Do NOT move a component into a feature simply because its name matches
another domain.

Determine ownership by responsibility.

Examples:

A Project Details component belongs to:

features/projects/components/

A Featured Projects presentation component that exists specifically
to compose the Home page belongs to:

features/home/components/

A reusable Button belongs to:

components/ui/

A project retrieval function belongs to:

features/projects/lib/

A Home-specific data configuration belongs to:

features/home/data/

A genuinely shared utility belongs to:

lib/

Data boundaries:

Each feature should own its feature-specific data.

For example:

features/projects/data/projects.ts

features/skills/data/skills.ts

features/home/data/\*

Do not create one giant global data file containing unrelated domains.

Logic boundaries:

Feature-specific functions belong inside that feature.

For example:

features/projects/lib/
features/home/lib/

Do not place feature-specific functions inside a generic global utils
folder.

Shared utilities may remain in:

lib/

only when they are genuinely independent of a specific feature.

Types:

Keep feature-specific types close to the feature.

For example:

features/projects/types/

Only move types into a global shared types location when they are genuinely
shared across independent features.

Routing:

Keep Next.js route files under app/.

Route files should remain thin and should primarily handle:

- route parameters
- route-level data loading
- not-found handling
- page composition

Do not put large feature UI implementations inside app/.

Example:

app/projects/[slug]/page.tsx

should compose the Projects feature rather than own the entire UI.

Home:

app/page.tsx

should compose the Home feature rather than contain the entire Home UI.

Cross-feature dependencies:

Features may consume functionality or data from another feature when that
dependency is legitimate.

Do NOT move the consuming feature into the provider feature.

For example:

Home may consume project information.

That does NOT mean Home becomes part of Projects.

Home owns the presentation and composition of projects on the Home page.

Projects owns the project domain and Project Details behavior.

Shared code:

Only promote code to shared locations when there is a real reuse case.

Do NOT move code to shared locations merely because it "might be reused
later."

Do NOT create unnecessary abstractions, repositories, service layers,
contexts, hooks, or generic wrappers.

Migration requirements:

- Preserve all existing behavior.
- Preserve visual design.
- Preserve routes.
- Preserve light/dark mode.
- Preserve animations.
- Preserve existing reusable UI components.
- Do not introduce new dependencies.
- Do not rewrite working code unnecessarily.
- Do not change product behavior as part of this migration.

Very important:

Do not perform the migration based only on file names.

Determine ownership from what each file actually does.

Before moving a file, ask:

1. What responsibility does it have?
2. Which feature owns that responsibility?
3. Is it page-specific?
4. Is it domain-specific?
5. Is it genuinely shared?

Validation:

After the migration:

- Run TypeScript checks.
- Run ESLint.
- Run the production build.
- Verify the major public routes.

If anything fails, fix the migration issue rather than hiding the error.

Final report:

Provide:

1. The final feature-based folder structure.
2. Files moved.
3. Files created.
4. Files deleted.
5. Which files remain shared and why.
6. Which files became Home-owned.
7. Which files became Projects-owned.
8. Any cross-feature dependencies.
9. Validation results.
10. Any architectural decisions that deserve manual review.

Do NOT implement new features during this task.

This task is strictly an architectural refactor of the existing codebase.
