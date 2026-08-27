import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getProjectById } from "@/features/projects/lib/projects";
import { getAllSkills, getAllTechnologyEntities } from "@/features/home/lib/skills";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Project - Admin",
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, technologies, skills] = await Promise.all([
    getProjectById(id),
    getAllTechnologyEntities(),
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
