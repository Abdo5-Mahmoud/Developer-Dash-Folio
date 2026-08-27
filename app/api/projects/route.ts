import { requireAdminSession } from "@/lib/session";
import {
  createProject,
  parseProjectPayload,
  validateProject,
} from "@/features/projects/lib/projects";
import type { ProjectStatus } from "@/lib/types";

function parseStatus(raw: unknown): ProjectStatus {
  return raw === "published" ? "published" : "draft";
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;
  const status = parseStatus(body.status);

  const values = parseProjectPayload(body);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const errors = validateProject(values, status);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const project = await createProject(values, status);
    return Response.json({ ok: true, project }, { status: 201 });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}