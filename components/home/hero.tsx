import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const TECH_HIGHLIGHTS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Abdo5-Mahmoud",
    label: "GitHub profile",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/abdo-fwzy/",
    label: "LinkedIn profile",
    icon: Linkedin,
  },
  { href: "abdofwzy9@gmail.com", label: "Send an email", icon: Mail },
];

export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-20 md:pt-28 lg:grid-cols-[1.1fr_auto] lg:gap-16"
    >
      {/* Content — always first in source order, so it leads on mobile */}
      <div className="flex flex-col items-start">
        <Badge variant="outline" className="mb-5">
          Frontend Engineer
        </Badge>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          Your Name
        </h1>

        <p className="mt-3 max-w-xl text-lg font-medium leading-snug text-foreground/90 md:text-xl">
          Building production-ready web applications, end to end.
        </p>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          I build production-ready applications and document the architecture,
          engineering decisions, and AI-assisted workflows behind them — so what
          shipped and why it was built that way are both visible.
        </p>

        {/* Tech highlights */}
        <ul
          aria-label="Core technologies"
          className="mt-6 flex flex-wrap gap-1.5"
        >
          {TECH_HIGHLIGHTS.map((tech) => (
            <li key={tech}>
              <Badge variant="neutral">{tech}</Badge>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/projects">
              Explore Projects{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/ai-workflow">AI Workflow</Link>
          </Button>

          <div className="ml-1 flex items-center gap-1">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <Button key={label} asChild variant="ghost" size="icon">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar — secondary, comes after content/actions in source order */}
      <div className="flex justify-center lg:justify-end">
        <Avatar
          src="/avatar.jpeg"
          alt="Portrait of Your Name"
          size={180}
          priority
        />
      </div>
    </section>
  );
}
