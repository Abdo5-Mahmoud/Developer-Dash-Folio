"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  depth?: 2 | 3;
}

export function TableOfContents({ items, className }: { items: TocItem[]; className?: string }) {
  const [activeId, setActiveId] = React.useState<string | null>(items[0]?.id ?? null);

  React.useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className={cn("w-52 shrink-0 text-sm", className)}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">On this page</p>
      <ul className="flex flex-col gap-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "1.75rem" : "1rem" }}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 border-transparent pl-3 py-0.5 text-muted-foreground transition-colors duration-150 hover:text-foreground",
                activeId === item.id && "border-accent text-accent font-medium"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
