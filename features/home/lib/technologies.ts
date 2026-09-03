import { revalidatePath } from "next/cache";
import { isValidObjectId, Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/lib/models/project";
import {
  TechnologyModel,
  type TechnologyDocument,
} from "@/lib/models/technology";

import type { Technology, TechnologyInput } from "../types/skill";

function toTechnology(
  doc: TechnologyDocument & { _id: Types.ObjectId },
): Technology {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    iconUrl: doc.iconUrl,
    officialUrl: doc.officialUrl,
  };
}

// ---------------- Public reads ----------------

export async function getAllTechnologies(): Promise<Technology[]> {
  await connectToDatabase();
  const docs = (await TechnologyModel.find()
    .collation({ locale: "en", strength: 2 })
    .sort({ name: 1 })
    .lean()) as (TechnologyDocument & { _id: Types.ObjectId })[];
  return docs.map(toTechnology);
}

// ---------------- Payload parsing & validation ----------------

const TECHNOLOGY_CAPS = {
  name: 100,
  iconUrl: 2000,
  officialUrl: 2000,
} as const;

const TECHNOLOGY_CATEGORY_VALUES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI Tooling",
] as const;

/**
 * Coerces an untrusted JSON body into a valid TechnologyInput.
 * Returns null when required fields are missing or enums are invalid.
 */
export function parseTechnologyPayload(raw: unknown): TechnologyInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;

  if (typeof record.name !== "string") return null;
  const name = record.name.trim();
  if (!name || name.length > TECHNOLOGY_CAPS.name) return null;

  if (
    typeof record.category !== "string" ||
    !TECHNOLOGY_CATEGORY_VALUES.includes(
      record.category as (typeof TECHNOLOGY_CATEGORY_VALUES)[number],
    )
  ) {
    return null;
  }

  const asOptionalUrl = (value: unknown) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return trimmed.slice(0, TECHNOLOGY_CAPS.officialUrl);
  };

  return {
    name,
    category: record.category as TechnologyInput["category"],
    iconUrl: asOptionalUrl(record.iconUrl),
    officialUrl: asOptionalUrl(record.officialUrl),
  };
}

/**
 * URL-shaped optional fields must be http(s) links.
 */
export function validateTechnology(
  values: TechnologyInput,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of ["iconUrl", "officialUrl"] as const) {
    const url = values[key];
    if (url && !/^https?:\/\//.test(url))
      errors[key] = "Must start with http:// or https://";
  }
  return errors;
}

// ---------------- Mutations ----------------

export type TechnologyMutationResult =
  | { ok: true; technology: Technology }
  | { ok: false; reason: "duplicate" };

export type DeleteResult = "deleted" | "not-found" | "in-use";

function revalidateTechnologyPages() {
  revalidatePath("/");
}

async function technologyNameTaken(name: string, excludeId?: string) {
  const query = excludeId ? { name, _id: { $ne: excludeId } } : { name };
  const doc = await TechnologyModel.findOne(query)
    .collation({ locale: "en", strength: 2 })
    .lean();
  return doc !== null;
}

export async function createTechnology(
  values: TechnologyInput,
): Promise<TechnologyMutationResult> {
  await connectToDatabase();
  if (await technologyNameTaken(values.name)) {
    return { ok: false, reason: "duplicate" };
  }
  const doc = await TechnologyModel.create(values);
  revalidateTechnologyPages();
  return { ok: true, technology: toTechnology(doc) };
}

export async function updateTechnology(
  id: string,
  values: TechnologyInput,
): Promise<TechnologyMutationResult | "not-found"> {
  if (!isValidObjectId(id)) return "not-found";
  await connectToDatabase();
  const existing = await TechnologyModel.findById(id);
  if (!existing) return "not-found";
  if (await technologyNameTaken(values.name, id)) {
    return { ok: false, reason: "duplicate" };
  }
  const previousName = existing.name;
  existing.set(values);
  const doc = await existing.save();
  // PRD 7: propagate a rename to the denormalized name on referenced Projects.
  if (previousName !== values.name) {
    await ProjectModel.updateMany(
      { "techStack.technologyId": id },
      { $set: { "techStack.$[entry].name": values.name } },
      { arrayFilters: [{ "entry.technologyId": id }] },
    );
  }
  revalidateTechnologyPages();
  return { ok: true, technology: toTechnology(doc) };
}

// PRD 6.5: guard against deleting a Technology still referenced by a Project.
export async function deleteTechnology(id: string): Promise<DeleteResult> {
  if (!isValidObjectId(id)) return "not-found";
  await connectToDatabase();
  if (await ProjectModel.exists({ "techStack.technologyId": id })) {
    return "in-use";
  }
  const doc = await TechnologyModel.findByIdAndDelete(id);
  if (!doc) return "not-found";
  revalidateTechnologyPages();
  return "deleted";
}
