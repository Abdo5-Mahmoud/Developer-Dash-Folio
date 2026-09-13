import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { isValidObjectId, Types } from "mongoose";
import { cache } from "react";

import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel, type ProjectDocument } from "@/lib/models/project";
import { SkillModel } from "@/lib/models/skill";

import type {
  Project,
  ProjectCardData,
  ProjectInput,
  ProjectStatus,
} from "../types/project";

function toProject(
  doc: ProjectDocument & {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  },
): Project {
  return {
    id: doc._id.toString(),
    ownerId: doc.ownerId,
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
    githubMetadata: doc.githubMetadata
      ? {
          ...doc.githubMetadata,
          lastSyncedAt: doc.githubMetadata.lastSyncedAt?.toISOString(),
        }
      : undefined,
    featured: doc.featured,
    displayOrder: doc.displayOrder,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

type ProjectCardDocument = {
  slug: string;
  title: string;
  summary: string;
  category?: string;
  coverImage?: string;
  coverImageAlt?: string;
  techStack?: { name: string }[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
};

function mapProjectCardData(doc: ProjectCardDocument): ProjectCardData {
  return {
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    category: doc.category ?? "Full Stack",
    coverImage: doc.coverImage,
    coverImageAlt: doc.coverImageAlt ?? `${doc.title} project cover image`,
    tech: (doc.techStack ?? []).map((t) => t.name).filter(Boolean),
    githubUrl: doc.githubUrl,
    liveUrl: doc.liveUrl,
    featured: doc.featured,
  };
}

async function fetchProjectCardData(
  featuredOnly = false,
): Promise<ProjectCardData[]> {
  await connectToDatabase();

  const filter = featuredOnly
    ? ({ status: "published" as const, featured: true } as const)
    : ({ status: "published" as const } as const);

  const docs = (await ProjectModel.find(filter, {
    _id: 0,
    slug: 1,
    title: 1,
    summary: 1,
    category: 1,
    coverImage: 1,
    coverImageAlt: 1,
    "techStack.name": 1,
    githubUrl: 1,
    liveUrl: 1,
    featured: 1,
    displayOrder: 1,
    createdAt: 1,
  })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean()) as ProjectCardDocument[];

  return docs.map(mapProjectCardData);
}

// ---------------- Public reads (published only) ----------------

export async function getAllProjectCardData(): Promise<ProjectCardData[]> {
  return getCachedProjectCardData(false);
}

export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  return getCachedProjectCardData(true);
}

const getCachedProjectCardData = unstable_cache(
  (featuredOnly: boolean) => fetchProjectCardData(featuredOnly),
  ["project-cards"],
  {
    revalidate: 60,
    tags: ["projects"],
  },
);

// ---------------- Public reads (published only) ----------------

export async function getAllProjects(
  includeUnpublished = false,
): Promise<Project[]> {
  await connectToDatabase();
  const query = includeUnpublished ? {} : { status: "published" as const };
  const docs = (await ProjectModel.find(query)
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean()) as Array<
    ProjectDocument & {
      _id: Types.ObjectId;
      createdAt?: Date;
      updatedAt?: Date;
    }
  >;
  return docs.map((doc) =>
    toProject(
      doc as ProjectDocument & {
        _id: Types.ObjectId;
        createdAt?: Date;
        updatedAt?: Date;
      },
    ),
  );
}

export const getProjectBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<Project | null> => {
      await connectToDatabase();
      const doc = await ProjectModel.findOne({
        slug,
        status: "published",
      }).lean<
        | (ProjectDocument & {
            _id: Types.ObjectId;
            createdAt?: Date;
            updatedAt?: Date;
          })
        | null
      >();
      return doc ? toProject(doc) : null;
    },
    ["project-by-slug"],
    { revalidate: 60, tags: ["projects"] },
  ),
);

// ---------------- Knowledge digest (projected, used by AI assistant) ----------------

