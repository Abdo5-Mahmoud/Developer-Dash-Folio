import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { getAllSkills } from "@/lib/data";

export default async function AboutPage() {
  const skills = await getAllSkills();
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pb-10 pt-16">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            About
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            I'm a software engineer who treats documentation as part of the
            build, not an afterthought. This site is that habit made public —
            every project here is written up the way I'd want a teammate to hand
            something off to me.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Skills</h2>
          <div className="flex flex-col gap-5">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <Badge key={s.id} variant="neutral">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
