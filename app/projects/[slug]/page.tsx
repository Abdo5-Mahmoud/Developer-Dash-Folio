import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProjectBySlug,
  getAllProjects,
} from "@/features/projects/lib/projects";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectOverview } from "@/features/projects/components/project-overview";
import { ProjectFeatures } from "@/features/projects/components/project-features";
import { ProjectScreenshots } from "@/features/projects/components/project-screenshots";
import { ProjectTechStack } from "@/features/projects/components/project-tech-stack";
import { ProjectArchitecture } from "@/features/projects/components/project-architecture";
import { ProjectEngineeringEvidence } from "@/features/projects/components/project-engineering-evidence";
import { ProjectAIProcess } from "@/features/projects/components/project-ai-process";
import { Separator } from "@/components/ui/separator";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
  };
}

export default async function page({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Project Header & Hero Cover */}
        <ProjectHeader project={project} />

        {/* Main Content Composition Grid */}
        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Primary Column: Overview, Key Features, Screenshots */}
            <div className="space-y-12 lg:col-span-8">
              <ProjectOverview project={project} />

              {project.features && project.features.length > 0 && (
                <>
                  <Separator />
                  <ProjectFeatures project={project} />
                </>
              )}

              {(project.folderStructure ||
                project.architectureExplanation ||
                project.dataFlow) && (
                <>
                  <Separator />
                  <ProjectArchitecture project={project} />
                </>
              )}

              {(project.reactPatterns.length > 0 ||
                project.algorithms.length > 0 ||
                project.performanceOptimizations.length > 0 ||
                project.challenges.length > 0 ||
                project.lessonsLearned ||
                project.engineeringDecisions.length > 0) && (
                <>
                  <Separator />
                  <ProjectEngineeringEvidence project={project} />
                </>
              )}

              {(project.aiPrompts.length > 0 || project.aiMistakes.length > 0) && (
                <>
                  <Separator />
                  <ProjectAIProcess project={project} />
                </>
              )}

              {project.gallery.length > 0 && (
                <>
                  <Separator />
                  <ProjectScreenshots project={project} />
                </>
              )}
            </div>

            {/* Sidebar Column: Tech Stack & Project Links */}
            <aside className="space-y-6 lg:col-span-4">
              <ProjectTechStack project={project} />
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
