import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface ProjectCardData {
  slug: string;
  title: string;
  summary: string;
  coverImageAlt: string;
  tech: string[];
  featured?: boolean;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card className="overflow-hidden transition-colors group-hover:border-border-strong">
        <div className="flex aspect-video items-center justify-center border-b border-border bg-surface-sunken font-mono text-xs text-muted-foreground">
          {project.coverImageAlt}
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {project.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.slice(0, 4).map((t) => (
              <Badge key={t} variant="neutral">
                {t}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="outline">+{project.tech.length - 4}</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
