import { PORTFOLIO_KNOWLEDGE } from "@/features/ai-workflow/data/knowledge";
import { MAX_QUESTION_LENGTH } from "@/features/ai-workflow/lib/assistant";

const GEMINI_API_KEY = process.env.Gemini_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_OUTPUT_TOKENS = 1000;

const SYSTEM_INSTRUCTIONS = [
  "You are the portfolio assistant on this website.",
  "Answer the user's question using ONLY the knowledge below.",
  "If the answer is not in the knowledge, say you don't know and briefly list the topics that are available: contact information, skills, technologies, projects, background.",
  "Reply with concise plain text only — no markdown headings, no invented facts.",
  "",
  `KNOWLEDGE: ${JSON.stringify(PORTFOLIO_KNOWLEDGE)}`,
].join("\n");

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiPayload {
  candidates?: Array<{ content?: GeminiContent }>;
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
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
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
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!GEMINI_API_KEY) {
    return Response.json({ error: "Assistant unavailable" }, { status: 500 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question.trim() }], role: "user" }],
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
          generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );
  } catch {
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }

  if (!upstream.ok) {
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }

  let payload: GeminiPayload;
  try {
    payload = (await upstream.json()) as GeminiPayload;
  } catch {
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }

  const answer = extractAnswer(payload);
  if (!answer) {
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }

  return Response.json({ answer });
}
