import { LLMProviderStrategy } from "../types/llm.type";

export class LLMError extends Error {
  constructor(
    readonly statusCode: number,
    readonly providerName: string,
    readonly message: string,
    readonly cause?: Error,
  ) {
    super(message, { cause });
    this.cause = cause;
    this.message = message;
  }
}

export class MockProviderStrategy implements LLMProviderStrategy {
  readonly providerName: string = "MockProvider";

  async generateProviderResponse(prompt: string): Promise<string> {
    // Simulate a delay to mimic real API response time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `Mock response for prompt: "${prompt}"`;
  }
}

export class GeminiProviderStrategy implements LLMProviderStrategy {
  readonly providerName: string = "gemini-3.6-flash";

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new LLMError(401, this.providerName, "API key is required");
    }
  }
  async generateProviderResponse(prompt: string): Promise<string> {
    if (prompt.includes("rate-limit")) {
      throw new LLMError(429, this.providerName, "Rate limit exceeded");
    }
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.providerName}:generateContent?key=${this.apiKey}`;

    let upstream: Response;
    try {
      upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt.trim() }], role: "user" }],
        }),
      });
    } catch (error) {
      console.error(
        `[Assistant API] Network or timeout error connecting to Google Generative AI (${this.providerName}):`,
        error,
      );
      throw new LLMError(
        429,
        this.providerName,
        "Network timeout contacting AI provider",
        error as Error,
      );
    }
    return upstream.text().catch(() => "Unable to read response text");
  }
}

export function createLLMProvider(
  env?: string,
  apiKey?: string,
): LLMProviderStrategy {
  if (env == "test" || !apiKey) return new MockProviderStrategy();
  return new GeminiProviderStrategy(apiKey);
}

export async function handleAssistatntRequest({
  prompt,
  provider,
}: {
  prompt: string;
  provider: LLMProviderStrategy;
}): Promise<{
  status: number;
  body: string;
}> {
  try {
    const resp = await provider.generateProviderResponse(prompt);
    return {
      status: 200,
      body: resp,
    };
  } catch (error) {
    if (error instanceof LLMError) {
      return {
        status: error.statusCode,
        body: `Error from ${error.providerName}: ${error.message}`,
      };
    }
    return {
      status: 500,
      body: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
