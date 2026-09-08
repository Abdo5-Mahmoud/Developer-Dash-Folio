import { getPortfolioKnowledge } from "@/features/ai-workflow/data/knowledge";
import { MAX_QUESTION_LENGTH } from "@/features/ai-workflow/lib/assistant";
import {
  createLLMProvider,
  GeminiProviderStrategy,
  handleAssistatntRequest,
} from "@/features/ai-workflow/lib/llm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const DEFAULT_MODEL = "gemini-3.6-flash";
const DEPRECATED_OR_INVALID_MODELS = new Set([
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
]);

const REQUEST_TIMEOUT_MS = 30_000;
const KNOWLEDGE_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_TOKENS = 1000;

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiPayload {
  candidates?: Array<{ content?: GeminiContent }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function getGeminiConfig() {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.Gemini_API_KEY?.trim() ||
    "";

  const rawModel = process.env.GEMINI_MODEL?.trim();
  const model =
    rawModel && !DEPRECATED_OR_INVALID_MODELS.has(rawModel)
      ? rawModel
      : DEFAULT_MODEL;

  return { apiKey, model };
}

function extractAnswer(payload: GeminiPayload): string | null {
  const text = (payload.candidates ?? [])
    .flatMap((c) => c.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();

  return text.length > 0 ? text : null;
}

export async function POST(request: Request) {
  let raw: unknown;

  const ip = getClientIp(request);
  const { success } = checkRateLimit({ ip, keyPrefix: "assistant", limit: 10 });
  if (!success) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    raw = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const question =
    typeof raw === "object" && raw !== null
      ? (raw as { question?: unknown }).question
      : undefined;

  if (
    typeof question !== "string" ||
    question.trim().length === 0 ||
    question.trim().length > MAX_QUESTION_LENGTH
  ) {
    return Response.json(
      {
        ok: false,
        error: `Question is required and must be at most ${MAX_QUESTION_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  const { apiKey, model } = getGeminiConfig();

  if (!apiKey) {
    console.error(
      "[Assistant API] Missing Gemini API key. Please configure GEMINI_API_KEY or GOOGLE_API_KEY in .env.local.",
    );
    return Response.json(
      {
        ok: false,
        error:
          "Assistant unavailable: Missing API key. Please configure GEMINI_API_KEY in your .env.local file.",
      },
      { status: 500 },
    );
  }

  let portfolioKnowledge;
  try {
    portfolioKnowledge = await Promise.race([
      getPortfolioKnowledge(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Portfolio knowledge load timed out")),
          KNOWLEDGE_TIMEOUT_MS,
        ),
      ),
    ]);
  } catch (error) {
    console.error("[Assistant API] Failed to load portfolio knowledge:", error);
    return Response.json(
      {
        ok: false,
        error:
          "Assistant unavailable: knowledge base temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  const systemInstructions = [
    "You are the portfolio assistant on this website.",
    "Answer the user's question using ONLY the knowledge below.",
    "If the answer is not in the knowledge, say you don't know and briefly list the topics that are available: contact information, skills, technologies, projects, background.",
    "Reply with concise plain text only — no markdown headings, no invented facts.",
    "",
    `KNOWLEDGE: ${JSON.stringify(portfolioKnowledge)}`,
  ].join("\n");
  const geminiProvider = createLLMProvider(apiKey);

  // const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // let upstream: Response = await geminiProvider.generateProviderResponse({
  //   prompt: question,
  //   systemInstructions: systemInstructions,
  // });
  // // try {
  // //   upstream = await fetch(endpoint, {
  // //     method: "POST",
  // //     headers: { "Content-Type": "application/json" },
  // //     body: JSON.stringify({
  // //       contents: [{ parts: [{ text: question.trim() }], role: "user" }],
  // //       systemInstruction: { parts: [{ text: systemInstructions }] },
  // //       generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  // //     }),
  // //     signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  // //   });
  // // } catch (error) {
  // //   console.error(
  // //     `[Assistant API] Network or timeout error connecting to Google Generative AI (${model}):`,
  // //     error,
  // //   );
  // //   return Response.json(
  // //     {
  // //       ok: false,
  // //       error:
  // //         "Assistant service temporarily unavailable. Network timeout contacting AI provider.",
  // //     },
  // //     { status: 503 },
  // //   );
  // // }
  // // if (!upstream.ok) {
  // //   const errorBody = await upstream
  // //     .text()
  // //     .catch(() => "Unable to read error text");
  // //   console.error(
  // //     `[Assistant API] Google Generative AI upstream error (Status ${upstream.status} ${upstream.statusText}) for model ${model}:`,
  // //     errorBody,
  // //   );
  // //   if (upstream.status === 429) {
  // //     return Response.json(
  // //       {
  // //         ok: false,
  // //         error: "Assistant rate limit exceeded. Please try again later.",
  // //       },
  // //       { status: 429 },
  // //     );
  // //   }
  // //   return Response.json(
  // //     {
  // //       ok: false,
  // //       error: `Assistant upstream service error (${upstream.status}). Please check API key, model permissions, or quotas.`,
  // //     },
  // //     { status: upstream.status >= 500 ? 503 : 500 },
  // //   );
  // // }

  // let payload: GeminiPayload;
  // try {
  //   payload = (await upstream.json()) as GeminiPayload;
  // } catch (error) {
  //   console.error(
  //     "[Assistant API] Failed to parse upstream JSON payload:",
  //     error,
  //   );
  //   return Response.json(
  //     { ok: false, error: "Invalid response format received from AI service." },
  //     { status: 502 },
  //   );
  // }

  // const answer = extractAnswer(payload);
  // if (!answer) {
  //   console.error(
  //     "[Assistant API] No valid text candidate extracted from Google Generative AI payload:",
  //     JSON.stringify(payload),
  //   );
  //   return Response.json(
  //     {
  //       ok: false,
  //       error:
  //         "The assistant could not generate a response from the available output.",
  //     },
  //     { status: 502 },
  //   );
  // }
  const answer: string = await handleAssistatntRequest({
    prompt: question,
    provider: geminiProvider,
    systemInstructions: systemInstructions,
  });
  return Response.json({ answer });
}
