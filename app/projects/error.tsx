"use client";

import { Button } from "@/components/ui/button";

export default function ProjectsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          This project section is temporarily unavailable.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
        <Button onClick={() => reset()} className="mt-6">
          Try again
        </Button>
      </div>
    </main>
  );
}
