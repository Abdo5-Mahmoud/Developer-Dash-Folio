import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Zap,
  Lock,
  Workflow,
  AlertTriangle,
  FileCode2,
  ShieldAlert,
  Server,
  Sparkles,
  RefreshCw,
  Eye,
  GitPullRequest,
  Check,
  Flame,
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code-block";
import { Separator } from "@/components/ui/separator";
import { AiAssistant } from "@/features/ai-workflow/components/ai-assistant";

export const metadata: Metadata = {
  title: "AI Workflow & Engineering Protocol — Devfolio AI",
  description:
    "How I engineer software using AI as a junior pair programmer: zero-trust code auditing, strict architectural boundaries, and real P0 production fixes.",
};

const PROTOCOL_PILLARS = [
  {
    step: "01",
    icon: Layers,
    title: "Architecture Before Syntax",
    subtitle: "Design Stage",
    description:
      "Define strict domain models, TypeScript interfaces, and error boundaries before prompting. AI never decides system architecture or data flow.",
    details: [
      "Author strict schemas (Mongoose, Zod/TypeScript) manually.",
      "Specify input/output boundary contracts and HTTP status semantics.",
      "Identify edge cases, network partition risks, and failure states first.",
    ],
  },
  {
    step: "02",
    icon: FileCode2,
    title: "Modular Scaffolding",
    subtitle: "Prompting Stage",
    description:
      "Prompt for isolated, single-responsibility units rather than monolithic pages. Keep context narrow and outputs atomic.",
    details: [
      "Limit prompt scope to 50–100 lines of isolated functional code.",
      "Feed typed interfaces and signature expectations directly into prompts.",
      "Prevent contextual drift and hallucinated third-party dependencies.",
    ],
  },
  {
    step: "03",
    icon: ShieldAlert,
    title: "Zero-Trust Code Auditing",
    subtitle: "Review Stage",
    description:
      "Audit every single generated line as if written by an unverified contributor. Assume runtime edge-case bugs until proven otherwise.",
    details: [
      "Verify connection pooling and promise caching in serverless environments.",
      "Check event loop lifecycle traps and floating unawaited promises.",
      "Inspect memory leak vectors, closure leaks, and cleanup hooks.",
    ],
  },
  {
    step: "04",
    icon: Lock,
    title: "Production Hardening",
    subtitle: "Defense Stage",
    description:
      "Wrap endpoints with defensive infrastructure: honeypot fields, rate limiting, graceful degradation, and resilient background queues.",
    details: [
      "Sliding-window in-memory IP rate limiting against token exhaustion.",
      "Zero-friction honeypot fields to silently sink automated spam bots.",
      "Next.js after() lifecycle execution for resilient serverless side-effects.",
    ],
  },
];

