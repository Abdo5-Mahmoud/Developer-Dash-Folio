import { PROJECTS } from "../data/projects";
import type { Project, ProjectCardData } from "../types/project";

export async function getAllProjects(
  includeUnpublished = false
): Promise<Project[]> {
  return PROJECTS
    .filter((p) => includeUnpublished || p.status === "published")
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getAllProjectCardData(): Promise<ProjectCardData[]> {
  const all = await getAllProjects();
  return all.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category ?? "Full Stack",
    coverImage: p.coverImage,
    coverImageAlt: `${p.title} project cover image`,
    tech: p.techStack.map((t) => t.name),
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    featured: p.featured,
  }));
}

export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  const all = await getAllProjects();
  return all
    .filter((p) => p.featured)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category ?? "Full Stack",
      coverImage: p.coverImage,
    coverImageAlt: `${p.title} project cover image`,
      tech: p.techStack.map((t) => t.name),
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      featured: p.featured,
    }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return PROJECTS.find((p) => p.slug === slug && p.status === "published") ?? null;
}
