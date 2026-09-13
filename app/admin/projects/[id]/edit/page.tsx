import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/features/admin/components/project-editor";
import { getProjectById } from "@/features/projects/lib/projects";
import { getAllSkills } from "@/features/home/lib/skills";
import { getAllTechnologies } from "@/features/home/lib/technologies";
import { requireAdminSession } from "@/lib/session";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Project - Admin",
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const session = await requireAdminSession();
  const [project, technologies, skills] = await Promise.all([
    getProjectById(id, session?.userId),
    getAllTechnologies(),
    getAllSkills(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectEditor
      mode="edit"
      projectId={project.id}
      initialValues={project}
      technologies={technologies}
      skills={skills}
    />
  );
}
