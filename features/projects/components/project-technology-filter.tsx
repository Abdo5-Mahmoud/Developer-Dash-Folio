"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectTechnologyFilterProps {
  technologies: string[];
  selectedTechnology: string;
  onSelectTechnology: (technology: string) => void;
  counts?: Record<string, number>;
}

export function ProjectTechnologyFilter({
  technologies,
  selectedTechnology,
  onSelectTechnology,
  counts,
}: ProjectTechnologyFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by technology"
      className="flex flex-wrap items-center gap-2"
    >
      {technologies.map((technology) => {
        const isSelected = selectedTechnology === technology;
        const count = counts ? counts[technology] : undefined;

        return (
          <Button
            key={technology}
            type="button"
            aria-pressed={isSelected}
            variant={isSelected ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSelectTechnology(technology)}
            className={cn(
              "h-8 text-xs font-medium transition-all duration-150 motion-reduce:transition-none",
              !isSelected && "hover:border-border-strong hover:text-foreground"
            )}
          >
            {technology}
            {count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                  isSelected
                    ? "bg-accent-foreground/20 text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
