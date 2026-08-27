import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/project-editor";
import type { ProjectInput } from "@/lib/types";
import { getAllSkills, getAllTechnologyEntities } from "@/features/home/lib/skills";

export const metadata: Metadata = {
  title: "New Project - Admin",
};

function emptyProject(): ProjectInput {
  return {
    slug: "",
    title: "",
    category: "",
    features: [],
    summary: "",
    fullDescription: "",
    status: "draft",
    coverImage: "",
    coverImageAlt: "",
    gallery: [],
    githubUrl: "",
    liveUrl: "",
    techStack: [],
    skillIds: [],
    folderStructure: "",
    architectureExplanation: "",
    dataFlow: "",
    reactPatterns: [],
    algorithms: [],
    performanceOptimizations: [],
    challenges: [],
    lessonsLearned: "",
    aiPrompts: [],
    aiMistakes: [],
    engineeringDecisions: [],
    featured: false,
    displayOrder: 0,
  };
}

export default async function NewProjectPage() {
  const [technologies, skills] = await Promise.all([
    getAllTechnologyEntities(),
    getAllSkills(),
  ]);

  return (
    <ProjectEditor
      mode="create"
      initialValues={emptyProject()}
      technologies={technologies}
      skills={skills}
    />
  );
}
