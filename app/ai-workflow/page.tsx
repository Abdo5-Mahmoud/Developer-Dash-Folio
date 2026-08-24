import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AiAssistant } from "@/features/ai-workflow/components/ai-assistant";

export const metadata: Metadata = {
  title: "AI Workflow",
  description:
    "Ask the portfolio assistant about skills, projects, technologies, and contact information.",
};

export default function page() {
  return (
    <div className="flex overflow-hidden flex-col min-h-screen">
      <Navbar />
      <main className="overflow-hidden flex-1 min-h-0">
        <section className="px-6 pt-16 pb-10 mx-auto w-full max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            AI Workflow
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Ask the portfolio assistant about Abdullah Mahmoud&apos;s skills,
            projects, technologies, and how to get in touch. Responses are
            grounded strictly in information published on this site.
          </p>
        </section>

        <section className="px-6 py-10 mx-auto w-full max-w-3xl">
          <AiAssistant />
        </section>
      </main>
      <Footer />
    </div>
  );
}
