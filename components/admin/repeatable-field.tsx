"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Generic add/reorder/delete wrapper for structured-list fields:
 * React patterns, algorithms, challenges, AI prompts, AI mistakes,
 * engineering decisions. Pass a render function for one entry's inputs.
 */
export function RepeatableField<T>({
  items,
  onChange,
  emptyItem,
  addLabel,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  function update(index: number, patch: Partial<T>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border border-border bg-surface p-4">
          <div className="flex-1">{renderItem(item, (patch) => update(i, patch), i)}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            aria-label="Remove entry"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...items, emptyItem])}
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