export type ProjectKnowledgeDigest = {
  slug: string;
  title: string;
  category?: string;
  summary: string;
  fullDescription: string;
  features: string[];
  technologies: string[];
  skills: string[];
  architecture?: string;
  dataFlow?: string;
  reactPatterns: { name: string; rationale: string }[];
  challenges: { challenge: string; resolution: string }[];
  lessonsLearned?: string;
  engineeringDecisions: {
    decision: string;
    alternatives: string[];
    rationale: string;
  }[];
  githubUrl?: string;
  liveUrl?: string;
};

function limitText(value: unknown, maxLength: number): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : undefined;
}

function limitStrings(values: unknown, maxItems: number, maxLength: number) {
  return Array.isArray(values)
    ? values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim().slice(0, maxLength))
        .filter(Boolean)
        .slice(0, maxItems)
    : [];
}

function selectProjectKnowledge(
  project: ProjectKnowledgeDigest,
  question: string,
): number {
  const normalizedQuestion = question.toLowerCase();
  const searchable = [
    project.title,
    project.slug,
    project.category ?? "",
    ...project.technologies,
    ...project.skills,
  ]
    .join(" ")
    .toLowerCase();
  return normalizedQuestion
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && searchable.includes(token)).length;
}

export function rankProjectKnowledge(
  projects: ProjectKnowledgeDigest[],
  question = "",
): ProjectKnowledgeDigest[] {
  if (!question.trim()) return projects;
  return [...projects].sort(
    (first, second) =>
      selectProjectKnowledge(second, question) -
      selectProjectKnowledge(first, question),
  );
}

export async function getProjectKnowledgeDigests(): Promise<
  ProjectKnowledgeDigest[]
> {
  await connectToDatabase();
  const [docs, skills] = await Promise.all([
    ProjectModel.find(
      { status: "published" as const },
      {
        _id: 0,
        slug: 1,
        title: 1,
        category: 1,
        summary: 1,
        fullDescription: 1,
        features: 1,
        githubUrl: 1,
        liveUrl: 1,
        skillIds: 1,
        "techStack.name": 1,
        architectureExplanation: 1,
        dataFlow: 1,
        reactPatterns: 1,
        challenges: 1,
        lessonsLearned: 1,
        engineeringDecisions: 1,
      },
    )
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean(),
    SkillModel.find({}, { _id: 1, name: 1 }).lean(),
  ]);
  const skillNames = new Map(
    skills.map((skill) => [skill._id.toString(), skill.name]),
  );

  return (docs as Array<Record<string, unknown>>).map((doc) => ({
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    category: limitText(doc.category, 100),
    summary: String(doc.summary ?? "").slice(0, 1000),
    fullDescription: String(doc.fullDescription ?? "").slice(0, 6000),
    features: limitStrings(doc.features, 20, 300),
    technologies: Array.isArray(doc.techStack)
      ? doc.techStack
          .filter(
            (entry): entry is { name?: unknown } =>
              typeof entry === "object" && entry !== null,
          )
          .map((entry) => limitText(entry.name, 100))
          .filter((name): name is string => Boolean(name))
          .slice(0, 30)
      : [],
    skills: limitStrings(doc.skillIds, 30, 100).map(
      (id) => skillNames.get(id) ?? id,
    ),
    architecture: limitText(doc.architectureExplanation, 3000),
    dataFlow: limitText(doc.dataFlow, 3000),
    reactPatterns: Array.isArray(doc.reactPatterns)
      ? doc.reactPatterns.slice(0, 15)
      : [],
    challenges: Array.isArray(doc.challenges)
      ? doc.challenges.slice(0, 15)
      : [],
    lessonsLearned: limitText(doc.lessonsLearned, 2000),
    engineeringDecisions: Array.isArray(doc.engineeringDecisions)
      ? doc.engineeringDecisions.slice(0, 15)
      : [],
    githubUrl: limitText(doc.githubUrl, 2000),
    liveUrl: limitText(doc.liveUrl, 2000),
  }));
}

// ---------------- Admin reads (drafts included) ----------------

