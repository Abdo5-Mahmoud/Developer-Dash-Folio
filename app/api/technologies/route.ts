import { requireAdminSession } from "@/lib/session";
import {
  createTechnology,
  parseTechnologyPayload,
  validateTechnology,
} from "@/features/home/lib/technologies";

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

  const values = parseTechnologyPayload(raw);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const errors = validateTechnology(values);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const result = await createTechnology(values);
    if (!result.ok) {
      return Response.json(
        { ok: false, error: "A technology with this name already exists." },
        { status: 409 },
      );
    }
    return Response.json(
      { ok: true, technology: result.technology },
      { status: 201 },
    );
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
