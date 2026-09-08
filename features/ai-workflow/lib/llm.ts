import { GeminiPayload, LLMProviderStrategy } from "../types/llm.type";

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

  async generateProviderResponse({
    prompt,
  }: {
    prompt: string;
  }): Promise<string> {
    // Simulate a delay to mimic real API response time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return a mock Response object
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
  async generateProviderResponse({
    prompt,
    systemInstructions,
  }: {
    prompt: string;
    systemInstructions: string;
  }): Promise<string> {
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
          systemInstruction: { parts: [{ text: systemInstructions }] },
        }),
      });
    } catch (error) {
      console.error(
        `[Assistant API] Network or timeout error connecting to Google Generative AI (${this.providerName}):`,
        error,
      );
      throw new LLMError(
        503,
        this.providerName,
        "Network timeout contacting AI provider",
        error as Error,
      );
    }
    if (!upstream.ok) {
      if (upstream.status === 429) {
        throw new LLMError(429, this.providerName, "Rate limit exceeded");
      }
      const errorBody = await upstream
        .text()
        .catch(() => "Unable to read error text");
      throw new LLMError(
        upstream.status,
        this.providerName,
        `Upstream error: ${errorBody}`,
      );
    }
    const payload: GeminiPayload = (await upstream.json()) as GeminiPayload;
    const answer = extractAnswer(payload);
    if (!answer) {
      console.error(
        "[Assistant API] No valid text candidate extracted from Google Generative AI payload:",
        JSON.stringify(payload),
      );
      throw new LLMError(
        502,
        this.providerName,
        " No valid text candidate extracted from Google Generative AI payload",
      );
    }
    return answer;
  }
}

export function createLLMProvider(
  env?: string,
  apiKey?: string,
): LLMProviderStrategy {
  if (env == "test" || !apiKey) return new MockProviderStrategy();
  return new GeminiProviderStrategy(apiKey);
}

function extractAnswer(payload: GeminiPayload): string | null {
  const text = (payload.candidates ?? [])
    .flatMap((c) => c.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();

  return text.length > 0 ? text : null;
}

export async function handleAssistatntRequest({
  prompt,
  provider,
  systemInstructions,
}: {
  prompt: string;
  provider: LLMProviderStrategy;
  systemInstructions: string;
}): Promise<string> {
  return await provider.generateProviderResponse({
    prompt,
    systemInstructions,
  });
}
