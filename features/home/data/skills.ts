import type { Skill, SkillCategory, Technology } from "../types/skill";

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

export const TECHNOLOGIES: Technology[] = [
  { id: "t1", name: "Next.js", category: "Frontend" },
  { id: "t2", name: "React", category: "Frontend" },
  { id: "t3", name: "TypeScript", category: "Frontend" },
  { id: "t4", name: "MongoDB", category: "Database" },
  { id: "t5", name: "Tailwind CSS", category: "Frontend" },
  { id: "t6", name: "Claude API", category: "AI Tooling" },
  { id: "t7", name: "Node.js", category: "Backend" },
  { id: "t8", name: "Docker", category: "DevOps" },
  { id: "t9", name: "Recharts", category: "Frontend" },
  { id: "t10", name: "TanStack Query", category: "Frontend" },
  { id: "t11", name: "Socket.IO", category: "Backend" },
  { id: "t12", name: "Express.js", category: "Backend" },
  { id: "t13", name: "Zod", category: "Backend" },
];

export const SKILLS: Skill[] = [
  {
    id: "s1",
    name: "System Design",
    category: "Concept",
    proficiency: "Proficient",
  },
  { id: "s2", name: "React", category: "Framework", proficiency: "Expert" },
  {
    id: "s3",
    name: "AI-assisted development",
    category: "Concept",
    proficiency: "Expert",
  },
  {
    id: "s4",
    name: "Performance optimization",
    category: "Concept",
    proficiency: "Proficient",
  },
];
