import { revalidatePath } from "next/cache";
import { isValidObjectId, Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel, type ProjectDocument } from "@/lib/models/project";

import type {
  Project,
  ProjectCardData,
  ProjectInput,
  ProjectStatus,
} from "../types/project";

function toProject(doc: ProjectDocument & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }): Project {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    category: doc.category,
    fullDescription: doc.fullDescription,
    features: doc.features ?? [],
    status: doc.status,
    coverImage: doc.coverImage,
    coverImageAlt: doc.coverImageAlt,
    gallery: (doc.gallery ?? []).map((image) => ({
      ...image,
      alt: image.alt ?? "",
    })),
    githubUrl: doc.githubUrl,
    liveUrl: doc.liveUrl,
    techStack: doc.techStack ?? [],
    skillIds: (doc.skillIds ?? []).map((id) => id.toString()),
    folderStructure: doc.folderStructure,
    architectureExplanation: doc.architectureExplanation,
    dataFlow: doc.dataFlow,
    reactPatterns: doc.reactPatterns ?? [],
    algorithms: doc.algorithms ?? [],
    performanceOptimizations: doc.performanceOptimizations ?? [],
    challenges: doc.challenges ?? [],
    lessonsLearned: doc.lessonsLearned,
    aiPrompts: doc.aiPrompts ?? [],
    aiMistakes: doc.aiMistakes ?? [],
    engineeringDecisions: doc.engineeringDecisions ?? [],
    featured: doc.featured,
    displayOrder: doc.displayOrder,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

// ---------------- Public reads (published only) ----------------

export async function getAllProjects(includeUnpublished = false): Promise<Project[]> {
  await connectToDatabase();
  const query = includeUnpublished ? {} : { status: "published" as const };
  const docs = await ProjectModel.find(query)
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean<ProjectDocument & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }[]>();
  return docs.map((doc) => toProject(doc as ProjectDocument & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date }));
}

export async function getAllProjectCardData(): Promise<ProjectCardData[]> {
  const all = await getAllProjects();
  return all.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category ?? "Full Stack",
    coverImage: p.coverImage,
    coverImageAlt: p.coverImageAlt ?? `${p.title} project cover image`,
    tech: p.techStack.map((t) => t.name),
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    featured: p.featured,
  }));
}

export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  const all = await getAllProjects();
  return all
    .filter((p) => p.featured)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category ?? "Full Stack",
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt ?? `${p.title} project cover image`,
      tech: p.techStack.map((t) => t.name),
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      featured: p.featured,
    }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await connectToDatabase();
  const doc = await ProjectModel.findOne({ slug, status: "published" })
    .lean<ProjectDocument & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date } | null>();
  return doc ? toProject(doc) : null;
}

// ---------------- Admin reads (drafts included) ----------------

export async function getAllProjectsAdmin(): Promise<Project[]> {
  return getAllProjects(true);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ProjectModel.findById(id)
    .lean<ProjectDocument & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date } | null>();
  return doc ? toProject(doc) : null;
}

// ---------------- Payload parsing & validation ----------------

const STRING_CAPS = {
  title: 200,
  category: 100,
  summary: 500,
  fullDescription: 20000,
  coverImage: 2000,
  coverImageAlt: 300,
  githubUrl: 2000,
  liveUrl: 2000,
  folderStructure: 10000,
  architectureExplanation: 5000,
  dataFlow: 5000,
  lessonsLearned: 5000,
} as const;

function asString(value: unknown, cap: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, cap);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim());
}

function cleanEntry<T extends Record<string, unknown>>(
  raw: unknown,
  required: string[],
  optional: string[]
): T | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const entry = {} as Record<string, unknown>;
  for (const key of required) {
    const value = record[key];
    if (typeof value !== "string" || !value.trim()) return null;
    entry[key] = value.trim().slice(0, 5000);
  }
  for (const key of optional) {
    const value = record[key];
    if (Array.isArray(value)) {
      const list = asStringArray(value);
      if (list.length > 0) entry[key] = list;
    } else if (typeof value === "string" && value.trim()) {
      entry[key] = value.trim().slice(0, 5000);
    }
  }
  return entry as T;
}

function cleanEntryList<T extends Record<string, unknown>>(
  raw: unknown,
  required: string[],
  optional: string[] = []
): T[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => cleanEntry<T>(item, required, optional))
    .filter((item): item is T => item !== null)
    .slice(0, 50);
}

/**
 * Coerces an untrusted JSON body into a valid ProjectInput.
 * Returns null when required scalar fields are missing/wrong-typed.
 * Array entries that are incomplete are dropped rather than rejected —
 * matches the form, which only sends fully-typed rows.
 */
