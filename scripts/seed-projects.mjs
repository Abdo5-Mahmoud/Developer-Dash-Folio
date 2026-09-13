// Imports the first public portfolio projects from GitHub into MongoDB.
// Idempotent: rerunning this script updates the selected records by slug.
// Usage: npm run seed:projects -- owner@example.com
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

function loadLocalEnvironment() {
  if (process.env.MONGODB_URI) return;

  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
      }
    }
  } catch {
    // The missing-URI check below reports the actionable error.
  }
}

loadLocalEnvironment();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

const OWNER_EMAIL = (process.argv[2] || process.env.OWNER_EMAIL)
  ?.trim()
  .toLowerCase();
if (!OWNER_EMAIL) {
  console.error("Usage: npm run seed:projects -- owner@example.com");
  process.exit(1);
}

const PROJECTS = [
  {
    owner: "Abdo5-Mahmoud",
    repository: "Inventory-Dashboard",
    slug: "inventory-management-dashboard",
    category: "Frontend / Full Stack",
    liveUrl: "https://inventory-dashboard-beryl-zeta.vercel.app",
    displayOrder: 1,
  },
  {
    owner: "Abdo5-Mahmoud",
    repository: "Developer-Dash-Folio",
    slug: "developer-dash-folio",
    category: "Frontend / Full Stack",
    displayOrder: 2,
  },
  {
    owner: "Abdo5-Mahmoud",
    repository: "chatApp_frontend",
    slug: "chat-app-frontend",
    category: "Frontend / Full Stack",
    displayOrder: 3,
  },
  {
    owner: "Abdo5-Mahmoud",
    repository: "Hotel-Management-System",
    slug: "hotel-management-system",
    category: "Frontend / Full Stack",
    displayOrder: 4,
  },
];

const RepositorySchema = new mongoose.Schema(
  {
    name: String,
    default_branch: String,
    description: String,
    language: String,
    topics: [String],
    stargazers_count: Number,
    forks_count: Number,
  },
  { strict: false },
);

const TechnologySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  iconUrl: String,
  officialUrl: String,
});

const ProjectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: String,
    features: [String],
    summary: { type: String, required: true },
    fullDescription: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"] },
    coverImage: String,
    coverImageAlt: String,
    gallery: [{ url: String, alt: String, caption: String }],
    githubUrl: String,
    liveUrl: String,
    techStack: [{ technologyId: String, name: String }],
    skillIds: [String],
    folderStructure: String,
    architectureExplanation: String,
    dataFlow: String,
    reactPatterns: [{ name: String, rationale: String }],
    algorithms: [{ name: String, rationale: String, complexity: String }],
    performanceOptimizations: [{ technique: String, impact: String }],
    challenges: [{ challenge: String, resolution: String }],
    lessonsLearned: String,
    aiPrompts: [{ purpose: String, prompt: String }],
    aiMistakes: [{ mistake: String, caughtBy: String, correction: String }],
    engineeringDecisions: [
      { decision: String, alternatives: [String], rationale: String },
    ],
    githubMetadata: {
      owner: String,
      repository: String,
      defaultBranch: String,
      description: String,
      language: String,
      topics: [String],
      stars: Number,
      forks: Number,
      languages: [{ name: String, bytes: Number }],
      lastSyncedAt: Date,
    },
    featured: Boolean,
    displayOrder: Number,
  },
  { timestamps: true },
);

const Repository =
  mongoose.models.SeedRepository ||
  mongoose.model("SeedRepository", RepositorySchema);
const Technology =
  mongoose.models.Technology || mongoose.model("Technology", TechnologySchema);
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const User =
  mongoose.models.User ||
  mongoose.model("User", new mongoose.Schema({ email: String, role: String }));

async function githubRequest(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "devfolio-project-seed",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}`);
  }
  return response.json();
}

function decodeReadme(readme) {
  if (!readme.content || readme.encoding !== "base64") return "";
  return Buffer.from(readme.content.replace(/\s/g, ""), "base64")
    .toString("utf8")
    .trim()
    .slice(0, 20000);
}

function technologyCategory(name) {
  return ["Node.js", "Express.js", "Socket.IO"].includes(name)
    ? "Backend"
    : ["MongoDB", "PostgreSQL", "Supabase"].includes(name)
      ? "Database"
      : "Frontend";
}

async function ensureTechnologies(languages) {
  const entries = [];
  for (const language of languages) {
    const technology = await Technology.findOneAndUpdate(
      { name: language.name },
      {
        $setOnInsert: {
          name: language.name,
          category: technologyCategory(language.name),
        },
      },
      { new: true, upsert: true },
    ).lean();
    entries.push({
      technologyId: technology._id.toString(),
      name: technology.name,
    });
  }
  return entries;
}

async function importProject(config, ownerId) {
  const basePath = `/repos/${config.owner}/${config.repository}`;
  const [details, languageMap, readme] = await Promise.all([
    githubRequest(basePath),
    githubRequest(`${basePath}/languages`),
    githubRequest(`${basePath}/readme`).catch(() => ({})),
  ]);

  const languages = Object.entries(languageMap)
    .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
    .slice(0, 10)
    .map(([name, bytes]) => ({ name, bytes }));
  const techStack = await ensureTechnologies(languages);
  const githubUrl = `https://github.com/${config.owner}/${config.repository}`;
  const fullDescription =
    decodeReadme(readme) ||
    details.description ||
    `Public project: ${details.name}.`;
  const summary = details.description || `A public project by ${config.owner}.`;

  await Project.findOneAndUpdate(
    { slug: config.slug },
    {
      $set: {
        ownerId,
        title: details.name,
        category: config.category,
        features: (details.topics ?? []).slice(0, 20),
        summary: summary.slice(0, 500),
        fullDescription,
        status: "published",
        coverImage: `https://opengraph.githubassets.com/1/${config.owner}/${config.repository}`,
        coverImageAlt: `${details.name} project preview`,
        gallery: [],
        githubUrl,
        liveUrl: config.liveUrl,
        techStack,
        skillIds: [],
        githubMetadata: {
          owner: config.owner,
          repository: config.repository,
          defaultBranch: details.default_branch,
          description: details.description ?? undefined,
          language: details.language ?? undefined,
          topics: (details.topics ?? []).slice(0, 20),
          stars: details.stargazers_count ?? 0,
          forks: details.forks_count ?? 0,
          languages,
          lastSyncedAt: new Date().toISOString(),
        },
        featured: true,
        displayOrder: config.displayOrder,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(
    `Published ${details.name} (${languages.map(({ name }) => name).join(", ")})`,
  );
}

try {
  await mongoose.connect(MONGODB_URI);
  const owner = await User.findOne({
    email: OWNER_EMAIL,
    role: "owner",
  }).lean();
  if (!owner) {
    throw new Error("Owner account not found. Run npm run seed:owner first.");
  }
  for (const project of PROJECTS) {
    await importProject(project, owner._id.toString());
  }
  console.log(`Published ${PROJECTS.length} projects.`);
} catch (error) {
  console.error(
    "Project seeding failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
