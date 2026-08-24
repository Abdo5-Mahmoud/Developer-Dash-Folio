import {
  ChallengeEntry,
  DecisionCard,
  PatternEntry,
} from "./entry-cards";
import type { Project } from "../types/project";

export function ProjectEngineeringEvidence({ project }: { project: Project }) {
  const hasContent =
    project.reactPatterns.length > 0 ||
    project.algorithms.length > 0 ||
    project.performanceOptimizations.length > 0 ||
    project.challenges.length > 0 ||
    Boolean(project.lessonsLearned) ||
    project.engineeringDecisions.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="space-y-12" aria-label="Engineering evidence">
      {project.reactPatterns.length > 0 && (
        <article id="react-patterns" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            React Patterns
          </h2>
          <div className="grid gap-3">
            {project.reactPatterns.map((pattern) => (
              <PatternEntry key={pattern.name} {...pattern} />
            ))}
          </div>
        </article>
      )}

      {project.algorithms.length > 0 && (
        <article id="algorithms" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Algorithms and Data Structures
          </h2>
          <div className="grid gap-3">
            {project.algorithms.map((algorithm) => (
              <div
                key={algorithm.name}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono text-sm font-medium text-accent">
                    {algorithm.name}
                  </h3>
                  {algorithm.complexity && (
                    <span className="text-xs text-muted-foreground">
                      {algorithm.complexity}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {algorithm.rationale}
                </p>
              </div>
            ))}
          </div>
        </article>
      )}

      {project.engineeringDecisions.length > 0 && (
        <article id="engineering-decisions" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Engineering Decisions
          </h2>
          <div className="grid gap-4">
            {project.engineeringDecisions.map((decision) => (
              <DecisionCard key={decision.decision} {...decision} />
            ))}
          </div>
        </article>
      )}

      {project.performanceOptimizations.length > 0 && (
        <article id="performance" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Performance
          </h2>
          <dl className="grid gap-3">
            {project.performanceOptimizations.map((optimization) => (
              <div
                key={optimization.technique}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <dt className="text-sm font-medium text-foreground">
                  {optimization.technique}
                </dt>
                {optimization.impact && (
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {optimization.impact}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </article>
      )}

      {project.challenges.length > 0 && (
        <article id="challenges" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Challenges
          </h2>
          <div className="grid gap-3">
            {project.challenges.map((challenge) => (
              <ChallengeEntry key={challenge.challenge} {...challenge} />
            ))}
          </div>
        </article>
      )}

      {project.lessonsLearned && (
        <article id="learnings" className="space-y-4 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Lessons Learned
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {project.lessonsLearned}
          </p>
        </article>
      )}
    </section>
  );
}
