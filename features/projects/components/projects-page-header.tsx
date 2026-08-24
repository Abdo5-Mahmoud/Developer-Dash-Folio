import { Badge } from "@/components/ui/badge";

export function ProjectsPageHeader() {
  return (
    <section className="border-b border-border bg-surface-sunken/30">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <Badge variant="outline" className="mb-4">
          Projects
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          A selection of web applications, real-time systems, and backend
          services I have built.
        </p>
      </div>
    </section>
  );
}
