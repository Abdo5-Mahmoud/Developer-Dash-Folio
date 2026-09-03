import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectImage } from "./project-image";
import type { Project } from "../types/project";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <>
      {/* Top Header & Breadcrumb Container */}
      <section className="border-b border-border bg-surface-sunken/30">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to projects
            </Link>
          </div>

          {/* Category & Status */}
          <div className="flex flex-wrap items-center gap-2">
            {project.category && (
              <Badge variant="outline">{project.category}</Badge>
            )}
            <Badge variant="neutral" className="capitalize">
              {project.status}
            </Badge>
          </div>

          {/* Title & Summary */}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          {/* Primary Header Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <Button asChild size="md">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open live demo for ${project.title}`}
                >
                  Live Demo
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}

            {project.githubUrl && (
              <Button asChild size="md" variant="secondary">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} source code on GitHub`}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Source Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {project.coverImage && (
        <section className="mx-auto max-w-5xl px-6 pt-10">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-token-sm) md:aspect-21/9">
            <ProjectImage
              src={project.coverImage}
              alt={
                project.coverImageAlt ?? `${project.title} project cover image`
              }
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </section>
      )}
    </>
  );
}
