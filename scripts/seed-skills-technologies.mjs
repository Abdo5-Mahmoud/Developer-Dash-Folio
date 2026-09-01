// One-time migration: seeds the initial Skills and Technologies (formerly
// static data in features/home/data/skills.ts) into MongoDB. Idempotent —
// entries whose name already exists (case-insensitive) are skipped.
// Usage: npm run seed:skills-technologies
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // fall through — the missing-URI check below reports the problem
  }
}

const INITIAL_SKILLS = [
  { name: "System Design", category: "Concept", proficiency: "Proficient" },
  { name: "React", category: "Framework", proficiency: "Expert" },
  {
    name: "AI-assisted development",
    category: "Concept",
    proficiency: "Expert",
  },
  {
    name: "Performance optimization",
    category: "Concept",
    proficiency: "Proficient",
  },
];

const INITIAL_TECHNOLOGIES = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "MongoDB", category: "Database" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Claude API", category: "AI Tooling" },
  { name: "Node.js", category: "Backend" },
  { name: "Docker", category: "DevOps" },
  { name: "Recharts", category: "Frontend" },
  { name: "TanStack Query", category: "Frontend" },
  { name: "Socket.IO", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "Zod", category: "Backend" },
];

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["Language", "Framework", "Concept", "Soft skill"],
    required: true,
  },
  proficiency: { type: String, enum: ["Familiar", "Proficient", "Expert"] },
});

const TechnologySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "Database", "DevOps", "AI Tooling"],
    required: true,
  },
  iconUrl: String,
  officialUrl: String,
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

try {
  await mongoose.connect(uri);

  const Skill = mongoose.model("Skill", SkillSchema);
  const Technology = mongoose.model("Technology", TechnologySchema);

  const existingSkills = new Set(
    (await Skill.find().select("name").lean()).map((doc) =>
      doc.name.toLowerCase(),
    ),
  );
  const newSkills = INITIAL_SKILLS.filter(
    (skill) => !existingSkills.has(skill.name.toLowerCase()),
  );
  if (newSkills.length > 0) await Skill.insertMany(newSkills);
  console.log(`Skills: inserted ${newSkills.length}, skipped ${INITIAL_SKILLS.length - newSkills.length}`);

  const existingTechnologies = new Set(
    (await Technology.find().select("name").lean()).map((doc) =>
      doc.name.toLowerCase(),
    ),
  );
  const newTechnologies = INITIAL_TECHNOLOGIES.filter(
    (technology) => !existingTechnologies.has(technology.name.toLowerCase()),
  );
  if (newTechnologies.length > 0) await Technology.insertMany(newTechnologies);
  console.log(
    `Technologies: inserted ${newTechnologies.length}, skipped ${INITIAL_TECHNOLOGIES.length - newTechnologies.length}`,
  );
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
