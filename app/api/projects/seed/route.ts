import { getAllTechnologies } from "@/features/home/lib/technologies";
import { fetchGithubImport } from "@/lib/github";
import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/lib/models/project";
import { requireAdminSession } from "@/lib/session";

const PROJECTS_TO_SEED = [
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
] as const;

function technologyCategory(name: string) {
  if (["Node.js", "Express.js", "Socket.IO"].includes(name)) {
    return "Backend" as const;
  }
  if (["MongoDB", "PostgreSQL", "Supabase"].includes(name)) {
    return "Database" as const;
  }
  return "Frontend" as const;
}

export async function POST() {
  if (!(await requireAdminSession())) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const existingTechnologies = await getAllTechnologies();
    const technologyByName = new Map(
      existingTechnologies.map((technology) => [
        technology.name.toLowerCase(),
        technology,
      ]),
    );

    for (const config of PROJECTS_TO_SEED) {
      const githubUrl = `https://github.com/${config.owner}/${config.repository}`;
      const imported = await fetchGithubImport(githubUrl);
      const techStack = [];

      for (const language of imported.githubMetadata.languages) {
        let technology = technologyByName.get(language.name.toLowerCase());
        if (!technology) {
          const created = await import("@/lib/models/technology").then(
            ({ TechnologyModel }) =>
              TechnologyModel.findOneAndUpdate(
                { name: language.name },
                {
                  $setOnInsert: {
                    name: language.name,
                    category: technologyCategory(language.name),
                  },
                },
                { upsert: true, new: true },
              ).lean(),
          );
          technology = {
            id: created._id.toString(),
            name: created.name,
            category: created.category,
          };
          technologyByName.set(language.name.toLowerCase(), technology);
        }
        techStack.push({ technologyId: technology.id, name: technology.name });
      }

      await ProjectModel.findOneAndUpdate(
        { slug: config.slug },
        {
          $set: {
            title: imported.title,
            category: config.category,
            features: imported.features,
            summary: imported.summary,
            fullDescription: imported.fullDescription,
            status: "published",
            coverImage: `https://opengraph.githubassets.com/1/${config.owner}/${config.repository}`,
            coverImageAlt: `${imported.title} project preview`,
            gallery: [],
            githubUrl: imported.githubUrl,
            liveUrl: "liveUrl" in config ? config.liveUrl : undefined,
            techStack,
            skillIds: [],
            githubMetadata: imported.githubMetadata,
            featured: true,
            displayOrder: config.displayOrder,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    return Response.json({
      ok: true,
      count: PROJECTS_TO_SEED.length,
      projects: PROJECTS_TO_SEED.map(({ slug }) => slug),
    });
  } catch {
    return Response.json(
      {
        ok: false,
        error:
          "Project seeding failed. Check GitHub and database connectivity.",
      },
      { status: 502 },
    );
  }
}
