import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Project } from "../types/project";

export function ProjectTechStack({ project }: { project: Project }) {
  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Tech Stack section */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-4 w-4" aria-hidden="true" />
              Technologies Used
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Badge key={tech.technologyId} variant="neutral">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Category & Status */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {project.category || "Full Stack"}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <p className="mt-0.5 text-sm font-medium capitalize text-foreground">
                {project.status}
              </p>
            </div>
          </div>

          <Separator />

          {/* Project Links in Sidebar */}
          <div className="space-y-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Project Links
            </span>
            <div className="flex flex-col gap-2 pt-1">
              {project.liveUrl && (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="w-full justify-between"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open live demo for ${project.title}`}
                  >
                    Live Demo
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full justify-between"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} repository on GitHub`}
                  >
                    GitHub Repository
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              )}

              {!project.liveUrl && !project.githubUrl && (
                <p className="text-xs text-muted-foreground">
                  Private repository or internal deployment.
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Return button */}
      <div className="pt-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to All Projects
          </Link>
        </Button>
      </div>
    </>
  );
}
