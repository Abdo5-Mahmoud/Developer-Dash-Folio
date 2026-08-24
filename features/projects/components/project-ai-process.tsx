import { AIMistakeEntry, AIPromptEntry } from "./entry-cards";
import type { Project } from "../types/project";

export function ProjectAIProcess({ project }: { project: Project }) {
  if (project.aiPrompts.length === 0 && project.aiMistakes.length === 0) {
    return null;
  }

  return (
    <section id="ai-workflow" className="space-y-8 scroll-mt-20" aria-labelledby="ai-workflow-heading">
      <div>
        <h2
          id="ai-workflow-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          AI Development Process
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Prompts and review corrections from this case study.
        </p>
      </div>

      {project.aiPrompts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Prompts Used</h3>
          <div className="space-y-5">
            {project.aiPrompts.map((prompt) => (
              <AIPromptEntry key={prompt.purpose} {...prompt} />
            ))}
          </div>
        </div>
      )}

      {project.aiMistakes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            AI Mistakes and Corrections
          </h3>
          <div className="space-y-4">
            {project.aiMistakes.map((mistake) => (
              <AIMistakeEntry key={mistake.mistake} {...mistake} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