export function parseProjectPayload(raw: unknown): ProjectInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;

  const title = asString(record.title, STRING_CAPS.title);
  if (!title) return null;

  const summary = asString(record.summary, STRING_CAPS.summary);
  const fullDescription = asString(record.fullDescription, STRING_CAPS.fullDescription);
  if (!summary || !fullDescription) return null;

  const techStack = Array.isArray(record.techStack)
    ? record.techStack
        .map((item) => cleanEntry<{ technologyId: string; name: string }>(item, ["technologyId", "name"], []))
        .filter((item): item is { technologyId: string; name: string } => item !== null)
        .slice(0, 50)
    : [];

  const gallery = Array.isArray(record.gallery)
    ? record.gallery
        .map((item) => cleanEntry<{ url: string; alt?: string; caption?: string }>(item, ["url"], ["alt", "caption"]))
        .filter((item): item is { url: string; alt?: string; caption?: string } => item !== null)
        .map((item) => ({ ...item, alt: item.alt ?? "" }))
        .slice(0, 50)
    : [];

  let displayOrder = 0;
  if (typeof record.displayOrder === "number" && Number.isFinite(record.displayOrder)) {
    displayOrder = Math.max(0, Math.min(9999, Math.trunc(record.displayOrder)));
  }

  return {
    slug: asString(record.slug, 200),
    title,
    category: asString(record.category, STRING_CAPS.category),
    features: asStringArray(record.features).slice(0, 30),
    summary,
    fullDescription,
    status: "draft",
    coverImage: asString(record.coverImage, STRING_CAPS.coverImage),
    coverImageAlt: asString(record.coverImageAlt, STRING_CAPS.coverImageAlt),
    gallery,
    githubUrl: asString(record.githubUrl, STRING_CAPS.githubUrl),
    liveUrl: asString(record.liveUrl, STRING_CAPS.liveUrl),
    techStack,
    skillIds: asStringArray(record.skillIds),
    folderStructure: asString(record.folderStructure, STRING_CAPS.folderStructure),
    architectureExplanation: asString(record.architectureExplanation, STRING_CAPS.architectureExplanation),
    dataFlow: asString(record.dataFlow, STRING_CAPS.dataFlow),
    reactPatterns: cleanEntryList<{ name: string; rationale: string }>(record.reactPatterns, ["name", "rationale"]),
    algorithms: cleanEntryList<{ name: string; rationale: string; complexity?: string }>(
      record.algorithms,
      ["name", "rationale"],
      ["complexity"]
    ),
    performanceOptimizations: cleanEntryList<{ technique: string; impact?: string }>(
      record.performanceOptimizations,
      ["technique"],
      ["impact"]
    ),
    challenges: cleanEntryList<{ challenge: string; resolution: string }>(record.challenges, ["challenge", "resolution"]),
    lessonsLearned: asString(record.lessonsLearned, STRING_CAPS.lessonsLearned),
    aiPrompts: cleanEntryList<{ purpose: string; prompt: string }>(record.aiPrompts, ["purpose", "prompt"]),
    aiMistakes: cleanEntryList<{ mistake: string; caughtBy: string; correction: string }>(record.aiMistakes, [
      "mistake",
      "caughtBy",
      "correction",
    ]),
    engineeringDecisions: cleanEntryList<{ decision: string; alternatives?: string[]; rationale: string }>(
      record.engineeringDecisions,
      ["decision", "rationale"],
      ["alternatives"]
    ).map((entry) => ({ ...entry, alternatives: entry.alternatives ?? [] })),
    featured: record.featured === true,
    displayOrder,
  };
}

/**
 * Publish-time rules. Drafts only need title/summary/fullDescription
 * (already enforced by parseProjectPayload).
 */
export function validateProject(values: ProjectInput, status: "draft" | "published"): Record<string, string> {
  const errors: Record<string, string> = {};
  if (status !== "published") return errors;

  if (!values.summary) errors.summary = "Summary is required to publish.";
  if (values.techStack.length === 0) errors.techStack = "At least one technology is required to publish.";
  for (const key of ["githubUrl", "liveUrl"] as const) {
    const url = values[key];
    if (url && !/^https?:\/\//.test(url)) errors[key] = "Must start with http:// or https://";
  }
  return errors;
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "project"
  );
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 1;
  // Indexed lookup per attempt; collision on a slug this short is rare.
  while (await ProjectModel.exists({ slug })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

function revalidatePublicProjectPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

// ---------------- Mutations ----------------

export async function createProject(values: ProjectInput, status: ProjectStatus): Promise<Project> {
  await connectToDatabase();
  const slug = await uniqueSlug(values.slug || slugify(values.title));
  const doc = await ProjectModel.create({ ...values, slug, status });
  revalidatePublicProjectPages(slug);
  return toProject(doc);
}

export async function updateProject(id: string, values: ProjectInput, status: ProjectStatus): Promise<Project | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const existing = await ProjectModel.findById(id);
  if (!existing) return null;
  // Slug is immutable after create — public URLs stay stable.
  existing.set({ ...values, slug: existing.slug, status });
  const doc = await existing.save();
  revalidatePublicProjectPages(doc.slug);
  return toProject(doc);
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isValidObjectId(id)) return false;
  await connectToDatabase();
  const doc = await ProjectModel.findByIdAndDelete(id);
  if (!doc) return false;
  revalidatePublicProjectPages(doc.slug);
  return true;
}
