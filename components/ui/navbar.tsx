"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export interface NavLink {
  label: string;
  href: string;
}

export function Navbar({ links, className }: { links: NavLink[]; className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-medium text-foreground">
          <span className="flex size-6 items-center justify-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
            D
          </span>
          devfolio<span className="text-muted-foreground">.ai</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
