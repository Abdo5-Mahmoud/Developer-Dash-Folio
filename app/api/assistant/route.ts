import { getPortfolioKnowledge } from "@/features/ai-workflow/data/knowledge";
import { MAX_QUESTION_LENGTH } from "@/features/ai-workflow/lib/assistant";
import {
  createLLMProvider,
  handleAssistatntRequest,
  LLMError,
} from "@/features/ai-workflow/lib/llm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const KNOWLEDGE_TIMEOUT_MS = 10_000;

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
  const geminiProvider = createLLMProvider(
    process.env.PROJECT_STATUS,
    process.env.GEMINI_API_KEY,
  );
  try {
    const answer: string = await handleAssistatntRequest({
      prompt: question,
      provider: geminiProvider,
      systemInstructions: systemInstructions,
    });
    return Response.json({ answer });
  } catch (error) {
    if (error instanceof LLMError) {
      console.error("[Assistant API] Error handling assistant request:", error);
      return Response.json(
        {
          ok: false,
          error: `Assistant unavailable: ${error.message}. Please try again later.`,
        },
        { status: error.statusCode },
      );
    }
    return Response.json(
      {
        ok: false,
        error:
          "Assistant unavailable: unexpected error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
