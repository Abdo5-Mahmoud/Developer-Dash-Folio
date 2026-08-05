"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarGroup {
  title: string;
  links: SidebarLink[];
}

export function SidebarNav({
  groups,
  activeHref,
  className,
}: {
  groups: SidebarGroup[];
  activeHref?: string;
  className?: string;
}) {
  return (
    <nav aria-label="Documentation" className={cn("flex w-56 shrink-0 flex-col gap-6 text-sm", className)}>
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
            {group.title}
          </p>
          {group.links.map((link) => {
            const isActive = link.href === activeHref;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-2 py-1.5 text-muted-foreground transition-colors duration-150",
                  "hover:bg-surface-hover hover:text-foreground",
                  isActive && "bg-accent-muted text-accent font-medium"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
