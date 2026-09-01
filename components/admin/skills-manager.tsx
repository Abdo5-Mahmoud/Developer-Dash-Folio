"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Skill, SkillInput } from "@/lib/types";

const CATEGORIES = ["Language", "Framework", "Concept", "Soft skill"] as const;
const PROFICIENCIES = ["Familiar", "Proficient", "Expert"] as const;

const selectClasses =
  "flex h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50";

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [newSkill, setNewSkill] = React.useState<SkillInput>({
    name: "",
    category: "Concept",
  });
  const [creating, setCreating] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<SkillInput>({
    name: "",
    category: "Concept",
  });
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function send(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: SkillInput,
  ) {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok: true }
      | { ok: false; error?: string }
      | null;
    if (!response.ok || !payload?.ok) {
      throw new Error(
        payload && !payload.ok && payload.error
          ? payload.error
          : "Request failed.",
      );
    }
    router.refresh();
  }

  async function handleCreate() {
    setError(null);
    setCreating(true);
    try {
      await send("/api/skills", "POST", newSkill);
      setNewSkill({ name: "", category: newSkill.category });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(skill: Skill) {
    setError(null);
    setEditingId(skill.id);
    setDraft({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
  }

  async function handleUpdate() {
    if (!editingId) return;
    setError(null);
    setSaving(true);
    try {
      await send(`/api/skills/${editingId}`, "PUT", draft);
      setEditingId(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill: Skill) {
    if (
      !window.confirm(`Delete skill "${skill.name}"? This cannot be undone.`)
    ) {
      return;
    }
    setError(null);
    setDeletingId(skill.id);
    try {
      await send(`/api/skills/${skill.id}`, "DELETE");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable skills selectable on projects. Skills still referenced by a
          project cannot be deleted.
        </p>
      </div>

      {error && (
        <Callout type="danger" title="Request failed">
          {error}
        </Callout>
      )}

      <form
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (newSkill.name.trim()) void handleCreate();
        }}
      >
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <Label htmlFor="new-skill-name">Name</Label>
          <Input
            id="new-skill-name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="e.g. TypeScript"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-skill-category">Category</Label>
          <select
            id="new-skill-category"
            className={selectClasses}
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                category: e.target.value as SkillInput["category"],
              })
            }
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-skill-proficiency">Proficiency</Label>
          <select
            id="new-skill-proficiency"
            className={selectClasses}
            value={newSkill.proficiency ?? ""}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                proficiency: (e.target.value || undefined) as
                  | SkillInput["proficiency"]
                  | undefined,
              })
            }
          >
            <option value="">Not set</option>
            {PROFICIENCIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" loading={creating} disabled={!newSkill.name.trim()}>
          <Plus className="h-4 w-4" /> Add skill
        </Button>
      </form>

      {initialSkills.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No skills yet — add your first one above.
        </p>
      ) : (
        <ul className="flex flex-col divide-y rounded-lg border border-border bg-surface">
          {initialSkills.map((skill) =>
            editingId === skill.id ? (
              <li key={skill.id} className="p-4">
                <form
                  className="flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (draft.name.trim()) void handleUpdate();
                  }}
                >
                  <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                    <Label htmlFor={`edit-name-${skill.id}`}>Name</Label>
                    <Input
                      id={`edit-name-${skill.id}`}
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`edit-category-${skill.id}`}>Category</Label>
                    <select
                      id={`edit-category-${skill.id}`}
                      className={selectClasses}
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category: e.target.value as SkillInput["category"],
                        })
                      }
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`edit-proficiency-${skill.id}`}>
                      Proficiency
                    </Label>
                    <select
                      id={`edit-proficiency-${skill.id}`}
                      className={selectClasses}
                      value={draft.proficiency ?? ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          proficiency: (e.target.value || undefined) as
                            | SkillInput["proficiency"]
                            | undefined,
                        })
                      }
                    >
                      <option value="">Not set</option>
                      {PROFICIENCIES.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="submit" loading={saving}>Save</Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={saving}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={skill.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="truncate font-medium text-foreground">
                    {skill.name}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge variant="neutral">{skill.category}</Badge>
                    {skill.proficiency && (
                      <Badge variant="outline">{skill.proficiency}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${skill.name}`}
                    onClick={() => startEdit(skill)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${skill.name}`}
                    loading={deletingId === skill.id}
                    onClick={() => void handleDelete(skill)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
