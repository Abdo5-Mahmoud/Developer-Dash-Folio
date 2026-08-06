# Devfolio AI 🚀

A modern developer portfolio and engineering knowledge base built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. 

Unlike standard developer portfolios that only show *what* was built, Devfolio AI is engineered like a public technical wiki. It breaks down architectural decisions, trade-offs, algorithms, performance metrics, and the practical AI-assisted workflow (including prompts, iterations, and corrections) behind each project.

> **Status:** 🛠️ **Phase 1 in progress**  
> The core design system and **Home Page** are live! Full project case studies, AI workflow deep-dives, and the admin content system are being rolled out next.

---

## 💡 The Vision

Most portfolios read like static resumes. Devfolio AI is designed for hiring managers, tech leads, and fellow engineers who care about **how you think**:
- **Engineering Judgment over Hype:** Showing trade-offs, system boundaries, and code rationale.
- **Transparent AI Collaboration:** Documenting how AI was leveraged as a pair programmer — and where human oversight corrected AI mistakes.
- **Low-Friction & Scale:** Built to easily expand from a few highlight projects to a comprehensive engineering knowledge base.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI & React:** React 19, TypeScript
- **Styling:** Tailwind CSS v4 (with `@theme inline` design tokens & dark-mode by default)
- **Primitives & Icons:** Radix UI (`@radix-ui/react-slot`, `tabs`, `avatar`, `tooltip`, etc.), Lucide React
- **Animations:** Framer Motion

---

## 📍 Project Roadmap & Current Phase

- [x] **Phase 1: Foundation & Home Page**
  - Dark-first Vercel/Linear-inspired visual design system (`app/globals.css`).
  - Home Page with Hero section, technology highlight strip, and featured project cards (`components/home/hero.tsx`, `app/page.tsx`).
  - Accessible navigation bar and site footer.
- [ ] **Phase 2: Project Case Studies (`/projects` & `/projects/[slug]`)**
  - Full structured architectural breakdowns for each project.
- [ ] **Phase 3: AI Development Workflow (`/ai-workflow`)**
  - Dedicated page detailing AI-assisted development methodology and real-world prompt breakdowns.
- [ ] **Phase 4: Admin Dashboard & CMS (`/dashboard`)**
  - Protected admin routes to quickly add/edit projects, technologies, and skills.

---

## 📂 Documentation & Specs

All architectural blueprints and product specs are documented in detail inside the [`docs`](file:///c:/Users/A5/Desktop/cv-project/devfolio/docs) directory:

- [PRD (Product Requirements Document)](file:///c:/Users/A5/Desktop/cv-project/devfolio/docs/prd.md) — Product goals, personas, and feature definitions.
- [Information Architecture](file:///c:/Users/A5/Desktop/cv-project/devfolio/docs/information-architecture.md) — Sitemap, routing patterns, and data flow.
- [Page Assembly Specification](file:///c:/Users/A5/Desktop/cv-project/devfolio/docs/page-assembly-specification.md) — UI composition rules across public and admin pages.
- [Hero Specification](file:///c:/Users/A5/Desktop/cv-project/devfolio/hero-feature-specification.md) — Specific component design for the hero section.

---

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdo5-Mahmoud/Developer-Dash-Folio.git
   cd devfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧱 Design System Highlights

- **Palette:** Neutral dark background (`#09090b`), subtle hairlines (`#232327`), paired with a single focused blue accent (`#3e7bfa`).
- **Signature Component:** `CodeBlock` — built to render technical code, CLI commands, and prompts with window chrome controls, line numbers, and copy functionality.
- **Theme Support:** Dark mode by default, backed by Next Themes and clean CSS variable mappings.

---

*Crafted with precision by [Abdullah Mahmoud](https://github.com/Abdo5-Mahmoud)*
