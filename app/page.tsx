import Link from "next/link";
import {
  ProjectCard,
  type ProjectCardData,
} from "@/components/project/project-card";
import { getFeaturedProjects, getAllTechnologies } from "@/lib/data";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { Footer } from "@/components/layout/footer";

export default async function HomePage() {
  const featured: ProjectCardData[] = await getFeaturedProjects();
  const tech = await getAllTechnologies();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Tech highlight strip */}
        <section className="border-y border-border bg-surface-sunken">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Working with
            </span>
            {tech.map((t) => (
              <span key={t} className="font-mono text-sm text-foreground/80">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Featured projects */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Featured work
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selected projects with full architecture write-ups.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-sm text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
