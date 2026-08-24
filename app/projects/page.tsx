import type { Metadata } from "next";
import { getAllProjectCardData } from "@/features/projects/lib/projects";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProjectsPageHeader } from "@/features/projects/components/projects-page-header";
import { ProjectsGrid } from "@/features/projects/components/projects-grid";

export const metadata: Metadata = {
  title: "Projects — Engineering & Architecture Portfolio",
  description:
    "Explore selected production web applications, real-time architectures, and backend services with architecture breakdowns.",
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ tech?: string }>;
}) {
  const projects = await getAllProjectCardData();
  const { tech } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <ProjectsPageHeader />

        <ProjectsGrid projects={projects} selectedTechnology={tech ?? "All"} />
      </main>

      <Footer />
    </div>
  );
}
