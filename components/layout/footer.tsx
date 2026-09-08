import Link from "next/link";
import { SOCIAL_LINKS } from "@/features/contact/data/contact";

const FOOTER_NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/ai-workflow", label: "AI Workflow" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-mono text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              devfolio<span className="text-muted-foreground">.ai</span>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Building thoughtful, production-ready web applications.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {FOOTER_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1" aria-label="Social links">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon, external }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Abdullah Mahmoud.</p>
          <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
