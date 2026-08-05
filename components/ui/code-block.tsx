"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * The signature element of the Devfolio AI design system: a documentation
 * code block styled like an editor pane, used everywhere source, prompts,
 * and terminal output are shown. Window-chrome dots + filename read as
 * "this is an artifact of real work," not decoration.
 */
export function CodeBlock({ code, language, filename, showLineNumbers = true, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-code-bg shadow-[var(--shadow-token-sm)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-code-chrome px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-danger/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </div>
          {filename && (
            <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          )}
          {!filename && language && (
            <span className="font-mono text-xs text-muted-foreground">{language}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground",
            "transition-colors duration-150 hover:bg-surface-hover hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
          )}
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[13px] leading-6">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-surface-hover/40">
                {showLineNumbers && (
                  <td
                    className="select-none whitespace-nowrap py-0 pl-4 pr-4 text-right text-muted-foreground/50"
                    aria-hidden
                  >
                    {i + 1}
                  </td>
                )}
                <td className={cn("w-full whitespace-pre py-0 pr-4 text-foreground", !showLineNumbers && "pl-4")}>
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