export async function getAllProjectsAdmin(
  ownerId?: string,
): Promise<Project[]> {
  await connectToDatabase();

  if (ownerId) {
    // Adopt projects created before ownerId was introduced into the only owner's account.
    await ProjectModel.updateMany(
      {
        $or: [
          { ownerId: { $exists: false } },
          { ownerId: null },
          { ownerId: "" },
        ],
      },
      { $set: { ownerId } },
    );
  }

  const docs = await ProjectModel.find(ownerId ? { ownerId } : {})
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();
  return docs.map((doc) => toProject(doc as Parameters<typeof toProject>[0]));
}

export async function getProjectById(
  id: string,
  ownerId?: string,
): Promise<Project | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ProjectModel.findOne({
    _id: id,
    ...(ownerId ? { ownerId } : {}),
  }).lean<
    | (ProjectDocument & {
        _id: Types.ObjectId;
        createdAt?: Date;
        updatedAt?: Date;
      })
    | null
  >();
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
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function cleanEntry<T extends Record<string, unknown>>(
  raw: unknown,
  required: string[],
  optional: string[],
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
  optional: string[] = [],
): T[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => cleanEntry<T>(item, required, optional))
    .filter((item): item is T => item !== null)
    .slice(0, 50);
}

function parseGithubMetadata(raw: unknown): ProjectInput["githubMetadata"] {
  if (typeof raw !== "object" || raw === null) return undefined;
  const record = raw as Record<string, unknown>;
  if (
    typeof record.owner !== "string" ||
    typeof record.repository !== "string"
  ) {
    return undefined;
  }

  const languages = Array.isArray(record.languages)
    ? record.languages
        .filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" && item !== null,
        )
        .map((item) => ({
          name:
            typeof item.name === "string" ? item.name.trim().slice(0, 100) : "",
          bytes:
            typeof item.bytes === "number" && Number.isFinite(item.bytes)
              ? Math.max(0, item.bytes)
              : 0,
        }))
        .filter((item) => item.name)
        .slice(0, 20)
    : [];

  return {
    owner: record.owner.trim().slice(0, 100),
    repository: record.repository.trim().slice(0, 200),
    defaultBranch: asString(record.defaultBranch, 200),
    description: asString(record.description, 500),
    language: asString(record.language, 100),
    topics: asStringArray(record.topics).slice(0, 20),
    stars:
      typeof record.stars === "number" && Number.isFinite(record.stars)
        ? Math.max(0, Math.trunc(record.stars))
        : 0,
    forks:
      typeof record.forks === "number" && Number.isFinite(record.forks)
        ? Math.max(0, Math.trunc(record.forks))
        : 0,
    languages,
    lastSyncedAt: asString(record.lastSyncedAt, 100),
  };
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
  const fullDescription = asString(
    record.fullDescription,
    STRING_CAPS.fullDescription,
  );
  if (!summary || !fullDescription) return null;

  const techStack = Array.isArray(record.techStack)
    ? record.techStack
        .map((item) =>
          cleanEntry<{ technologyId: string; name: string }>(
            item,
            ["technologyId", "name"],
            [],
          ),
        )
        .filter(
          (item): item is { technologyId: string; name: string } =>
            item !== null,
        )
        .slice(0, 50)
    : [];

  const gallery = Array.isArray(record.gallery)
    ? record.gallery
        .map((item) =>
          cleanEntry<{ url: string; alt?: string; caption?: string }>(
            item,
            ["url"],
            ["alt", "caption"],
          ),
        )
        .filter(
          (item): item is { url: string; alt?: string; caption?: string } =>
            item !== null,
        )
        .map((item) => ({ ...item, alt: item.alt ?? "" }))
        .slice(0, 50)
    : [];

  let displayOrder = 0;
  if (
    typeof record.displayOrder === "number" &&
    Number.isFinite(record.displayOrder)
  ) {
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
    folderStructure: asString(
      record.folderStructure,
      STRING_CAPS.folderStructure,
    ),
    architectureExplanation: asString(
      record.architectureExplanation,
      STRING_CAPS.architectureExplanation,
    ),
    dataFlow: asString(record.dataFlow, STRING_CAPS.dataFlow),
    reactPatterns: cleanEntryList<{ name: string; rationale: string }>(
      record.reactPatterns,
      ["name", "rationale"],
    ),
    algorithms: cleanEntryList<{
      name: string;
      rationale: string;
      complexity?: string;
    }>(record.algorithms, ["name", "rationale"], ["complexity"]),
    performanceOptimizations: cleanEntryList<{
      technique: string;
      impact?: string;
    }>(record.performanceOptimizations, ["technique"], ["impact"]),
    challenges: cleanEntryList<{ challenge: string; resolution: string }>(
      record.challenges,
      ["challenge", "resolution"],
    ),
    lessonsLearned: asString(record.lessonsLearned, STRING_CAPS.lessonsLearned),
    aiPrompts: cleanEntryList<{ purpose: string; prompt: string }>(
      record.aiPrompts,
      ["purpose", "prompt"],
    ),
    aiMistakes: cleanEntryList<{
      mistake: string;
      caughtBy: string;
      correction: string;
    }>(record.aiMistakes, ["mistake", "caughtBy", "correction"]),
    engineeringDecisions: cleanEntryList<{
      decision: string;
      alternatives?: string[];
      rationale: string;
    }>(
      record.engineeringDecisions,
      ["decision", "rationale"],
      ["alternatives"],
    ).map((entry) => ({ ...entry, alternatives: entry.alternatives ?? [] })),
    githubMetadata: parseGithubMetadata(record.githubMetadata),
    featured: record.featured === true,
    displayOrder,
  };
}

