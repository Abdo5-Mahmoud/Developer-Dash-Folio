import { Schema, model, models, type Document } from "mongoose";

// Mirrors lib/types.ts Project interface. Keep these in sync manually —
// there are only two places (this file + lib/types.ts) so it's cheap to
// eyeball on every schema change.

const GalleryImageSchema = new Schema(
  { url: { type: String, required: true }, caption: String },
  { _id: false }
);

const StackEntrySchema = new Schema(
  {
    technologyId: { type: Schema.Types.ObjectId, ref: "Technology", required: true },
    name: { type: String, required: true }, // denormalized for display — refresh on write
  },
  { _id: false }
);

const PatternEntrySchema = new Schema(
  { name: { type: String, required: true }, rationale: { type: String, required: true } },
  { _id: false }
);

const AlgorithmEntrySchema = new Schema(
  {
    name: { type: String, required: true },
    rationale: { type: String, required: true },
    complexity: String,
  },
  { _id: false }
);

const PerformanceEntrySchema = new Schema(
  { technique: { type: String, required: true }, impact: String },
  { _id: false }
);

const ChallengeEntrySchema = new Schema(
  { challenge: { type: String, required: true }, resolution: { type: String, required: true } },
  { _id: false }
);

const AIPromptEntrySchema = new Schema(
  { purpose: { type: String, required: true }, prompt: { type: String, required: true } },
  { _id: false }
);

const AIMistakeEntrySchema = new Schema(
  {
    mistake: { type: String, required: true },
    caughtBy: { type: String, required: true },
    correction: { type: String, required: true },
  },
  { _id: false }
);

const DecisionEntrySchema = new Schema(
  {
    decision: { type: String, required: true },
    alternatives: [String],
    rationale: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    fullDescription: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    coverImage: { type: String, required: true },
    gallery: [GalleryImageSchema],
    githubUrl: String,
    liveUrl: String,
    techStack: { type: [StackEntrySchema], validate: (v: unknown[]) => v.length > 0 },
    skillIds: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    folderStructure: String,
    architectureExplanation: String,
    dataFlow: String,
    reactPatterns: [PatternEntrySchema],
    algorithms: [AlgorithmEntrySchema],
    performanceOptimizations: [PerformanceEntrySchema],
    challenges: [ChallengeEntrySchema],
    lessonsLearned: String,
    aiPrompts: [AIPromptEntrySchema],
    aiMistakes: [AIMistakeEntrySchema],
    engineeringDecisions: [DecisionEntrySchema],
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true } // gives createdAt / updatedAt to match lib/types.ts
);

export interface ProjectDocument extends Document {
  slug: string;
  title: string;
  status: "draft" | "published";
  featured: boolean;
  displayOrder: number;
  // ...remaining fields match ProjectSchema above / lib/types.ts Project
}

// `models.Project ||` guards against Next.js hot-reload redefining the model
export const ProjectModel = models.Project || model<ProjectDocument>("Project", ProjectSchema);
