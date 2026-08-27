import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessageModel } from "@/lib/models/contact-message";
import type { ContactFormValues } from "@/features/contact/types/contact";
import {
  MESSAGE_MAX_LENGTH,
  validateContactForm,
} from "@/features/contact/lib/submit-contact";

const FIELDS = ["name", "email", "subject", "message"] as const;

function parsePayload(raw: unknown): ContactFormValues | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const values = {} as Record<(typeof FIELDS)[number], string>;
  for (const field of FIELDS) {
    const value = record[field];
    if (typeof value !== "string") return null;
    values[field] = value;
  }
  // Enforce length cap at the boundary too — validation trims but does not cap.
  if (values.message.length > MESSAGE_MAX_LENGTH) return null;
  return values;
}

export async function POST(request: Request) {``
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const values = parsePayload(raw);
  if (!values) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const errors = validateContactForm(values);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false }, { status: 422 });
  }

  try {
    await connectToDatabase();
    await ContactMessageModel.create(values);
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
}
