import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Callout } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code-block";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Navbar } from "@/components/ui/navbar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { TableOfContents } from "@/components/ui/table-of-contents";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "AI Workflow", href: "/ai-workflow" },
  { label: "About", href: "/about" },
];

const SIDEBAR_GROUPS = [
  {
    title: "Getting started",
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Architecture", href: "#architecture" },
    ],
  },
  {
    title: "Engineering",
    links: [
      { label: "Data flow", href: "#data-flow" },
      { label: "Performance", href: "#performance" },
      { label: "Challenges", href: "#challenges" },
    ],
  },
];

const TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture", depth: 3 as const },
  { id: "data-flow", label: "Data flow" },
];

const EXAMPLE_CODE = `export function useProjectQuery(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProject(slug),
    staleTime: 5 * 60 * 1000,
  });
}`;

export default function ShowcasePage() {
  return (
    <TooltipProvider>
      <Navbar links={NAV_LINKS} />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumbs items={[{ label: "Docs", href: "/" }, { label: "Design System" }]} className="mb-6" />

        <div className="mb-12 flex flex-col gap-3">
          <Badge variant="default">Component library</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Devfolio AI — Design System</h1>
          <p className="max-w-xl text-muted-foreground">
            Neutral grayscale, one blue accent, documentation-first layout. Every primitive below is exported
            from <code className="font-mono text-xs">components/ui</code> and ready to compose.
          </p>
        </div>

        <div className="flex gap-12">
          <SidebarNav groups={SIDEBAR_GROUPS} activeHref="#overview" className="hidden lg:flex" />

          <div className="flex-1 space-y-16">
            {/* Buttons */}
            <section id="overview" className="scroll-mt-20 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Buttons</h2>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link button</Button>
                <Button loading>Loading</Button>
              </div>
            </section>

            <Separator />

            {/* Badges */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Badges</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success" dot>
                  Shipped
                </Badge>
                <Badge variant="warning" dot>
                  In progress
                </Badge>
                <Badge variant="danger" dot>
                  Deprecated
                </Badge>
              </div>
            </section>

            <Separator />

            {/* Cards */}
            <section id="architecture" className="scroll-mt-20 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Cards</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Realtime Sync Engine</CardTitle>
                    <CardDescription>Conflict-free replicated data type for offline-first editing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="neutral">TypeScript</Badge>
                      <Badge variant="neutral">WebSockets</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="secondary">
                      View case study
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Workflow Log</CardTitle>
                    <CardDescription>Prompt history and architectural decisions, versioned per feature.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="neutral">MongoDB</Badge>
                      <Badge variant="neutral">Next.js</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="secondary">
                      View case study
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Form elements */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Form elements</h2>
              <div className="max-w-sm space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Ada Lovelace" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us about the project…" />
                </div>
              </div>
            </section>

            <Separator />

            {/* Avatars & Tooltip */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Avatars &amp; tooltips</h2>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" alt="" />
                  <AvatarFallback>DF</AvatarFallback>
                </Avatar>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Hover me
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Deployed 3 minutes ago</TooltipContent>
                </Tooltip>
              </div>
            </section>

            <Separator />

            {/* Tabs */}
            <section id="data-flow" className="scroll-mt-20 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Tabs</h2>
              <Tabs defaultValue="overview" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="decisions">Decisions</TabsTrigger>
                  <TabsTrigger value="prompts">AI prompts</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">A CRDT-backed sync layer for the editor, chosen for offline resilience.</TabsContent>
                <TabsContent value="decisions">Considered OT; chose CRDTs for simpler conflict resolution at the edge.</TabsContent>
                <TabsContent value="prompts">Prompt history is logged per commit and shown in the AI Workflow tab.</TabsContent>
              </Tabs>
            </section>

            <Separator />

            {/* Callouts */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Callouts</h2>
              <div className="space-y-3">
                <Callout variant="info" title="Why this matters">
                  This pattern trades a small memory overhead for guaranteed convergence without a central server.
                </Callout>
                <Callout variant="warning" title="Known limitation">
                  Tombstones accumulate over long sessions; a compaction pass runs every 500 operations.
                </Callout>
                <Callout variant="success" title="Result">
                  p95 sync latency dropped from 420ms to 60ms after switching transports.
                </Callout>
              </div>
            </section>

            <Separator />

            {/* Code block */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Code block</h2>
              <CodeBlock code={EXAMPLE_CODE} filename="use-project-query.ts" />
            </section>
          </div>

          <TableOfContents items={TOC_ITEMS} className="hidden xl:block" />
        </div>
      </main>
    </TooltipProvider>
  );
}
