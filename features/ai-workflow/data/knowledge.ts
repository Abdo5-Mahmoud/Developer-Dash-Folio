import { PROFILE_CONTACT } from "@/features/contact/data/contact";
import { getProjectKnowledgeDigests } from "@/features/projects/lib/projects";
import { getSkillCategories } from "@/features/home/lib/skills";
import { getAllTechnologies } from "@/features/home/lib/technologies";
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
  const [projects, technologies, skillCategories] = await Promise.all([
    getProjectKnowledgeDigests(),
    getAllTechnologies(),
    getSkillCategories(),
  ]);

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
    skillCategories: skillCategories.map((group) => ({
      category: group.category,
      skills: group.skills.map((skill) => skill.name),
    })),
    technologies: technologies.map((technology) => technology.name),
    projects,
  };
}
