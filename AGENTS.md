<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Devfolio Project Rules

## Working principles
- Inspect the current repository state before modifying files.
- Do not trust previous agent reports without verifying the working tree.
- Prefer minimal implementations.
- Avoid adding abstractions without a current requirement.
- For audits, inspect only directly related files. Do not recursively explore the whole repository unless requested.

## Architecture
- Preserve the existing feature-based structure.
- Keep business logic separated from UI.
- Avoid unrelated refactors.

## Verification
Before finishing:
- Confirm actual changed files.
- Run TypeScript checks when code changes are made.
- Run production build when relevant.
- Report only verified results.

## UI changes
When modifying UI:
- Review Tailwind classes.
- Check flex sizing, overflow, positioning context, and responsive behavior.
- Use UI-specific skills when applicable.

## Available skills
- Use UI review skills (Impeccable) only for UI/layout/accessibility tasks.