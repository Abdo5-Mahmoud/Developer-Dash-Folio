"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectCardData } from "../types/project";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const [imageFailed, setImageFailed] = React.useState(false);

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:border-border-strong hover:shadow-(--shadow-token-md)">
      {/* Thumbnail / Image container */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-surface-sunken">
        {project.coverImage && !imageFailed ? (
          <Image
            src={project.coverImage}
            alt={project.coverImageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center font-mono text-xs text-muted-foreground">
            <ImageIcon className="h-5 w-5 text-muted-foreground/60" aria-hidden="true" />
            <span className="font-medium text-foreground/80">
              {project.coverImageAlt}
            </span>
          </div>
        )}

        {/* Category tag */}
        {project.category && (
          <div className="absolute left-3 top-3">
            <Badge
              variant="outline"
              className="bg-surface/85 text-[11px] font-medium shadow-sm backdrop-blur-sm"
            >
              {project.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
            <Link
              href={`/projects/${project.slug}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {project.title}
            </Link>
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.map((t) => (
              <Badge key={t} variant="neutral" className="text-[11px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="gap-1.5 text-xs font-medium"
          >
            <Link href={`/projects/${project.slug}`}>
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </Link>
          </Button>

          <div className="flex items-center gap-1">
            {project.githubUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} source code on GitHub`}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}

            {project.liveUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open live demo of ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
