import type {
  AiWorkflowRequest,
  AiWorkflowResponse,
} from "../types/ai-workflow";
import { PORTFOLIO_KNOWLEDGE } from "../data/knowledge";

export const TOPIC_INTRO = `You can ask me about ${PORTFOLIO_KNOWLEDGE.owner.name}'s contact information, skills, technologies, projects, or background.`;

export const MAX_QUESTION_LENGTH = 500;

// Transport seam for the AI backend: POST /api/assistant keeps the
// request/response contract unchanged; failures surface as thrown errors
// handled generically by the UI.
export async function askPortfolioAssistant(
  request: AiWorkflowRequest,
): Promise<AiWorkflowResponse> {
  const question = request.question.trim();

  if (!question) {
    throw new Error("Question must not be empty.");
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    throw new Error("Question is too long.");
  }

  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const result = (await response.json()) as AiWorkflowResponse;

  if (!response.ok || typeof result.answer !== "string") {
    throw new Error("Assistant request failed");
  }

  return result;
}
