export interface SkillItem {
  name: string;
  projects?: string[];
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
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
