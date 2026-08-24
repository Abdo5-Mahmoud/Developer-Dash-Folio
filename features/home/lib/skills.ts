import { SKILLS, SKILL_CATEGORIES, TECHNOLOGIES } from "../data/skills";
import type { Skill, SkillCategory, Technology } from "../types/skill";

export async function getAllSkills(): Promise<Skill[]> {
  return SKILLS;
}

export async function getAllTechnologies(): Promise<string[]> {
  return TECHNOLOGIES.map((t) => t.name);
}

export async function getAllTechnologyEntities(): Promise<Technology[]> {
  return TECHNOLOGIES;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  return SKILL_CATEGORIES;
}
