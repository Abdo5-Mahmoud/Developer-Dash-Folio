import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { Project } from "../types/project";

export function ProjectScreenshots({ project }: { project: Project }) {
  if (project.gallery.length === 0) {
    return null;
  }

  return (
    <article aria-labelledby="screenshots-heading" className="space-y-6">
      <div>
        <h2
          id="screenshots-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Screenshots &amp; Interface
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Interface walkthrough and component states.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {project.gallery.map((image) => (
          <figure key={image.url}>
            <Card className="overflow-hidden border border-border bg-surface">
              <div className="relative aspect-video">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Card>
            {image.caption && (
              <figcaption className="mt-3 text-xs font-medium text-muted-foreground">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </article>
  );
}
