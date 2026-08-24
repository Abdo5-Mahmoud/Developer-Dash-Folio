import type {
  AiWorkflowRequest,
  AiWorkflowResponse,
} from "../types/ai-workflow";
import { PORTFOLIO_KNOWLEDGE } from "../data/knowledge";

// Mock seam for the future AI/backend layer: replace this implementation
// with a real API call; the request/response contract stays unchanged.
const MOCK_DELAY_MS = 700;

const TOPIC_INTRO = `You can ask me about ${PORTFOLIO_KNOWLEDGE.owner.name}'s contact information, skills, technologies, projects, or background.`;

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function answerContact(): string {
  const { contact } = PORTFOLIO_KNOWLEDGE;
  return [
    `${PORTFOLIO_KNOWLEDGE.owner.name} can be reached by email at ${contact.email}.`,
    `GitHub: ${contact.githubUrl}`,
    `LinkedIn: ${contact.linkedInUrl}`,
    "No phone number is published.",
  ].join("\n");
}

function answerSkills(): string {
  return [
    "Skill categories:",
    ...PORTFOLIO_KNOWLEDGE.skillCategories.map(
      (group) => `- ${group.category}: ${group.skills.join(", ")}`,
    ),
  ].join("\n");
}

function answerTechnologies(): string {
  return [
    "Technologies used across the portfolio:",
    PORTFOLIO_KNOWLEDGE.technologies.join(", ") + ".",
  ].join("\n");
}

function answerProjects(): string {
  return [
    "Featured projects:",
    ...PORTFOLIO_KNOWLEDGE.projects.map(
      (project) =>
        `- ${project.title}: ${project.summary} (built with ${project.technologies.join(", ")})`,
    ),
    "Each project page documents architecture, data flow, and AI-assisted engineering decisions.",
  ].join("\n");
}

function answerAbout(): string {
  return [
    `${PORTFOLIO_KNOWLEDGE.owner.name} is a ${PORTFOLIO_KNOWLEDGE.owner.role.toLowerCase()}.`,
    ...PORTFOLIO_KNOWLEDGE.owner.bio.map((line) => `- ${line}`),
  ].join("\n");
}

function resolveAnswer(question: string): string {
  const text = question.toLowerCase();

  if (hasAny(text, ["email", "contact", "reach", "github", "linkedin", "phone"])) {
    return answerContact();
  }
  if (hasAny(text, ["skill", "proficien", "strength", "good at"])) {
    return answerSkills();
  }
  if (hasAny(text, ["technolog", "stack", "tool", "framework"])) {
    return answerTechnologies();
  }
  if (
    hasAny(text, [
      "project",
      "portfolio",
      "work",
      "built",
      "devfolio",
      "pulse",
      "canvas",
      "auth",
    ])
  ) {
    return answerProjects();
  }
  if (hasAny(text, ["about", "who", "experience", "background", "bio", "he"])) {
    return answerAbout();
  }
  return `I don't have an answer for that yet. ${TOPIC_INTRO}`;
}

export async function askPortfolioAssistant(
  request: AiWorkflowRequest,
): Promise<AiWorkflowResponse> {
  const question = request.question.trim();

  if (!question) {
    throw new Error("Question must not be empty.");
  }

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  return { answer: resolveAnswer(question.toLowerCase()) };
}

export { TOPIC_INTRO };
