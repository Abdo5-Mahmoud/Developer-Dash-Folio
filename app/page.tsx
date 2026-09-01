import { getFeaturedProjects } from "@/features/projects/lib/projects";
import { getAllTechnologies } from "@/features/home/lib/technologies";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/features/home/components/hero";
import { AboutSection } from "@/features/about/components/about-section";
import { SkillsSection } from "@/features/home/components/skills-section";
import { FeaturedProjectsSection } from "@/features/projects/components/featured-projects-section";
import { ContactSection } from "@/features/home/components/contact-section";
import { Footer } from "@/components/layout/footer";

export default async function HomePage() {
  const featured = await getFeaturedProjects();
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

        {/* About section */}
        <AboutSection />

        {/* Skills section */}
        <SkillsSection />

        {/* Featured projects section */}
        <FeaturedProjectsSection projects={featured} />

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
