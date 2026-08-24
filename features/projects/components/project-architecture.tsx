import { CodeBlock } from "@/components/ui/code-block";
import type { Project } from "../types/project";

export function ProjectArchitecture({ project }: { project: Project }) {
  if (!project.folderStructure && !project.architectureExplanation && !project.dataFlow) {
    return null;
  }

  return (
    <section className="space-y-12" aria-label="Architecture documentation">
      {project.architectureExplanation && (
        <article id="architecture" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Architecture
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {project.architectureExplanation}
          </p>
        </article>
      )}

      {project.folderStructure && (
        <article id="folder-structure" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Folder Structure
          </h2>
          <CodeBlock
            code={project.folderStructure}
            language="text"
            filename="project-structure.txt"
          />
        </article>
      )}

      {project.dataFlow && (
        <article id="data-flow" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Data Flow
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {project.dataFlow}
          </p>
        </article>
      )}
    </section>
  );
}
