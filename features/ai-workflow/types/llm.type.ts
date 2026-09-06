export interface LLMProviderStrategy {
  readonly providerName: string;
  generateProviderResponse: (prompt: string) => Promise<string>;
}
