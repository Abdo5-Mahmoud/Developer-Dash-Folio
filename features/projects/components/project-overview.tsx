import type { Project } from "../types/project";

export function ProjectOverview({ project }: { project: Project }) {
  return (
    <article aria-labelledby="overview-heading" className="space-y-4">
      <h2
        id="overview-heading"
        className="text-xl font-semibold tracking-tight text-foreground"
      >
        Project Overview
      </h2>
      <div className="prose-docs text-base leading-relaxed text-muted-foreground">
        <p>{project.fullDescription}</p>
      </div>
    </article>
  );
}
