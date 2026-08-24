"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FolderX, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectCard } from "./project-card";
import { ProjectTechnologyFilter } from "./project-technology-filter";
import type { ProjectCardData } from "../types/project";

interface ProjectsGridProps {
  projects: ProjectCardData[];
  selectedTechnology: string;
}

export function ProjectsGrid({
  projects,
  selectedTechnology,
}: ProjectsGridProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const technologies = React.useMemo(() => {
    const unique = Array.from(
      new Set(
        projects.flatMap((project) => project.tech)
      )
    );
    return ["All", ...unique];
  }, [projects]);

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    for (const project of projects) {
      for (const technology of project.tech) {
        map[technology] = (map[technology] || 0) + 1;
      }
    }
    return map;
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (selectedTechnology === "All") {
      return projects;
    }
    return projects.filter((project) =>
      project.tech.includes(selectedTechnology),
    );
  }, [projects, selectedTechnology]);

  function selectTechnology(technology: string) {
    router.replace(
      technology === "All"
        ? pathname
        : `${pathname}?tech=${encodeURIComponent(technology)}`,
      { scroll: false },
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      },
    },
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProjectTechnologyFilter
          technologies={technologies}
          selectedTechnology={selectedTechnology}
          onSelectTechnology={selectTechnology}
          counts={counts}
        />

        <p className="text-xs text-muted-foreground">
          Showing {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <motion.div
          key={selectedTechnology}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.slug} variants={itemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <Card className="border-dashed bg-surface-sunken/40 p-12 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <FolderX className="h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">
              No projects found using &ldquo;{selectedTechnology}&rdquo;
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              There are currently no published projects using this technology.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectTechnology("All")}
              className="mt-3 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filter
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}
