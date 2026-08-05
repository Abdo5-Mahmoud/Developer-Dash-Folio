import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "success" | "warning" | "danger";

const CONFIG: Record<CalloutVariant, { icon: LucideIcon; text: string; bg: string; border: string }> = {
  info: { icon: Info, text: "text-accent", bg: "bg-accent-muted", border: "border-accent/20" },
  success: { icon: CheckCircle2, text: "text-success", bg: "bg-success-muted", border: "border-success/20" },
  warning: { icon: AlertTriangle, text: "text-warning", bg: "bg-warning-muted", border: "border-warning/20" },
  danger: { icon: XCircle, text: "text-danger", bg: "bg-danger-muted", border: "border-danger/20" },
};

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
}

export function Callout({ variant = "info", title, className, children, ...props }: CalloutProps) {
  const { icon: Icon, text, bg, border } = CONFIG[variant];
  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "note"}
      className={cn("flex gap-3 rounded-lg border px-4 py-3.5", bg, border, className)}
      {...props}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", text)} aria-hidden />
      <div className="text-sm leading-relaxed text-foreground">
        {title && <p className={cn("mb-1 font-medium", text)}>{title}</p>}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
