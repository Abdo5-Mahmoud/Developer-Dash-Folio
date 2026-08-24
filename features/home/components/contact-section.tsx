"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROFILE_CONTACT } from "@/features/contact/data/contact";

const CONTACT_ACTIONS = [
  {
    href: `mailto:${PROFILE_CONTACT.email}`,
    label: "Email",
    description: PROFILE_CONTACT.email,
    icon: Mail,
    external: false,
  },
  {
    href: PROFILE_CONTACT.githubUrl,
    label: "GitHub",
    description: "View my work",
    icon: Github,
    external: true,
  },
  {
    href: PROFILE_CONTACT.linkedInUrl,
    label: "LinkedIn",
    description: "Connect professionally",
    icon: Linkedin,
    external: true,
  },
] as const;

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-b border-border bg-surface-sunken/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
          className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12"
        >
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              Let&apos;s work together.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              I&apos;m open to frontend and full-stack opportunities, freelance work,
              and thoughtful collaborations. Reach out through whichever channel suits you.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-3 sm:grid-cols-3 lg:col-span-7"
          >
            {CONTACT_ACTIONS.map(({ href, label, description, icon: Icon, external }) => (
              <Card key={label} className="group p-4 transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <Button asChild variant="ghost" className="h-auto w-full justify-start p-0 text-left hover:bg-transparent">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={external ? `Open ${label} profile` : `Send an email to ${PROFILE_CONTACT.email}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="flex min-w-0 flex-col items-start gap-0.5">
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <span className="truncate text-xs text-muted-foreground">{description}</span>
                    </span>
                  </a>
                </Button>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
