import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 w-fit",
  {
    variants: {
      variant: {
        default: "bg-accent-muted text-accent border-transparent",
        neutral: "bg-muted text-muted-foreground border-transparent",
        outline: "border-border text-foreground bg-transparent",
        success: "bg-success-muted text-success border-transparent",
        warning: "bg-warning-muted text-warning border-transparent",
        danger: "bg-danger-muted text-danger border-transparent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
