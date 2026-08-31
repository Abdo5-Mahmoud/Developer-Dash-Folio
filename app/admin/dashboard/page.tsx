import Link from "next/link";

import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProjectsAdmin } from "@/features/projects/lib/projects";

export const metadata = { title: "Admin — Projects" };

export default async function AdminDashboardPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length === 0
              ? "No projects yet — create your first case study."
              : `${projects.length} project${projects.length === 1 ? "" : "s"} (drafts and published)`}
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/admin/projects/new">+ New project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nothing here yet. Create a new project to add your first case study.
        </p>
      ) : (
        <ul className="flex flex-col divide-y rounded-lg border border-border bg-surface">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium text-foreground">{project.title}</span>
                  <Badge variant={project.status === "published" ? "success" : "warning"}>
                    {project.status}
                  </Badge>
                  {project.featured && <Badge variant="neutral">featured</Badge>}
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  /{project.slug} · updated{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                  View
                </Link>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
