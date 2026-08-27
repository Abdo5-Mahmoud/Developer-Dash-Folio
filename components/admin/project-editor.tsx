"use client";

import { useRouter } from "next/navigation";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/project-form";
import type { Project, ProjectStatus, Skill, Technology } from "@/lib/types";

type ProjectEditorProps = {
  mode: "create" | "edit";
  initialValues: ProjectFormValues;
  projectId?: string;
  technologies: Technology[];
  skills: Skill[];
};

export function ProjectEditor({
  mode,
  initialValues,
  projectId,
  technologies,
  skills,
}: ProjectEditorProps) {
  const router = useRouter();

  async function save(values: ProjectFormValues, status: ProjectStatus) {
    const response = await fetch(mode === "create" ? "/api/projects" : `/api/projects/${projectId}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, status }),
    });

    const body = (await response.json().catch(() => null)) as
      | { ok: true; project: Project }
      | { ok: false; errors?: Record<string, string> }
      | null;

    if (!response.ok || !body?.ok) {
      const message = body && "errors" in body && body.errors
        ? Object.values(body.errors).join(" ")
        : "Unable to save project.";
      throw new Error(message);
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <ProjectForm
      initialValues={initialValues}
      technologies={technologies}
      skills={skills}
      onSubmit={save}
    />
  );
}
