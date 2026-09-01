import { revalidatePath } from "next/cache";
import { isValidObjectId, Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/lib/models/project";
import { SkillModel, type SkillDocument } from "@/lib/models/skill";

import { SKILL_CATEGORIES } from "../data/skills";
import type { Skill, SkillCategory, SkillInput } from "../types/skill";

function toSkill(
  doc: SkillDocument & { _id: Types.ObjectId },
): Skill {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    proficiency: doc.proficiency,
  };
}

// ---------------- Public reads ----------------

export async function getAllSkills(): Promise<Skill[]> {
  await connectToDatabase();
  const docs = await SkillModel.find()
    .collation({ locale: "en", strength: 2 })
    .sort({ name: 1 })
    .lean<SkillDocument & { _id: Types.ObjectId }[]>();
  return docs.map(toSkill);
}

export async function getSkillById(id: string): Promise<Skill | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await SkillModel.findById(id).lean<
    (SkillDocument & { _id: Types.ObjectId }) | null
  >();
  return doc ? toSkill(doc) : null;
}

// Presentational grouping (display categories + "used in project" links)
// is not part of the Skill model, so it stays static.
export async function getSkillCategories(): Promise<SkillCategory[]> {
  return SKILL_CATEGORIES;
}

// ---------------- Payload parsing ----------------

const SKILL_NAME_CAP = 100;

const SKILL_CATEGORY_VALUES = [
  "Language",
  "Framework",
  "Concept",
  "Soft skill",
] as const;

const PROFICIENCY_VALUES = ["Familiar", "Proficient", "Expert"] as const;

/**
 * Coerces an untrusted JSON body into a valid SkillInput.
 * Returns null when required fields are missing or enums are invalid.
 */
export function parseSkillPayload(raw: unknown): SkillInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;

  if (typeof record.name !== "string") return null;
  const name = record.name.trim();
  if (!name || name.length > SKILL_NAME_CAP) return null;

  if (
    typeof record.category !== "string" ||
    !SKILL_CATEGORY_VALUES.includes(
      record.category as (typeof SKILL_CATEGORY_VALUES)[number],
    )
  ) {
    return null;
  }

  let proficiency: SkillInput["proficiency"];
  if (record.proficiency !== undefined && record.proficiency !== null) {
    if (
      typeof record.proficiency !== "string" ||
      !PROFICIENCY_VALUES.includes(
        record.proficiency as (typeof PROFICIENCY_VALUES)[number],
      )
    ) {
      return null;
    }
    proficiency = record.proficiency as SkillInput["proficiency"];
  }

  return {
    name,
    category: record.category as SkillInput["category"],
    proficiency,
  };
}

// ---------------- Mutations ----------------

export type SkillMutationResult =
  | { ok: true; skill: Skill }
  | { ok: false; reason: "duplicate" };

export type DeleteResult = "deleted" | "not-found" | "in-use";

function revalidateSkillPages() {
  revalidatePath("/");
  revalidatePath("/about");
}

async function skillNameTaken(name: string, excludeId?: string) {
  const query = excludeId ? { name, _id: { $ne: excludeId } } : { name };
  const doc = await SkillModel.findOne(query)
    .collation({ locale: "en", strength: 2 })
    .lean();
  return doc !== null;
}

export async function createSkill(
  values: SkillInput,
): Promise<SkillMutationResult> {
  await connectToDatabase();
  if (await skillNameTaken(values.name)) {
    return { ok: false, reason: "duplicate" };
  }
  const doc = await SkillModel.create(values);
  revalidateSkillPages();
  return { ok: true, skill: toSkill(doc) };
}

export async function updateSkill(
  id: string,
  values: SkillInput,
): Promise<SkillMutationResult | "not-found"> {
  if (!isValidObjectId(id)) return "not-found";
  await connectToDatabase();
  const existing = await SkillModel.findById(id);
  if (!existing) return "not-found";
  if (await skillNameTaken(values.name, id)) {
    return { ok: false, reason: "duplicate" };
  }
  existing.set(values);
  const doc = await existing.save();
  revalidateSkillPages();
  return { ok: true, skill: toSkill(doc) };
}

// PRD 6.5: guard against deleting a Skill still referenced by a Project.
export async function deleteSkill(id: string): Promise<DeleteResult> {
  if (!isValidObjectId(id)) return "not-found";
  await connectToDatabase();
  if (await ProjectModel.exists({ skillIds: id })) return "in-use";
  const doc = await SkillModel.findByIdAndDelete(id);
  if (!doc) return "not-found";
  revalidateSkillPages();
  return "deleted";
}
