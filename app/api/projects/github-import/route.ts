import { getAllTechnologies } from "@/features/home/lib/technologies";
import { fetchGithubImport } from "@/lib/github";
import { requireAdminSession } from "@/lib/session";
import type { ProjectInput } from "@/lib/types";

function emptyImportedProject(): Omit<
  ProjectInput,
  | "title"
  | "summary"
  | "fullDescription"
  | "features"
  | "githubUrl"
  | "githubMetadata"
  | "techStack"
> {
  return {
    slug: "",
    category: "Imported from GitHub",
    status: "draft",
    coverImage: "",
    coverImageAlt: "",
    gallery: [],
    liveUrl: "",
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

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const githubUrl =
    typeof body === "object" && body !== null && "githubUrl" in body
      ? (body as { githubUrl?: unknown }).githubUrl
      : undefined;
  if (typeof githubUrl !== "string" || !githubUrl.trim()) {
    return Response.json(
      { ok: false, error: "A GitHub repository URL is required." },
      { status: 422 },
    );
  }

  try {
    const imported = await fetchGithubImport(githubUrl.trim());
    const technologies = await getAllTechnologies();
    const byName = new Map(
      technologies.map((technology) => [
        technology.name.toLowerCase(),
        technology,
      ]),
    );
    const techStack = imported.githubMetadata.languages
      .map((language) => byName.get(language.name.toLowerCase()))
      .filter((technology): technology is NonNullable<typeof technology> =>
        Boolean(technology),
      )
      .map((technology) => ({
        technologyId: technology.id,
        name: technology.name,
      }));

    const project: ProjectInput = {
      ...emptyImportedProject(),
      title: imported.title,
      summary: imported.summary,
      fullDescription: imported.fullDescription,
      features: imported.features,
      githubUrl: imported.githubUrl,
      githubMetadata: imported.githubMetadata,
      techStack,
    };
    return Response.json({ ok: true, project });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "GitHub import failed.";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
