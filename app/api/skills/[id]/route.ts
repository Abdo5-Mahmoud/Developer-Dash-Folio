import { requireAdminSession } from "@/lib/session";
import {
  deleteSkill,
  parseSkillPayload,
  updateSkill,
} from "@/features/home/lib/skills";

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

  const values = parseSkillPayload(raw);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const result = await updateSkill(id, values);
    if (result === "not-found") {
      return Response.json({ ok: false }, { status: 404 });
    }
    if (!result.ok) {
      return Response.json(
        { ok: false, error: "A skill with this name already exists." },
        { status: 409 },
      );
    }
    return Response.json({ ok: true, skill: result.skill });
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
    const result = await deleteSkill(id);
    if (result === "in-use") {
      return Response.json(
        {
          ok: false,
          error:
            "This skill is referenced by one or more projects and cannot be deleted.",
        },
        { status: 409 },
      );
    }
    if (result === "not-found") {
      return Response.json({ ok: false }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
