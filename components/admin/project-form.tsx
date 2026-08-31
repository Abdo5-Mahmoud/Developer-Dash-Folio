"use client";

import * as React from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { RepeatableField } from "@/components/admin/repeatable-field";
import type {
  ProjectInput,
  ProjectStatus,
  Skill,
  Technology,
} from "@/lib/types";
import type {
  AIPromptEntry,
  AIMistakeEntry,
  AlgorithmEntry,
  ChallengeEntry,
  DecisionEntry,
  GalleryImage,
  PatternEntry,
  PerformanceEntry,
  StackEntry,
} from "@/lib/types";

export type ProjectFormValues = ProjectInput;

export function ProjectForm({
  initialValues,
  technologies,
  skills,
  onSubmit,
}: {
  initialValues: ProjectFormValues;
  technologies: Technology[];
  skills: Skill[];
  onSubmit: (values: ProjectFormValues, status: ProjectStatus) => Promise<void>;
}) {
  const [values, setValues] = React.useState<ProjectFormValues>(initialValues);
  const [savingStatus, setSavingStatus] = React.useState<ProjectStatus | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(status: ProjectStatus) {
    setError(null);
    setSavingStatus(status);
    try {
      await onSubmit(values, status);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to save project.",
      );
    } finally {
      setSavingStatus(null);
    }
  }

  function toggleTechnology(technology: Technology) {
    const exists = values.techStack.some(
      (item) => item.technologyId === technology.id,
    );
    const next = exists
      ? values.techStack.filter((item) => item.technologyId !== technology.id)
      : [
          ...values.techStack,
          { technologyId: technology.id, name: technology.name },
        ];
    set("techStack", next);
  }

  function toggleSkill(skill: Skill) {
    const exists = values.skillIds.includes(skill.id);
    const next = exists
      ? values.skillIds.filter((id) => id !== skill.id)
      : [...values.skillIds, skill.id];
    set("skillIds", next);
  }

  function updateGallery(index: number, patch: Partial<GalleryImage>) {
    const next = [...values.gallery];
    next[index] = { ...next[index], ...patch };
    set("gallery", next);
  }

  const requiredMissing =
    !values.title.trim() ||
    !values.summary.trim() ||
    !values.fullDescription.trim() ||
    values.techStack.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="wrap-break-words text-2xl font-semibold text-foreground">
            {values.title || "New project"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Slug:{" "}
            <span className="font-mono">{values.slug || "auto-generated"}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="secondary"
            loading={savingStatus === "draft"}
            onClick={() => submit("draft")}
          >
            Save draft
          </Button>
          <Button
            disabled={requiredMissing}
            loading={savingStatus === "published"}
            onClick={() => submit("published")}
          >
            Publish
          </Button>
        </div>
      </div>

      {error && (
        <Callout type="danger" title="Save failed">
          {error}
        </Callout>
      )}

      {requiredMissing && (
        <Callout type="warning" title="Before you publish">
          Title, summary, full description, and at least one technology are
          required.
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

        <TabsContent value="overview" className="flex flex-col gap-5">
          <Field label="Title">
            <Input
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field
            label="Slug"
            hint="Optional on create. Existing project slugs stay stable."
          >
            <Input
              value={values.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category">
              <Input
                value={values.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
              />
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                min={0}
                value={values.displayOrder}
                onChange={(e) =>
                  set("displayOrder", Number(e.target.value) || 0)
                }
              />
            </Field>
          </div>
          <Field
            label="Summary"
            hint="Shown on cards and the listing page - 1 or 2 sentences."
          >
            <Textarea
              rows={2}
              value={values.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
          <Field label="Full description">
            <Textarea
              rows={6}
              value={values.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
            />
          </Field>
          <Field label="Features" hint="One feature per line.">
            <Textarea
              rows={4}
              value={(values.features ?? []).join("\n")}
              onChange={(e) =>
                set(
                  "features",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="GitHub repository">
              <Input
                value={values.githubUrl ?? ""}
                onChange={(e) => set("githubUrl", e.target.value)}
              />
            </Field>
            <Field label="Live demo">
              <Input
                value={values.liveUrl ?? ""}
                onChange={(e) => set("liveUrl", e.target.value)}
              />
            </Field>
          </div>
          <label className="flex w-fit items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured on home page
          </label>
        </TabsContent>

        <TabsContent value="media" className="flex flex-col gap-5">
          <Field
            label="Cover image URL"
            hint="Used by cards and the project header."
          >
            <Input
              value={values.coverImage ?? ""}
              onChange={(e) => set("coverImage", e.target.value)}
            />
          </Field>
          <Field label="Cover image alt text">
            <Input
              value={values.coverImageAlt ?? ""}
              onChange={(e) => set("coverImageAlt", e.target.value)}
            />
          </Field>
          <Field label="Gallery" hint="Additional screenshots or diagrams.">
            <div className="flex flex-col gap-3">
              {values.gallery.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_1fr_auto]"
                >
                  <Input
                    placeholder="Image URL"
                    value={item.url}
                    onChange={(e) =>
                      updateGallery(index, { url: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Alt text"
                    value={item.alt}
                    onChange={(e) =>
                      updateGallery(index, { alt: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove gallery image"
                    onClick={() =>
                      set(
                        "gallery",
                        values.gallery.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Input
                    className="md:col-span-2"
                    placeholder="Caption"
                    value={item.caption ?? ""}
                    onChange={(e) =>
                      updateGallery(index, { caption: e.target.value })
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-fit"
                onClick={() =>
                  set("gallery", [...values.gallery, { url: "", alt: "" }])
                }
              >
                <Plus className="h-4 w-4" /> Add gallery image
              </Button>
            </div>
          </Field>
        </TabsContent>

        <TabsContent value="tech" className="flex flex-col gap-6">
          <Field label="Tech stack" hint="Required before publishing.">
            <ChoiceGrid
              items={technologies}
              isSelected={(item) =>
                values.techStack.some(
                  (selected) => selected.technologyId === item.id,
                )
              }
              onToggle={toggleTechnology}
              getKey={(item) => item.id}
              getLabel={(item) => item.name}
            />
          </Field>
          <Field label="Related skills" hint="Used for site-wide filtering.">
            <ChoiceGrid
              items={skills}
              isSelected={(item) => values.skillIds.includes(item.id)}
              onToggle={toggleSkill}
              getKey={(item) => item.id}
              getLabel={(item) => item.name}
            />
          </Field>
          {values.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {values.techStack.map((t: StackEntry) => (
                <Badge key={t.technologyId} variant="neutral">
                  {t.name}
                </Badge>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="architecture" className="flex flex-col gap-6">
          <Field
            label="Folder structure"
            hint="Monospace tree - paste your project's structure."
          >
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
                  <Input
                    placeholder="Pattern name"
                    value={item.name}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Why this pattern"
                    rows={2}
                    value={item.rationale}
                    onChange={(e) => update({ rationale: e.target.value })}
                  />
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
                  <Input
                    placeholder="Algorithm name"
                    value={item.name}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                  <Input
                    placeholder="Complexity"
                    value={item.complexity ?? ""}
                    onChange={(e) => update({ complexity: e.target.value })}
                  />
                  <Textarea
                    placeholder="Why used"
                    rows={2}
                    value={item.rationale}
                    onChange={(e) => update({ rationale: e.target.value })}
                  />
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
                  <Input
                    placeholder="Technique"
                    value={item.technique}
                    onChange={(e) => update({ technique: e.target.value })}
                  />
                  <Input
                    placeholder="Measured or estimated impact"
                    value={item.impact ?? ""}
                    onChange={(e) => update({ impact: e.target.value })}
                  />
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
                  <Input
                    placeholder="Challenge"
                    value={item.challenge}
                    onChange={(e) => update({ challenge: e.target.value })}
                  />
                  <Textarea
                    placeholder="How it was resolved"
                    rows={2}
                    value={item.resolution}
                    onChange={(e) => update({ resolution: e.target.value })}
                  />
                </div>
              )}
            />
          </Field>
        </TabsContent>

        <TabsContent value="ai" className="flex flex-col gap-6">
          <Callout type="info">
            Be specific. Paste real prompts when possible.
          </Callout>

          <Field label="AI prompts used">
            <RepeatableField<AIPromptEntry>
              items={values.aiPrompts}
              onChange={(items) => set("aiPrompts", items)}
              emptyItem={{ purpose: "", prompt: "" }}
              addLabel="Add prompt"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Purpose or context"
                    value={item.purpose}
                    onChange={(e) => update({ purpose: e.target.value })}
                  />
                  <Textarea
                    placeholder="Exact prompt text"
                    rows={3}
                    className="font-mono text-xs"
                    value={item.prompt}
                    onChange={(e) => update({ prompt: e.target.value })}
                  />
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
                  <Input
                    placeholder="What AI got wrong"
                    value={item.mistake}
                    onChange={(e) => update({ mistake: e.target.value })}
                  />
                  <Input
                    placeholder="How it was caught"
                    value={item.caughtBy}
                    onChange={(e) => update({ caughtBy: e.target.value })}
                  />
                  <Textarea
                    placeholder="Correction made"
                    rows={2}
                    value={item.correction}
                    onChange={(e) => update({ correction: e.target.value })}
                  />
                </div>
              )}
            />
          </Field>
        </TabsContent>

        <TabsContent value="decisions" className="flex flex-col gap-6">
          <Field label="Engineering decisions">
            <RepeatableField<DecisionEntry>
              items={values.engineeringDecisions}
              onChange={(items) => set("engineeringDecisions", items)}
              emptyItem={{ decision: "", alternatives: [], rationale: "" }}
              addLabel="Add decision"
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Decision"
                    value={item.decision}
                    onChange={(e) => update({ decision: e.target.value })}
                  />
                  <Input
                    placeholder="Alternatives considered, comma-separated"
                    value={item.alternatives.join(", ")}
                    onChange={(e) =>
                      update({
                        alternatives: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <Textarea
                    placeholder="Why this was chosen"
                    rows={2}
                    value={item.rationale}
                    onChange={(e) => update({ rationale: e.target.value })}
                  />
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

function ChoiceGrid<T>({
  items,
  isSelected,
  onToggle,
  getKey,
  getLabel,
}: {
  items: T[];
  isSelected: (item: T) => boolean;
  onToggle: (item: T) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = isSelected(item);
        return (
          <Button
            key={getKey(item)}
            type="button"
            variant={selected ? "secondary" : "outline"}
            size="sm"
            onClick={() => onToggle(item)}
          >
            {selected && <Check className="h-4 w-4" />}
            {getLabel(item)}
          </Button>
        );
      })}
    </div>
  );
}
