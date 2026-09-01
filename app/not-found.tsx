import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-surface-sunken p-4 ring-1 ring-border">
              <FileQuestion
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The link you followed may be broken, or the page may have been
            removed. If you were looking for a specific project, it might not be
            published yet.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/projects">
                <Briefcase className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse Projects
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
