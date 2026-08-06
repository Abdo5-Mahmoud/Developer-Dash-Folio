import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

/** Engineering decision — ADR style: decision, alternatives considered, why chosen */
export function DecisionCard({
  decision,
  alternatives,
  rationale,
}: {
  decision: string;
  alternatives: string[];
  rationale: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{decision}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Alternatives considered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {alternatives.map((a) => (
              <Badge key={a} variant="outline">
                {a}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why this was chosen
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">{rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/** React pattern used — name + rationale */
export function PatternEntry({ name, rationale }: { name: string; rationale: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
      <p className="font-mono text-sm font-medium text-accent">{name}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{rationale}</p>
    </div>
  );
}

/** Challenge + resolution */
export function ChallengeEntry({ challenge, resolution }: { challenge: string; resolution: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm font-medium text-foreground">{challenge}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">→ {resolution}</p>
    </div>
  );
}

/** AI prompt used — rendered in the signature CodeBlock for credibility */
export function AIPromptEntry({ purpose, prompt }: { purpose: string; prompt: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{purpose}</p>
      <CodeBlock code={prompt} language="prompt" filename="prompt.txt" showLineNumbers={false} />
    </div>
  );
}

/** AI mistake — what went wrong, how it was caught, the correction. Visually distinct (danger accent). */
export function AIMistakeEntry({
  mistake,
  caughtBy,
  correction,
}: {
  mistake: string;
  caughtBy: string;
  correction: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-danger/25">
      <div className="bg-danger-muted px-4 py-2.5">
        <p className="text-sm font-medium text-danger">{mistake}</p>
      </div>
      <div className="flex flex-col gap-2 bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Caught by</p>
        <p className="text-sm text-foreground/90">{caughtBy}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Correction</p>
        <p className="text-sm text-foreground/90">{correction}</p>
      </div>
    </div>
  );
}
