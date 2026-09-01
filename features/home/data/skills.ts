import type { SkillCategory } from "../types/skill";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend Core",
    skills: [
      { name: "JavaScript (ES6+)" },
      { name: "TypeScript", projects: ["Devfolio AI"] },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Responsive Design" },
      { name: "Accessibility" },
    ],
  },
  {
    category: "React / Next.js",
    skills: [
      { name: "React", projects: ["Devfolio AI"] },
      { name: "Next.js", projects: ["Devfolio AI"] },
      { name: "React Router DOM" },
      { name: "Next.js App Router", projects: ["Devfolio AI"] },
      { name: "Server Actions" },
    ],
  },
  {
    category: "State & Data",
    skills: [
      { name: "Redux Toolkit" },
      { name: "TanStack Query", projects: ["Pulse Analytics"] },
      { name: "Context API" },
    ],
  },
  {
    category: "UI & Visualization",
    skills: [
      { name: "Tailwind CSS", projects: ["Devfolio AI"] },
      { name: "Recharts", projects: ["Pulse Analytics"] },
      { name: "Framer Motion", projects: ["Devfolio AI"] },
      { name: "GSAP" },
    ],
  },
  {
    category: "Forms & Validation",
    skills: [
      { name: "React Hook Form" },
      { name: "Zod", projects: ["Auth Gateway Service"] },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", projects: ["Collaborative Canvas"] },
      { name: "Express.js", projects: ["Auth Gateway Service"] },
      { name: "REST APIs" },
      { name: "Axios" },
      { name: "JWT Authentication", projects: ["Auth Gateway Service"] },
    ],
  },
  {
    category: "Database / Backend Services",
    skills: [
      { name: "MongoDB", projects: ["Devfolio AI"] },
      { name: "Supabase" },
    ],
  },
  {
    category: "Real-time",
    skills: [{ name: "Socket.IO", projects: ["Collaborative Canvas"] }],
  },
  {
    category: "Testing",
    skills: [{ name: "Jest" }, { name: "React Testing Library" }],
  },
  {
    category: "Tools / Deployment",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Vercel" },
      { name: "Netlify" },
    ],
  },
];