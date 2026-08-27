import { requireAdminSession } from "@/lib/session";
import {
  deleteProject,
  parseProjectPayload,
  updateProject,
  validateProject,
} from "@/features/projects/lib/projects";
import type { ProjectStatus } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;
  const status: ProjectStatus = body.status === "published" ? "published" : "draft";

  const values = parseProjectPayload(body);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const errors = validateProject(values, status);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const project = await updateProject(id, values, status);
    if (!project) {
      return Response.json({ ok: false }, { status: 404 });
    }
    return Response.json({ ok: true, project });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteProject(id);
    if (!deleted) {
      return Response.json({ ok: false }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}