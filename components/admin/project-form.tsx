"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { RepeatableField } from "@/components/admin/repeatable-field";
import type {
  Project,
  PatternEntry,
  AlgorithmEntry,
  PerformanceEntry,
  ChallengeEntry,
  AIPromptEntry,
  AIMistakeEntry,
  DecisionEntry,
} from "@/lib/types";

// A partial, form-shaped version of Project — id/timestamps are server-assigned.
export type ProjectFormValues = Omit<Project, "id" | "createdAt" | "updatedAt">;

export function ProjectForm({
  initialValues,
  onSubmit,
}: {
  initialValues: ProjectFormValues;
  onSubmit: (values: ProjectFormValues, status: "draft" | "published") => void;
}) {
  const [values, setValues] = React.useState<ProjectFormValues>(initialValues);

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const requiredMissing = !values.title || !values.summary || values.techStack.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {values.title || "New project"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Slug: <span className="font-mono">{values.slug || "auto-generated"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onSubmit(values, "draft")}>
            Save draft
          </Button>
          <Button disabled={requiredMissing} onClick={() => onSubmit(values, "published")}>
            Publish
          </Button>
        </div>
      </div>

      {requiredMissing && (
        <Callout type="warning" title="Before you publish">
          Title, summary, and at least one technology are required.
        </Callout>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="tech">Tech & Skills</TabsTrigger>
          <TabsTrigger value="architecture">Architecture & Code</TabsTrigger>
          <TabsTrigger value="ai">AI Workflow</TabsTrigger>
          <TabsTrigger value="decisions">Decisions & Learnings</TabsTrigger>
        </TabsList>

        {/* ---------------- Overview ---------------- */}
        <TabsContent value="overview" className="flex flex-col gap-5">
          <Field label="Title">
            <Input value={values.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Summary" hint="Shown on cards and the listing page — 1–2 sentences.">
            <Textarea rows={2} value={values.summary} onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field label="Full description">
            <Textarea
              rows={6}
              value={values.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="GitHub repository">
              <Input value={values.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} />
            </Field>
            <Field label="Live demo">
              <Input value={values.liveUrl ?? ""} onChange={(e) => set("liveUrl", e.target.value)} />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured on home page
            </label>
          </div>
        </TabsContent>

        {/* ---------------- Media ---------------- */}
        <TabsContent value="media" className="flex flex-col gap-5">
          <Field label="Cover image" hint="Required to appear on the listing grid.">
            <UploadDropzone label="Upload cover image" />
          </Field>
          <Field label="Gallery" hint="Additional screenshots/diagrams, each with an optional caption.">
            <UploadDropzone label="Add gallery image" multiple />
          </Field>
        </TabsContent>

        {/* ---------------- Tech & Skills ---------------- */}
        <TabsContent value="tech" className="flex flex-col gap-6">
          <Field label="Tech stack" hint="Select from Manage Technologies — required, at least one.">
            <div className="flex flex-wrap gap-2">
              {values.techStack.map((t) => (
                <Badge key={t.technologyId} variant="neutral">
                  {t.name}
                </Badge>
              ))}
              <Button type="button" variant="outline" size="sm">
                + Add technology
              </Button>
            </div>
          </Field>
          <Field label="Related skills" hint="Select from Manage Skills — used for site-wide filtering.">
            <Button type="button" variant="outline" size="sm" className="w-fit">
              + Add skill
            </Button>
          </Field>
        </TabsContent>

        {/* ---------------- Architecture & Code ---------------- */}
        <TabsContent value="architecture" className="flex flex-col gap-6">
          <Field label="Folder structure" hint="Monospace tree — paste your project's structure.">
            <Textarea
              rows={6}
              className="font-mono text-xs"
              value={values.folderStructure ?? ""}
              onChange={(e) => set("folderStructure", e.target.value)}
            />
          </Field>
          <Field label="Architecture explanation">
            <Textarea
              rows={4}
              value={values.architectureExplanation ?? ""}
              onChange={(e) => set("architectureExplanation", e.target.value)}
            />
          </Field>
          <Field label="Data flow">
            <Textarea
              rows={4}
              value={values.dataFlow ?? ""}
              onChange={(e) => set("dataFlow", e.target.value)}
            />
          </Field>

          <Field label="React patterns used">
            <RepeatableField<PatternEntry>
              items={values.reactPatterns}
              onChange={(items) => set("reactPatterns", items)}
              emptyItem={{ name: "", rationale: "" }}
              addLabel="Add pattern"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Pattern name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
                  <Textarea placeholder="Why this pattern" rows={2} value={item.rationale} onChange={(e) => update({ rationale: e.target.value })} />
                </div>
              )}
            />
          </Field>

          <Field label="Algorithms used">
            <RepeatableField<AlgorithmEntry>
              items={values.algorithms}
              onChange={(items) => set("algorithms", items)}
              emptyItem={{ name: "", rationale: "" }}
              addLabel="Add algorithm"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Algorithm name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
                  <Input placeholder="Complexity (optional)" value={item.complexity ?? ""} onChange={(e) => update({ complexity: e.target.value })} />
                  <Textarea placeholder="Why used" rows={2} value={item.rationale} onChange={(e) => update({ rationale: e.target.value })} />
                </div>
              )}
            />
          </Field>

          <Field label="Performance optimizations">
            <RepeatableField<PerformanceEntry>
              items={values.performanceOptimizations}
              onChange={(items) => set("performanceOptimizations", items)}
              emptyItem={{ technique: "" }}
              addLabel="Add optimization"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Technique" value={item.technique} onChange={(e) => update({ technique: e.target.value })} />
                  <Input placeholder="Measured/estimated impact" value={item.impact ?? ""} onChange={(e) => update({ impact: e.target.value })} />
                </div>
              )}
            />
          </Field>

          <Field label="Challenges">
            <RepeatableField<ChallengeEntry>
              items={values.challenges}
              onChange={(items) => set("challenges", items)}
              emptyItem={{ challenge: "", resolution: "" }}
              addLabel="Add challenge"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Challenge" value={item.challenge} onChange={(e) => update({ challenge: e.target.value })} />
                  <Textarea placeholder="How it was resolved" rows={2} value={item.resolution} onChange={(e) => update({ resolution: e.target.value })} />
                </div>
              )}
            />
          </Field>
        </TabsContent>

        {/* ---------------- AI Workflow ---------------- */}
        <TabsContent value="ai" className="flex flex-col gap-6">
          <Callout type="info">
            This is the differentiating section — be specific. Paste real prompts, not
            paraphrases.
          </Callout>

          <Field label="AI prompts used">
            <RepeatableField<AIPromptEntry>
              items={values.aiPrompts}
              onChange={(items) => set("aiPrompts", items)}
              emptyItem={{ purpose: "", prompt: "" }}
              addLabel="Add prompt"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Purpose / context" value={item.purpose} onChange={(e) => update({ purpose: e.target.value })} />
                  <Textarea placeholder="Exact prompt text" rows={3} className="font-mono text-xs" value={item.prompt} onChange={(e) => update({ prompt: e.target.value })} />
                </div>
              )}
            />
          </Field>

          <Field label="AI mistakes">
            <RepeatableField<AIMistakeEntry>
              items={values.aiMistakes}
              onChange={(items) => set("aiMistakes", items)}
              emptyItem={{ mistake: "", caughtBy: "", correction: "" }}
              addLabel="Add mistake"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="What AI got wrong" value={item.mistake} onChange={(e) => update({ mistake: e.target.value })} />
                  <Input placeholder="How it was caught" value={item.caughtBy} onChange={(e) => update({ caughtBy: e.target.value })} />
                  <Textarea placeholder="Correction made" rows={2} value={item.correction} onChange={(e) => update({ correction: e.target.value })} />
                </div>
              )}
            />
          </Field>
        </TabsContent>

        {/* ---------------- Decisions & Learnings ---------------- */}
        <TabsContent value="decisions" className="flex flex-col gap-6">
          <Field label="Engineering decisions">
            <RepeatableField<DecisionEntry>
              items={values.engineeringDecisions}
              onChange={(items) => set("engineeringDecisions", items)}
              emptyItem={{ decision: "", alternatives: [], rationale: "" }}
              addLabel="Add decision"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Decision" value={item.decision} onChange={(e) => update({ decision: e.target.value })} />
                  <Input
                    placeholder="Alternatives considered (comma-separated)"
                    value={item.alternatives.join(", ")}
                    onChange={(e) => update({ alternatives: e.target.value.split(",").map((s) => s.trim()) })}
                  />
                  <Textarea placeholder="Why this was chosen" rows={2} value={item.rationale} onChange={(e) => update({ rationale: e.target.value })} />
                </div>
              )}
            />
          </Field>

          <Field label="Lessons learned">
            <Textarea
              rows={4}
              value={values.lessonsLearned ?? ""}
              onChange={(e) => set("lessonsLearned", e.target.value)}
            />
          </Field>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function UploadDropzone({ label, multiple }: { label: string; multiple?: boolean }) {
  return (
    <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong text-sm text-muted-foreground hover:bg-surface-hover">
      <span>{label}</span>
      <span className="text-xs">PNG, JPG, or WebP — up to 5MB</span>
      <input type="file" accept="image/*" multiple={multiple} className="hidden" />
    </label>
  );
}
