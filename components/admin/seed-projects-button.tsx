"use client";

import * as React from "react";
import { Database } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SeedProjectsButton() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);

  async function seedProjects() {
    setStatus("idle");
    setError(null);

    try {
      const response = await fetch("/api/projects/seed", { method: "POST" });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; count: number }
        | { ok: false; error?: string }
        | null;

      if (!response.ok || !body?.ok) {
        throw new Error(
          body && "error" in body && body.error
            ? body.error
            : "Unable to seed projects.",
        );
      }

      setStatus("success");
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error ? caught.message : "Unable to seed projects.",
      );
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        type="button"
        variant="secondary"
        onClick={() => void seedProjects()}
      >
        <Database className="h-4 w-4 shrink-0" aria-hidden="true" />
        Seed 4 GitHub projects
      </Button>
      {status === "success" && (
        <span className="text-xs text-success">
          Projects seeded successfully.
        </span>
      )}
      {status === "error" && (
        <span className="max-w-64 text-right text-xs text-danger">{error}</span>
      )}
    </div>
  );
}
