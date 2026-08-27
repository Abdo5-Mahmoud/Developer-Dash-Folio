"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Tags, Cpu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects/new", label: "New project", icon: FolderKanban },
  { href: "/admin/skills", label: "Manage skills", icon: Tags },
  { href: "/admin/technologies", label: "Manage technologies", icon: Cpu },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface-sunken">
      <div className="px-5 py-4">
        <span className="font-mono text-sm font-semibold text-foreground">
          devfolio<span className="text-accent">.ai</span>
        </span>
        <p className="mt-0.5 text-xs text-muted-foreground">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((l) => {
          const active = pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-muted text-accent"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <form action="/api/auth/logout" method="post">
          <button
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            type="submit"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
