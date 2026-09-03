"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Technology, TechnologyInput } from "@/lib/types";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI Tooling",
] as const;

const selectClasses =
  "flex h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50";

function emptyTechnology(
  category: TechnologyInput["category"],
): TechnologyInput {
  return { name: "", category };
}

export function TechnologiesManager({
  initialTechnologies,
}: {
  initialTechnologies: Technology[];
}) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [newTechnology, setNewTechnology] = React.useState<TechnologyInput>(
    emptyTechnology("Frontend"),
  );
  const [creating, setCreating] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<TechnologyInput>(
    emptyTechnology("Frontend"),
  );
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function send(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: TechnologyInput,
  ) {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok: true }
      | { ok: false; error?: string; errors?: Record<string, string> }
      | null;
    if (!response.ok || !payload?.ok) {
      if (payload && !payload.ok && payload.errors) {
        throw new Error(Object.values(payload.errors).join(" "));
      }
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
      await send("/api/technologies", "POST", newTechnology);
      setNewTechnology(emptyTechnology(newTechnology.category));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(technology: Technology) {
    setError(null);
    setEditingId(technology.id);
    setDraft({
      name: technology.name,
      category: technology.category,
      iconUrl: technology.iconUrl,
      officialUrl: technology.officialUrl,
    });
  }

  async function handleUpdate() {
    if (!editingId) return;
    setError(null);
    setSaving(true);
    try {
      await send(`/api/technologies/${editingId}`, "PUT", draft);
      setEditingId(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(technology: Technology) {
    if (
      !window.confirm(
        `Delete technology "${technology.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setError(null);
    setDeletingId(technology.id);
    try {
      await send(`/api/technologies/${technology.id}`, "DELETE");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Technologies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable technologies selectable on projects. Technologies still used
          in a project&apos;s tech stack cannot be deleted.
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
          if (newTechnology.name.trim()) void handleCreate();
        }}
      >
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <Label htmlFor="new-technology-name">Name</Label>
          <Input
            id="new-technology-name"
            value={newTechnology.name}
            onChange={(e) =>
              setNewTechnology({ ...newTechnology, name: e.target.value })
            }
            placeholder="e.g. PostgreSQL"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-technology-category">Category</Label>
          <select
            name="newTechnology"
            title="new Technology Category"
            id="new-technology-category"
            className={selectClasses}
            value={newTechnology.category}
            onChange={(e) =>
              setNewTechnology({
                ...newTechnology,
                category: e.target.value as TechnologyInput["category"],
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
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <Label htmlFor="new-technology-icon">Icon URL</Label>
          <Input
            id="new-technology-icon"
            value={newTechnology.iconUrl ?? ""}
            onChange={(e) =>
              setNewTechnology({ ...newTechnology, iconUrl: e.target.value })
            }
            placeholder="https://… (optional)"
          />
        </div>
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <Label htmlFor="new-technology-url">Official URL</Label>
          <Input
            id="new-technology-url"
            value={newTechnology.officialUrl ?? ""}
            onChange={(e) =>
              setNewTechnology({
                ...newTechnology,
                officialUrl: e.target.value,
              })
            }
            placeholder="https://… (optional)"
          />
        </div>
        <Button
          type="submit"
          loading={creating}
          disabled={!newTechnology.name.trim()}
        >
          <Plus className="h-4 w-4" /> Add technology
        </Button>
      </form>

      {initialTechnologies.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No technologies yet — add your first one above.
        </p>
      ) : (
        <ul className="flex flex-col divide-y rounded-lg border border-border bg-surface">
          {initialTechnologies.map((technology) =>
            editingId === technology.id ? (
              <li key={technology.id} className="p-4">
                <form
                  className="flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (draft.name.trim()) void handleUpdate();
                  }}
                >
                  <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                    <Label htmlFor={`edit-name-${technology.id}`}>Name</Label>
                    <Input
                      id={`edit-name-${technology.id}`}
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`edit-category-${technology.id}`}>
                      Category
                    </Label>
                    <select
                      name="editCategory"
                      title="Edit Category"
                      id={`edit-category-${technology.id}`}
                      className={selectClasses}
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category: e.target
                            .value as TechnologyInput["category"],
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
                  <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                    <Label htmlFor={`edit-icon-${technology.id}`}>
                      Icon URL
                    </Label>
                    <Input
                      id={`edit-icon-${technology.id}`}
                      value={draft.iconUrl ?? ""}
                      onChange={(e) =>
                        setDraft({ ...draft, iconUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                    <Label htmlFor={`edit-url-${technology.id}`}>
                      Official URL
                    </Label>
                    <Input
                      id={`edit-url-${technology.id}`}
                      value={draft.officialUrl ?? ""}
                      onChange={(e) =>
                        setDraft({ ...draft, officialUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="submit" loading={saving}>
                      Save
                    </Button>
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
                key={technology.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="truncate font-medium text-foreground">
                    {technology.name}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge variant="neutral">{technology.category}</Badge>
                    {technology.officialUrl && (
                      <a
                        href={technology.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        website
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${technology.name}`}
                    onClick={() => startEdit(technology)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${technology.name}`}
                    loading={deletingId === technology.id}
                    onClick={() => void handleDelete(technology)}
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
