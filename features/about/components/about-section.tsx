"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ABOUT_HIGHLIGHTS } from "../data/about";

export function AboutSection() {
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
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.div
          className="grid gap-8 lg:grid-cols-12 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Section heading & label */}
          <motion.div className="lg:col-span-4" variants={itemVariants}>
            <Badge variant="outline" className="mb-4">
              About Me
            </Badge>
            <h2
              id="about-heading"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              Building with architectural intent and AI-assisted precision.
            </h2>
          </motion.div>

          {/* Narrative & Focus */}
          <div className="flex flex-col gap-5 lg:col-span-8">
            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed text-muted-foreground"
            >
              I am a software engineer specializing in frontend and full-stack
              web development. I design and build resilient, accessible, and
              high-performance web applications with clean system architecture
              and maintainable codebases.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed text-muted-foreground"
            >
              My current focus centers on modern React and Next.js
              architectures, TypeScript-first development, component-driven
              design systems, and scalable data flow patterns.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed text-muted-foreground"
            >
              I believe great engineering requires transparency and rigor. I
              treat documentation, architectural rationale, and system tradeoffs
              as essential deliverables. By integrating AI-assisted workflows
              into my development process, I accelerate prototyping and
              iteration while relying on strong engineering fundamentals to
              verify correctness, security, and long-term maintainability.
            </motion.p>

            {/* Supporting highlights */}
            <motion.div
              variants={itemVariants}
              className="mt-3 grid gap-6 border-t border-border pt-6 sm:grid-cols-3"
            >
              {ABOUT_HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="group -m-3 rounded-md border border-transparent p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-surface-hover/50 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground transition-colors duration-150 group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
