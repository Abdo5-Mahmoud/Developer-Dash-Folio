import { requireAdminSession } from "@/lib/session";
import { fetchGithubMetadata } from "@/lib/github";
import {
  getProjectById,
  updateProjectGithubMetadata,
} from "@/features/projects/lib/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectById(id, session.userId);
  if (!project) return Response.json({ ok: false }, { status: 404 });
  if (!project.githubUrl) {
    return Response.json(
      { ok: false, error: "Add a GitHub repository URL before syncing." },
      { status: 422 },
    );
  }

  try {
    const githubMetadata = await fetchGithubMetadata(project.githubUrl);
    const updatedProject = await updateProjectGithubMetadata(
      id,
      {
        ...githubMetadata,
        lastSyncedAt: new Date(githubMetadata.lastSyncedAt ?? Date.now()),
      },
      session.userId,
    );
    return Response.json({ ok: true, project: updatedProject });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "GitHub sync failed.";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
