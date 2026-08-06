import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
const styles = {
  info: { icon: Info, cls: "border-border bg-surface text-foreground" },
  success: {
    icon: CheckCircle2,
    cls: "border-success/30 bg-success-muted text-success",
  },
  warning: {
    icon: AlertTriangle,
    cls: "border-warning/30 bg-warning-muted text-warning",
  },
  danger: {
    icon: XCircle,
    cls: "border-danger/30 bg-danger-muted text-danger",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
  className,
}: {
  type?: keyof typeof styles;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, cls } = styles[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", cls, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="text-sm leading-relaxed">
        {title && <p className="mb-1 font-medium">{title}</p>}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
