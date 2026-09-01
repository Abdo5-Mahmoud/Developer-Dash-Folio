import { requireAdminSession } from "@/lib/session";
import {
  deleteTechnology,
  parseTechnologyPayload,
  updateTechnology,
  validateTechnology,
} from "@/features/home/lib/technologies";

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

  const values = parseTechnologyPayload(raw);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const errors = validateTechnology(values);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const result = await updateTechnology(id, values);
    if (result === "not-found") {
      return Response.json({ ok: false }, { status: 404 });
    }
    if (!result.ok) {
      return Response.json(
        { ok: false, error: "A technology with this name already exists." },
        { status: 409 },
      );
    }
    return Response.json({ ok: true, technology: result.technology });
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
    const result = await deleteTechnology(id);
    if (result === "in-use") {
      return Response.json(
        {
          ok: false,
          error:
            "This technology is referenced by one or more projects and cannot be deleted.",
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
