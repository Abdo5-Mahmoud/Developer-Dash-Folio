import { requireAdminSession } from "@/lib/session";
import {
  createSkill,
  parseSkillPayload,
} from "@/features/home/lib/skills";

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

  const values = parseSkillPayload(raw);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const result = await createSkill(values);
    if (!result.ok) {
      return Response.json(
        { ok: false, error: "A skill with this name already exists." },
        { status: 409 },
      );
    }
    return Response.json({ ok: true, skill: result.skill }, { status: 201 });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
