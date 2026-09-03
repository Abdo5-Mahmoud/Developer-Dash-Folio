"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { askPortfolioAssistant, TOPIC_INTRO } from "../lib/assistant";
import type { AiWorkflowStatus, ChatMessage } from "../types/ai-workflow";
import { createMessageId } from "../types/ai-workflow";

const SUGGESTED_QUESTIONS = [
  "What are your main skills?",
  "Which projects have you built?",
  "How can I contact you?",
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} relative`}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-lg bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-foreground sm:max-w-[75%]"
            : "max-w-[85%] whitespace-pre-line rounded-lg border border-border bg-surface px-4 py-2.5 text-sm leading-relaxed text-foreground sm:max-w-[75%]"
        }
      >
        <span className="sr-only">
          {isUser ? "You asked: " : "Assistant answered: "}
        </span>
        {message.content}
      </div>
    </motion.div>
  );
}

export function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AiWorkflowStatus>("idle");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isLoading = status === "loading";

  // for scrolling to the bottom of the chat when new messages are added
  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  }, [messages, isLoading, shouldReduceMotion]);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setStatus("loading");

    try {
      const response = await askPortfolioAssistant({ question: trimmed });
      setMessages((current) => [
        ...current,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: response.answer,
        },
      ]);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(input);
  }

  return (
    <section
      aria-labelledby="ai-assistant-heading "
      className="flex overflow-hidden flex-col flex-1 gap-4 px-6 py-10 mx-auto w-full max-w-3xl min-h-0"
    >
      <h2 id="ai-assistant-heading" className="sr-only">
        Portfolio assistant conversation
      </h2>

      <div
        ref={scrollRef}
        className="overflow-y-scroll overscroll-contain flex-1 max-h-64 min-h-96"
      >
        <div
          role="log"
          aria-live="polite"
          aria-label="Conversation with the portfolio assistant"
          className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-background"
        >
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col gap-4 items-start py-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hi! I&apos;m the portfolio assistant. {TOPIC_INTRO} Answers come
                only from information published on this site.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <Button
                    key={question}
                    variant="secondary"
                    size="sm"
                    onClick={() => void sendQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-3"
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                  />
                ))}
              </div>
              <span className="sr-only" role="status">
                Assistant is typing…
              </span>
            </div>
          )}
        </div>
      </div>

      {status === "error" && (
        <div role="alert">
          <Callout type="danger" title="Something went wrong">
            The assistant couldn&apos;t answer right now. Please try again.
          </Callout>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="ai-assistant-input" className="sr-only">
            Ask a question about the portfolio
          </Label>
          <Input
            id="ai-assistant-input"
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Ask about skills, projects, or contact info…"
            autoComplete="off"
            disabled={isLoading}
            aria-describedby="ai-assistant-hint"
          />
          <p
            id="ai-assistant-hint"
            className="mt-1.5 text-xs text-muted-foreground"
          >
            Press Enter to send.
          </p>
        </div>
        <Button
          type="submit"
          size="icon"
          loading={isLoading}
          disabled={!input.trim()}
          aria-label="Send question to the portfolio assistant"
        >
          {!isLoading && (
            <SendHorizonal className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </section>
  );
}
