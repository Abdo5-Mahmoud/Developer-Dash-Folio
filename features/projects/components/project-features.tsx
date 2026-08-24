import { CheckCircle2 } from "lucide-react";
import type { Project } from "../types/project";

export function ProjectFeatures({ project }: { project: Project }) {
  if (!project.features || project.features.length === 0) {
    return null;
  }

  return (
    <article aria-labelledby="features-heading" className="space-y-4">
      <h2
        id="features-heading"
        className="text-xl font-semibold tracking-tight text-foreground"
      >
        Key Features
      </h2>
      <ul className="grid gap-3 sm:grid-cols-1">
        {project.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-surface/40 p-3.5 text-sm text-foreground/90 transition-colors hover:border-border hover:bg-surface"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
