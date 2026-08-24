export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface AiWorkflowRequest {
  question: string;
}

export interface AiWorkflowResponse {
  answer: string;
}

export type AiWorkflowStatus = "idle" | "loading" | "error";

let messageCounter = 0;

export function createMessageId(role: ChatRole): string {
  messageCounter += 1;
  return `${role}-${Date.now()}-${messageCounter}`;
}
