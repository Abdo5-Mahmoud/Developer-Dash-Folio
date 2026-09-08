export interface LLMProviderStrategy {
  readonly providerName: string;
  generateProviderResponse: ({
    prompt,
    systemInstructions,
  }: {
    prompt: string;
    systemInstructions: string;
  }) => Promise<string>;
}

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}
export interface GeminiPayload {
  candidates?: Array<{ content?: GeminiContent }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}
