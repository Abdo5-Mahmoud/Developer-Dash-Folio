import { PROFILE_CONTACT } from "@/features/contact/data/contact";
import { getAllProjects } from "@/features/projects/lib/projects";
import { SKILL_CATEGORIES, TECHNOLOGIES } from "@/features/home/data/skills";
import { ABOUT_HIGHLIGHTS } from "@/features/about/data/about";

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

export async function getPortfolioKnowledge(): Promise<PortfolioKnowledge> {
  const projects = await getAllProjects();

  return {
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
    projects: projects.map((project) => ({
      title: project.title,
      summary: project.summary,
      technologies: project.techStack.map((entry) => entry.name),
    })),
  };
}
