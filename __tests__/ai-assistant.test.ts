import { describe, test, expect } from "@jest/globals";

import { MockProviderStrategy } from "@/features/ai-workflow/lib/llm";
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