export default function AiWorkflowPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb & Navigation Bar */}
        <section className="border-b border-border bg-surface-sunken/50">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "AI Workflow" }]}
            />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="size-3.5 shrink-0" />
                Back to Home
              </Link>
            </Button>
          </div>
        </section>

        {/* Hero Section */}
        <header className="border-b border-border bg-linear-to-b from-surface to-background px-6 pt-16 pb-14">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="gap-1.5 font-mono text-xs">
                <ShieldCheck className="size-3.5 shrink-0" />
                Zero-Trust Engineering
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Next.js 16 • Serverless Runtimes
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-xs text-success border-success/30"
              >
                P0 Production Audits
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                How I Build with AI: <br className="hidden sm:inline" />
                <span className="text-accent">
                  The Co-Pilot, Not The Autopilot
                </span>
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Generative AI is an extraordinary accelerator for boilerplate,
                syntax translation, and pattern discovery. However, unverified
                AI output deployed into production produces brittle systems
                plagued with memory leaks, serverless lifecycle freezes, and
                silent security holes. This case study details my{" "}
                <span className="font-medium text-foreground">
                  zero-trust engineering protocol
                </span>{" "}
                and analyzes three real production issues caught and resolved
                within this repository.
              </p>
            </div>

            {/* Core Metrics / Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-accent">
                  <Terminal className="size-4 shrink-0" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Philosophy
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Architecture-First
                </p>
                <p className="text-xs text-muted-foreground">
                  Domain boundaries precede prompts
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-success">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Auditing
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Zero-Trust Review
                </p>
                <p className="text-xs text-muted-foreground">
                  Every line verified line-by-line
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-warning">
                  <Cpu className="size-4 shrink-0" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Runtime
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Serverless Aware
                </p>
                <p className="text-xs text-muted-foreground">
                  Container lifecycles & connection pools
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-accent">
                  <Lock className="size-4 shrink-0" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Hardening
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Bot & Rate Guarded
                </p>
                <p className="text-xs text-muted-foreground">
                  Honeypots + sliding-window limits
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl space-y-16 px-6 py-12 md:py-16">
          {/* Section 1: The Paradigm Shift */}
          <section
            className="space-y-6"
            aria-labelledby="paradigm-shift-heading"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Workflow className="size-4 shrink-0" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider">
                  Engineering Philosophy
                </span>
              </div>
              <h2
                id="paradigm-shift-heading"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                The Paradigm Shift: From Passive Prompting to System Leadership
              </h2>
            </div>

            <div className="prose-docs space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                When engineers first adopt LLMs, they often fall into the{" "}
                <strong className="text-foreground">"vibe coding" trap</strong>:
                prompting with ambiguous natural language, expecting the model
                to solve high-level architectural trade-offs, and pasting
                massive multi-file diffs without deep inspection. If it builds
                and passes a superficial smoke test, it ships.
              </p>
              <p>
                In high-reliability software, that approach is catastrophic.
                LLMs are trained on average public codebases—which means their
                default suggestions are riddled with common anti-patterns:
                unhandled promise rejections, lack of graceful backoff, naive
                connection pooling that breaks under serverless concurrency, and
                complete blindness to infrastructure costs or abuse vectors.
              </p>
              <p>
                My authentic engineering pivot was treating AI not as an
                autonomous replacement for architectural thought, but as an{" "}
                <strong className="text-foreground">
                  exceptionally fast, tireless junior pair programmer
                </strong>
                . As the lead engineer, I hold the architectural vision,
                establish domain contracts, and run a rigorous, unsparing code
                review on every single line suggested by the model.
              </p>
            </div>

            {/* Comparative Breakdown Table / Cards */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-danger/30 bg-danger-muted/20 p-5">
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle className="size-4 shrink-0" />
                  <h3 className="font-semibold text-foreground">
                    The Naive "Autopilot" Mindset
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-danger font-mono font-bold">×</span>
                    <span>
                      Asks AI to design architecture and data models from
                      scratch.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger font-mono font-bold">×</span>
                    <span>
                      Generates massive monolithic files spanning 300+ lines in
                      one prompt.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger font-mono font-bold">×</span>
                    <span>
                      Reviews only the happy-path user flow: "Does the button
                      work?"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger font-mono font-bold">×</span>
                    <span>
                      Unaware of serverless container freeze, connection
                      exhaustion, or quota drains.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-success/30 bg-success-muted/20 p-5">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <h3 className="font-semibold text-foreground">
                    The Zero-Trust "Co-Pilot" Protocol
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success font-mono font-bold">✓</span>
                    <span>
                      Defines explicit TypeScript models and state boundaries
                      before opening the AI prompt.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-mono font-bold">✓</span>
                    <span>
                      Scaffolds single-responsibility functions with minimal
                      surface area and strict types.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-mono font-bold">✓</span>
                    <span>
                      Audits every line for memory leaks, unhandled rejections,
                      and edge-case invariants.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-mono font-bold">✓</span>
                    <span>
                      Hardens every public interface with rate limiting,
                      honeypots, and resilient execution.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Section 2: The 4-Step Engineering Protocol */}
          <section className="space-y-8" aria-labelledby="four-pillars-heading">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <GitPullRequest className="size-4 shrink-0" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider">
                  Methodology
                </span>
              </div>
              <h2
                id="four-pillars-heading"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                The 4-Step Zero-Trust Engineering Protocol
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                A repeatable discipline executed on every feature and
                integration built across this portfolio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PROTOCOL_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <Card
                    key={pillar.step}
                    className="flex flex-col justify-between border-border bg-surface transition-all duration-200 hover:border-border-strong"
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-accent">
                          {pillar.step} // {pillar.subtitle}
                        </span>
                        <div className="flex size-8 items-center justify-center rounded-md bg-accent-muted text-accent">
                          <IconComponent className="size-4 shrink-0" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{pillar.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {pillar.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="space-y-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                        {pillar.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="size-3.5 shrink-0 text-accent mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Section 3: Real P0 Production Case Studies from this project */}
          <section
            className="space-y-12"
            aria-labelledby="case-studies-heading"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Flame className="size-4 shrink-0" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider">
                  Verified Evidence
                </span>
              </div>
              <h2
                id="case-studies-heading"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                Proof in Practice: 3 Real P0 Production Audits
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Real code from this repository illustrating the bugs generated
                by standard AI coding patterns and how zero-trust auditing
                caught and hardened them for production.
              </p>
            </div>

            {/* Case 1: Mongoose Cached Rejection */}
            <article className="space-y-4 rounded-lg border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="font-mono text-xs">
                      P0 Critical
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      lib/mongodb.ts
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Case 1: Mongoose Cached Promise Rejection in Serverless
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Connection Pooling
                </Badge>
              </div>

              <div className="prose-docs space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">The AI Trap:</strong> When
                  generating Next.js MongoDB connection helpers, LLMs uniformly
                  recommend caching the connection promise on the Node.js{" "}
                  <code className="rounded bg-code-chrome px-1 py-0.5 font-mono text-xs">
                    global
                  </code>{" "}
                  object to preserve connections across hot reloads and warm
                  lambda invocations.
                </p>
                <p>
                  <strong className="text-foreground">The Hidden Flaw:</strong>{" "}
                  If the initial connection attempt encounters a transient
                  network hiccup, DNS lag, or MongoDB Atlas rate spike,{" "}
                  <code className="rounded bg-code-chrome px-1 py-0.5 font-mono text-xs">
                    cache.promise
                  </code>{" "}
                  permanently caches the{" "}
                  <em className="text-danger">rejected promise</em>. In a warm
                  serverless container, all subsequent requests immediately fail
                  with the cached rejection without ever attempting to
                  reconnect. The entire service remains down until the cloud
                  provider terminates the container.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-mono text-xs font-semibold text-accent">
                  Production Resolution (lib/mongodb.ts:30–35):
                </p>
                <CodeBlock
                  language="typescript"
                  filename="lib/mongodb.ts"
                  code={`// Cache the connection across serverless invocations
if (!cache.promise) {
  // CRITICAL FIX: Catch rejections immediately and null out the cached promise.
  // Without .catch(), any transient failure permanently poisons the warm container.
  cache.promise = mongoose.connect(MONGODB_URI as string).catch((e) => {
    cache.promise = null; // Invalidate cache so the next invocation can self-heal
    throw e;
  });
}
cache.conn = await cache.promise;
return cache.conn;`}
                />
              </div>

              <Callout type="success" title="Audit Insight">
                Never cache naked promises in long-lived module or global scopes
                without explicit cache invalidation on error. A single transient
                failure must not result in a permanent outage.
              </Callout>
            </article>

            {/* Case 2: Serverless Background Execution with Next.js after() */}
            <article className="space-y-4 rounded-lg border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="font-mono text-xs">
                      P0 Reliability
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      app/api/contact/route.ts
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Case 2: Serverless Container Freeze During Background
                    Notifications
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Serverless Execution
                </Badge>
              </div>

              <div className="prose-docs space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">The AI Trap:</strong> In
                  the contact submission flow, we persist the message to MongoDB
                  and alert the portfolio owner via a Telegram webhook. To keep
                  the HTTP response fast for the user, the AI suggested simply
                  firing the external call asynchronously without an{" "}
                  <code className="rounded bg-code-chrome px-1 py-0.5 font-mono text-xs">
                    await
                  </code>
                  :
                  <br />
                  <code className="rounded bg-danger-muted px-1.5 py-0.5 font-mono text-xs text-danger">
                    sendTelegramNotification(values); // AI suggested
                    fire-and-forget
                  </code>
                </p>
                <p>
                  <strong className="text-foreground">The Hidden Flaw:</strong>{" "}
                  Serverless runtimes (such as Vercel Functions or AWS Lambda)
                  immediately freeze execution environments the moment the HTTP
                  response is returned. Unawaited promises floating in the
                  Node.js event loop are paused mid-flight, queued indefinitely,
                  or dropped altogether, causing silent delivery failures.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-mono text-xs font-semibold text-accent">
                  Production Resolution (app/api/contact/route.ts:62–68):
                </p>
                <CodeBlock
                  language="typescript"
                  filename="app/api/contact/route.ts"
                  code={`import { after } from "next/server";

// 1. Await database persistence to guarantee data durability
await connectToDatabase();
await ContactMessageModel.create(values);

// 2. CRITICAL FIX: Use Next.js after() to extend the container lifecycle
// This guarantees the notification completes in the background without blocking the user response.
after(async () => {
  await sendTelegramNotification(values);
});

return Response.json({ ok: true });`}
                />
              </div>

              <Callout type="info" title="Audit Insight">
                Serverless is not a persistent Node daemon. Background
                side-effects must either be explicitly scheduled via runtime
                lifecycle primitives like Next.js{" "}
                <code className="font-mono text-xs">after()</code>, or pushed to
                a dedicated message queue.
              </Callout>
            </article>

            {/* Case 3: Bot Mitigation & Abuse Throttling */}
            <article className="space-y-4 rounded-lg border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="font-mono text-xs">
                      P1 Security
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      app/api/contact/route.ts & lib/rate-limiter.ts
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Case 3: Zero-Friction Bot Mitigation & Token Abuse
                    Throttling
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Defensive API
                </Badge>
              </div>

              <div className="prose-docs space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">The AI Trap:</strong> AI
                  models generate clean, functional API routes that assume every
                  client is a well-behaved human. In the real world, contact
                  forms and LLM-powered endpoints are instantly discovered and
                  hammered by web scrapers, credential stuffing bots, and
                  automated spam engines.
                </p>
                <p>
                  <strong className="text-foreground">The Hidden Flaw:</strong>{" "}
                  Without defensive controls, malicious actors can exhaust LLM
                  token budgets (Gemini API), spam notifications, and flood
                  MongoDB with junk records. Captchas degrade human conversion
                  rates and add heavy external tracking scripts.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-mono text-xs font-semibold text-accent">
                  Production Resolution: Honeypot Trap + Sliding Window Limiter:
                </p>
                <CodeBlock
                  language="typescript"
                  filename="app/api/contact/route.ts"
                  code={`// 1. Sliding-window IP rate limiting
const ip = getClientIp(request);
const { success } = checkRateLimit({
  ip,
  window: 10000, // 10 second burst window
  keyPrefix: "contact",
});

if (!success) {
  return Response.json(
    { ok: false, error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}

// 2. Invisible Honeypot field: bots auto-fill hidden input fields
// Humans never see 'company_url'. If populated, silently succeed without writing to DB.
if (values.company_url) {
  return Response.json({ ok: true }); // Silent sink for automated bots
}`}
                />
              </div>

              <Callout type="warning" title="Audit Insight">
                Never expose unthrottled LLM or database endpoints to the public
                internet. Defense-in-depth requires lightweight in-memory
                velocity tracking paired with frictionless honeypots.
              </Callout>
            </article>
          </section>

          <Separator />

          {/* Section 4: Live Interactive Demonstration */}
          <section
            className="space-y-6"
            aria-labelledby="live-verification-heading"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4 shrink-0" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider">
                  Live System Demo
                </span>
              </div>
              <h2
                id="live-verification-heading"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                Interactive Verification: The Guardrailed Assistant
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Experience the protocol in action. The assistant below is
                governed by strict RAG grounding, input length caps, server-side
                timeout cancellation, and sliding-window rate limiting. It only
                answers questions using verified data published on this
                portfolio.
              </p>
            </div>

            {/* Embedded Live Assistant */}
            <div className="rounded-xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-foreground">
                    Assistant Status: Active & Guardrailed
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">Rate Limit: 10 req/min</span>
                  <span>•</span>
                  <span className="font-mono">
                    Grounding: Strict Site Knowledge
                  </span>
                </div>
              </div>

              <AiAssistant />
            </div>
          </section>

          {/* Section 5: Recruiter & Tech Lead CTA */}
          <section className="rounded-xl border border-border bg-linear-to-br from-surface to-surface-sunken p-8 text-center sm:p-12">
            <div className="mx-auto max-w-2xl space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to review production-grade engineering?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Explore deep technical case studies of shipped systems, or reach
                out directly to discuss how I bring high-velocity AI workflows
                with senior-level rigor to engineering teams.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button asChild size="md">
                  <Link href="/projects">Explore Projects</Link>
                </Button>
                <Button asChild variant="secondary" size="md">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="ghost" size="md">
                  <Link href="/about">About My Background</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
