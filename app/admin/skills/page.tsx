import type { Metadata } from "next";

import { SkillsManager } from "@/features/admin/components/skills-manager";
import { getAllSkills } from "@/features/home/lib/skills";

export const metadata: Metadata = {
  title: "Manage skills - Admin",
};

export default async function AdminSkillsPage() {
  const skills = await getAllSkills();

  return <SkillsManager initialSkills={skills} />;
}
