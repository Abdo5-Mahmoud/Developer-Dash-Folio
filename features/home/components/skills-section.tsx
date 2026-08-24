"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SKILL_CATEGORIES } from "../../home/data/skills";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
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
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      },
    },
  };

  return (
    <TooltipProvider delayDuration={150}>
      <section
        id="skills"
        aria-labelledby="skills-heading"
        className="border-b border-border bg-surface-sunken/30"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="flex flex-col gap-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="max-w-2xl">
              <Badge variant="outline" className="mb-4">
                Skills
              </Badge>
              <h2
                id="skills-heading"
                className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              >
                Technical capabilities &amp; core stack.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Technologies, frameworks, and engineering tools applied across
                production applications.
              </p>
            </motion.div>

            {/* Categories Grid */}
            <motion.div
              variants={containerVariants}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {SKILL_CATEGORIES.map((category) => (
                <motion.div
                  key={category.category}
                  variants={itemVariants}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-surface/50 p-4 transition-colors duration-150 hover:border-border hover:bg-surface/80"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => {
                      const isLinked = Boolean(
                        skill.projects && skill.projects.length > 0,
                      );

                      const badgeNode = (
                        <Badge
                          key={skill.name}
                          variant="neutral"
                          className={cn(
                            "cursor-default transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:text-foreground motion-reduce:transform-none motion-reduce:transition-none",
                            isLinked && "hover:border-accent/40",
                          )}
                        >
                          {skill.name}
                          {isLinked && (
                            <span
                              className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent/80"
                              aria-hidden="true"
                            />
                          )}
                        </Badge>
                      );

                      if (isLinked && skill.projects) {
                        return (
                          <Tooltip key={skill.name}>
                            <TooltipTrigger asChild>{badgeNode}</TooltipTrigger>
                            <TooltipContent side="top">
                              Used in {skill.projects.join(", ")}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return badgeNode;
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
}
