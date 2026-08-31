import {
  parseProjectPayload,
  validateProject,
} from "@/features/projects/lib/projects";

const validProjectPayload = {
  title: "Portfolio Project",
  summary: "A clean portfolio project",
  fullDescription:
    "A full case study with architecture and implementation notes.",
  slug: "portfolio-project",
  category: "Full Stack",
  features: ["TypeScript", "Next.js"],
  coverImage: "https://example.com/cover.jpg",
  coverImageAlt: "Project cover",
  githubUrl: "https://github.com/example/repo",
  liveUrl: "https://example.com",
  techStack: [
    { technologyId: "ts", name: "TypeScript" },
    { technologyId: "next", name: "Next.js" },
  ],
  skillIds: ["skill-1", "skill-2"],
  gallery: [
    { url: "https://example.com/img-1.png", alt: "User flow", caption: "UI" },
  ],
  reactPatterns: [
    { name: "Container pattern", rationale: "Keeps data flow clean" },
  ],
  algorithms: [{ name: "Priority queue", rationale: "Improved scheduling" }],
  performanceOptimizations: [
    { technique: "Streaming SSR", impact: "Faster first content" },
  ],
  challenges: [
    { challenge: "Complex state", resolution: "Split into smaller stores" },
  ],
  lessonsLearned: "Keep abstractions minimal.",
  aiPrompts: [
    { purpose: "Refine strategy", prompt: "Design the architecture" },
  ],
  aiMistakes: [
    {
      mistake: "Over-engineered state",
      caughtBy: "Code review",
      correction: "Simplify",
    },
  ],
  engineeringDecisions: [
    {
      decision: "Use app router",
      alternatives: ["pages router"],
      rationale: "Better structure",
    },
  ],
  displayOrder: 5,
  featured: true,
};

describe("project payload parsing and validation", () => {
  test("parseProjectPayload accepts a valid project payload", () => {
    const result = parseProjectPayload(validProjectPayload);

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      title: "Portfolio Project",
      summary: "A clean portfolio project",
      fullDescription:
        "A full case study with architecture and implementation notes.",
      slug: "portfolio-project",
      category: "Full Stack",
      features: ["TypeScript", "Next.js"],
      githubUrl: "https://github.com/example/repo",
      liveUrl: "https://example.com",
      status: "draft",
      displayOrder: 5,
      featured: true,
    });
    expect(result?.techStack).toHaveLength(2);
    expect(result?.gallery).toHaveLength(1);
    expect(result?.reactPatterns).toHaveLength(1);
  });

  test("parseProjectPayload rejects missing required scalar fields", () => {
    expect(parseProjectPayload({ title: "Example" })).toBeNull();
    expect(parseProjectPayload({ title: "Example", summary: "ok" })).toBeNull();
    expect(
      parseProjectPayload({
        title: "Example",
        summary: "ok",
        fullDescription: "ok",
      }),
    ).not.toBeNull();
  });

  test("parseProjectPayload truncates overlong strings at the configured limits", () => {
    const longTitle = "x".repeat(250);
    const longSummary = "y".repeat(600);
    const longDescription = "z".repeat(25000);

    const result = parseProjectPayload({
      ...validProjectPayload,
      title: longTitle,
      summary: longSummary,
      fullDescription: longDescription,
      category: "x".repeat(200),
      coverImageAlt: "x".repeat(500),
    });

    expect(result).not.toBeNull();
    expect(result?.title).toHaveLength(200);
    expect(result?.summary).toHaveLength(500);
    expect(result?.fullDescription).toHaveLength(20000);
    expect(result?.category).toHaveLength(100);
    expect(result?.coverImageAlt).toHaveLength(300);
  });

  test("parseProjectPayload drops malformed or incomplete array entries", () => {
    const result = parseProjectPayload({
      ...validProjectPayload,
      techStack: [
        { technologyId: "good", name: "TypeScript" },
        { technologyId: "missing-name" },
        { name: "Bad item" },
      ],
      gallery: [
        { url: "https://example.com/ok.png", alt: "Good" },
        { alt: "Missing url" },
      ],
      reactPatterns: [
        { name: "Valid", rationale: "Works" },
        { name: "Broken" },
      ],
      engineeringDecisions: [
        {
          decision: "Use app router",
          alternatives: ["pages router"],
          rationale: "Good",
        },
        { rationale: "Missing decision" },
      ],
    });

    expect(result).not.toBeNull();
    expect(result?.techStack).toEqual([
      { technologyId: "good", name: "TypeScript" },
    ]);
    expect(result?.gallery).toHaveLength(1);
    expect(result?.gallery?.[0]).toMatchObject({
      url: "https://example.com/ok.png",
      alt: "Good",
    });
    expect(result?.reactPatterns).toEqual([
      { name: "Valid", rationale: "Works" },
    ]);
    expect(result?.engineeringDecisions).toEqual([
      {
        decision: "Use app router",
        alternatives: ["pages router"],
        rationale: "Good",
      },
    ]);
  });

  test("validateProject is permissive for drafts and strict for published projects", () => {
    const draftValues = parseProjectPayload(validProjectPayload)!;
    expect(validateProject(draftValues, "draft")).toEqual({});

    const publishedValues = {
      ...draftValues,
      techStack: [],
      githubUrl: "ftp://bad",
      liveUrl: "not-a-url",
    };

    expect(validateProject(publishedValues, "published")).toEqual({
      techStack: "At least one technology is required to publish.",
      githubUrl: "Must start with http:// or https://",
      liveUrl: "Must start with http:// or https://",
    });
  });

  test("validateProject requires summary and techStack for published projects", () => {
    const values = parseProjectPayload(validProjectPayload)!;

    expect(
      validateProject({ ...values, summary: "" }, "published"),
    ).toMatchObject({
      summary: "Summary is required to publish.",
    });

    expect(
      validateProject({ ...values, techStack: [] }, "published"),
    ).toMatchObject({
      techStack: "At least one technology is required to publish.",
    });
  });

  test("validateProject rejects non-http(s) URLs for published projects", () => {
    const values = parseProjectPayload(validProjectPayload)!;

    expect(
      validateProject(
        {
          ...values,
          githubUrl: "ftp://example.com",
          liveUrl: "mailto:test@example.com",
        },
        "published",
      ),
    ).toMatchObject({
      githubUrl: "Must start with http:// or https://",
      liveUrl: "Must start with http:// or https://",
    });

    expect(
      validateProject(
        {
          ...values,
          githubUrl: "https://example.com",
          liveUrl: "http://example.com",
        },
        "published",
      ),
    ).toEqual({});
  });
});
