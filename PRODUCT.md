# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers, and potential clients evaluating a developer's projects, skills, and engineering thinking. The developer is the owner and admin operator who maintains the portfolio and knowledge base.

## Product Purpose

Devfolio AI presents credible project work, technical skills, and engineering knowledge in one public portfolio, makes it easy for visitors to get in touch, and gives the owner a protected admin workflow for managing portfolio content. Success means visitors can quickly understand the developer's capabilities and take the next contact or evaluation step, while the owner can keep the content current.

## Positioning

The product combines a developer portfolio with an engineering knowledge base and an owner-managed content system, so visitors can evaluate both shipped work and the thinking behind it rather than seeing only a static resume.

## Operating Context

Visitors browse public portfolio pages including the home page, projects, project detail pages, about, contact, showcase, and AI workflow content. The owner uses password-protected admin pages to manage projects and related portfolio data. Contact messages are submitted through the public contact flow and persisted for owner follow-up.

## Capabilities and Constraints

- Next.js web application with TypeScript and Tailwind CSS.
- MongoDB-backed projects, technologies, skills, and contact messages.
- Password-protected admin area for project management.
- English-language content.
- Preserve existing public portfolio, knowledge-base, contact, authentication, and admin workflows.
- Do not invent testimonials, customers, benchmarks, pricing, or performance metrics.

## Brand Commitments

The product name is Devfolio AI. The existing developer identity and `public/avatar.jpeg` asset are part of the current product and should be preserved unless the owner explicitly changes them.

## Evidence on Hand

- Public routes and portfolio components in `app/` and `features/`.
- Project and technology data models in `lib/models/` and data access in `features/projects/lib/projects.ts`.
- Existing developer avatar at `public/avatar.jpeg`.
- No confirmed testimonials, customer logos, external press, or benchmark data; future work must not fabricate them.

## Product Principles

- Make capability legible before asking visitors to act.
- Show evidence through real projects and engineering context.
- Keep contact and evaluation paths direct.
- Let the owner maintain accurate content without code changes.
- Preserve trust by distinguishing documented facts from illustrative content.
