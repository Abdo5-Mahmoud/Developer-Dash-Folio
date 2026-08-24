import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  CONTACT_CHANNELS,
  PROFILE_CONTACT,
} from "@/features/contact/data/contact";
import { ContactChannels } from "@/features/contact/components/contact-channels";
import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Abdullah Mahmoud",
  description:
    "Get in touch about opportunities, freelance work, or collaborations via email, LinkedIn, GitHub, or the contact form.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border bg-surface-sunken/30">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <Badge variant="outline" className="mb-4">
              Contact
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Let&apos;s work together.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I&apos;m open to frontend and full-stack opportunities, freelance
              work, and thoughtful collaborations. Reach out through whichever
              channel suits you.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-8 lg:col-span-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Direct channels
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Prefer to skip the form? Use any of these to reach{" "}
                  {PROFILE_CONTACT.name} directly. Messages typically get a
                  response within a couple of days.
                </p>
              </div>
              <ContactChannels channels={CONTACT_CHANNELS} />
            </div>

            <Card className="p-6 md:p-8 lg:col-span-7">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Send a message
              </h2>
              <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell me a little about what you have in mind.
              </p>
              <ContactForm />
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
