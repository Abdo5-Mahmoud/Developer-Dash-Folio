export interface GalleryImage {
  url: string;
  alt: string;
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
  category?: string;
  fullDescription: string;
  features?: string[];
  status: ProjectStatus;
  coverImage?: string;
  coverImageAlt?: string;
  gallery: GalleryImage[];
  githubUrl?: string;
  liveUrl?: string;
  techStack: StackEntry[];
  skillIds: string[];
  folderStructure?: string;
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

export interface ProjectCardData {
  slug: string;
  title: string;
  summary: string;
  category?: string;
  coverImage?: string;
  coverImageAlt: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}
