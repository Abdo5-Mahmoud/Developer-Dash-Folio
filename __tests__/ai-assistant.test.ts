import { describe, test, expect, jest, afterEach } from "@jest/globals";

import {
  GeminiProviderStrategy,
  MockProviderStrategy,
} from "@/features/ai-workflow/lib/llm";
import { rankProjectKnowledge } from "@/features/projects/lib/projects";
import { checkRateLimit } from "@/lib/rate-limiter";

describe("MockProviderStrategy Mocking test", () => {
  test("MockProviderStrategy should return a mock response containing the prompt", async () => {
    const provider = new MockProviderStrategy();
    const result = await provider.generateProviderResponse({
      prompt: "Hello Assistant",
      systemInstructions: "You are a helpful assistant.",
    });
    expect(typeof result).toBe("string");
    expect(result).toContain("Hello Assistant");
  });
});

describe("Rate Limiter Check test", () => {
  test("Should allow checks within limit and block when exceeding", async () => {
    const testIp = "192.168.1.100";
    const keyPrefix = "test";
    const limit = 3;

    for (let i = 1; i <= limit; i++) {
      const resp = checkRateLimit({ ip: testIp, keyPrefix, limit });
      expect(resp.success).toBe(true);
    }
    const blockResp = checkRateLimit({ ip: testIp, keyPrefix, limit });
    expect(blockResp.success).toBe(false);
    expect(blockResp.remaining).toBe(0);
  });
});

describe("Provider error handling", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("surfaces the real Gemini payload error instead of hiding it behind a generic fallback", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          error: {
            code: 400,
            message: "API key is invalid or quota exceeded",
            status: "INVALID_ARGUMENT",
          },
        }),
    } as Response);

    const provider = new GeminiProviderStrategy("test-key");

    await expect(
      provider.generateProviderResponse({
        prompt: "hello",
        systemInstructions: "be helpful",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      providerName: "gemini-3.6-flash",
      message: "API key is invalid or quota exceeded",
    });
  });
});

describe("Project knowledge routing", () => {
  test("ranks the project mentioned in the question first", () => {
    const projects = [
      {
        slug: "devfolio",
        title: "Devfolio",
        summary: "A portfolio",
        fullDescription: "A portfolio app",
        features: [],
        technologies: ["Next.js"],
        skills: ["Content management"],
        reactPatterns: [],
        challenges: [],
        engineeringDecisions: [],
      },
      {
        slug: "react-chat-app",
        title: "React Chat App",
        summary: "A chat app",
        fullDescription: "A real-time app",
        features: [],
        technologies: ["React", "Socket.IO"],
        skills: ["Real-time systems"],
        reactPatterns: [],
        challenges: [],
        engineeringDecisions: [],
      },
    ];

    expect(
      rankProjectKnowledge(
        projects,
        "How does the React Chat App handle Socket.IO?",
      )[0].slug,
    ).toBe("react-chat-app");
  });
});
