import { PROFILE_CONTACT } from "@/features/contact/data/contact";
import { PROJECTS } from "@/features/projects/data/projects";
import { SKILL_CATEGORIES, TECHNOLOGIES } from "@/features/home/data/skills";
import { ABOUT_HIGHLIGHTS } from "@/features/about/data/about";

// Temporary feature-owned snapshot of already-published portfolio data.
// The future AI/backend layer replaces this with a knowledge/API source;
// consumers only depend on the shape below.
export interface ProjectKnowledge {
  title: string;
  summary: string;
  technologies: string[];
}

export interface PortfolioKnowledge {
  owner: {
    name: string;
    role: string;
    bio: string[];
  };
  contact: {
    email: string;
    githubUrl: string;
    linkedInUrl: string;
  };
  skillCategories: { category: string; skills: string[] }[];
  technologies: string[];
  projects: ProjectKnowledge[];
}

const publishedProjects = PROJECTS.filter(
  (project) => project.status === "published",
);

export const PORTFOLIO_KNOWLEDGE: PortfolioKnowledge = {
  owner: {
    name: PROFILE_CONTACT.name,
    role: "Software engineer specializing in frontend and full-stack web development",
    bio: ABOUT_HIGHLIGHTS.map((highlight) => highlight.description),
  },
  contact: {
    email: PROFILE_CONTACT.email,
    githubUrl: PROFILE_CONTACT.githubUrl,
    linkedInUrl: PROFILE_CONTACT.linkedInUrl,
  },
  skillCategories: SKILL_CATEGORIES.map((group) => ({
    category: group.category,
    skills: group.skills.map((skill) => skill.name),
  })),
  technologies: TECHNOLOGIES.map((technology) => technology.name),
  projects: publishedProjects.map((project) => ({
    title: project.title,
    summary: project.summary,
    technologies: project.techStack.map((entry) => entry.name),
  })),
};