/**
 * Publish-time rules. Drafts only need title/summary/fullDescription
 * (already enforced by parseProjectPayload).
 */
export function validateProject(
  values: ProjectInput,
  status: "draft" | "published",
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (status !== "published") return errors;

  if (!values.summary) errors.summary = "Summary is required to publish.";
  if (values.techStack.length === 0)
    errors.techStack = "At least one technology is required to publish.";
  for (const key of ["githubUrl", "liveUrl"] as const) {
    const url = values[key];
    if (url && !/^https?:\/\//.test(url))
      errors[key] = "Must start with http:// or https://";
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
  revalidateTag("projects", "max");
}

// ---------------- Mutations ----------------

export async function createProject(
  values: ProjectInput,
  status: ProjectStatus,
  ownerId?: string,
): Promise<Project> {
  await connectToDatabase();
  const slug = await uniqueSlug(values.slug || slugify(values.title));
  const doc = await ProjectModel.create({ ...values, ownerId, slug, status });
  revalidatePublicProjectPages(slug);
  return toProject(doc);
}

export async function updateProject(
  id: string,
  values: ProjectInput,
  status: ProjectStatus,
  ownerId?: string,
): Promise<Project | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const existing = await ProjectModel.findOne({
    _id: id,
    ...(ownerId ? { ownerId } : {}),
  });
  if (!existing) return null;
  // Slug is immutable after create — public URLs stay stable.
  existing.set({ ...values, ownerId, slug: existing.slug, status });
  const doc = await existing.save();
  revalidatePublicProjectPages(doc.slug);
  return toProject(doc);
}

export async function deleteProject(
  id: string,
  ownerId?: string,
): Promise<boolean> {
  if (!isValidObjectId(id)) return false;
  await connectToDatabase();
  const doc = await ProjectModel.findOneAndDelete({
    _id: id,
    ...(ownerId ? { ownerId } : {}),
  });
  if (!doc) return false;
  revalidatePublicProjectPages(doc.slug);
  return true;
}

export async function updateProjectGithubMetadata(
  id: string,
  githubMetadata: NonNullable<ProjectDocument["githubMetadata"]>,
  ownerId?: string,
): Promise<Project | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ProjectModel.findByIdAndUpdate(
    { _id: id, ...(ownerId ? { ownerId } : {}) },
    { $set: { githubMetadata } },
    { new: true },
  );
  if (!doc) return null;
  revalidatePublicProjectPages(doc.slug);
  return toProject(doc);
}
