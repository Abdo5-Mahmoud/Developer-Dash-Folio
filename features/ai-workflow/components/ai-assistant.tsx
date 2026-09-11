"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, SendHorizonal, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isLoading = status === "loading";

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  // for scrolling to the bottom of the chat when new messages are added
  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTo({
        top: node.scrollHeight,
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
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-full border border-border bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 ring-1 ring-accent/30 transition-all hover:shadow-xl"
          aria-label="Open portfolio assistant chat"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent-foreground/10">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Ask AI</span>
        </motion.button>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-labelledby="ai-assistant-heading"
          className="flex w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h2 id="ai-assistant-heading" className="text-sm font-semibold">
                  Portfolio Assistant
                </h2>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Guardrailed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Close portfolio assistant chat"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="max-h-105 flex-1 overflow-y-auto overscroll-contain"
          >
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation with the portfolio assistant"
              className="flex flex-col gap-3 p-4"
            >
              {messages.length === 0 && !isLoading ? (
                <div className="flex flex-col gap-4 items-start py-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Hi! I&apos;m the portfolio assistant. {TOPIC_INTRO} Answers
                    come only from information published on this site.
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
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse motion-reduce:animate-none"
                        style={{
                          animationDelay: `${dot * 160}ms`,
                          animationDuration: "1s",
                        }}
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
            <div className="px-4 pb-2" role="alert">
              <Callout type="danger" title="Something went wrong">
                The assistant couldn&apos;t answer right now. Please try again.
              </Callout>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-border bg-surface p-4"
          >
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
                <SendHorizonal className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </motion.section>
      )}
    </div>
  );
}
