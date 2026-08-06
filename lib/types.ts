// Shared types — this is the contract your Mongoose schemas and API routes
// should satisfy. Keep this file in sync with lib/models/*.

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface StackEntry {
  technologyId: string;
  name: string; // denormalized for display
}

export interface PatternEntry {
  name: string;
  rationale: string;
}

export interface AlgorithmEntry {
  name: string;
  rationale: string;
  complexity?: string;
}

export interface PerformanceEntry {
  technique: string;
  impact?: string;
}

export interface ChallengeEntry {
  challenge: string;
  resolution: string;
}

export interface AIPromptEntry {
  purpose: string;
  prompt: string;
}

export interface AIMistakeEntry {
  mistake: string;
  caughtBy: string;
  correction: string;
}

export interface DecisionEntry {
  decision: string;
  alternatives: string[];
  rationale: string;
}

export type ProjectStatus = "draft" | "published";

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  fullDescription: string; // rich text / markdown
  status: ProjectStatus;
  coverImage: string;
  gallery: GalleryImage[];
  githubUrl?: string;
  liveUrl?: string;
  techStack: StackEntry[];
  skillIds: string[];
  folderStructure?: string; // monospace tree text
  architectureExplanation?: string;
  dataFlow?: string;
  reactPatterns: PatternEntry[];
  algorithms: AlgorithmEntry[];
  performanceOptimizations: PerformanceEntry[];
  challenges: ChallengeEntry[];
  lessonsLearned?: string;
  aiPrompts: AIPromptEntry[];
  aiMistakes: AIMistakeEntry[];
  engineeringDecisions: DecisionEntry[];
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "Language" | "Framework" | "Concept" | "Soft skill";
  proficiency?: "Familiar" | "Proficient" | "Expert";
}

export interface Technology {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "AI Tooling";
  iconUrl?: string;
  officialUrl?: string;
}
