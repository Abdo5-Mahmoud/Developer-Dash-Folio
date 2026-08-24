"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import type { ProjectCardData } from "../types/project";

interface FeaturedProjectsSectionProps {
  projects: ProjectCardData[];
}

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      },
    },
  };

  return (
    <section
      id="featured-projects"
      aria-labelledby="featured-projects-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
          >
            <div>
              <Badge variant="outline" className="mb-4">
                Featured Work
              </Badge>
              <h2
                id="featured-projects-heading"
                className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              >
                Selected projects &amp; architecture.
              </h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Selected production applications with architecture rationale and
                technical breakdowns.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/projects" className="group">
                View all projects
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </Button>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div key={project.slug} variants={itemVariants}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
