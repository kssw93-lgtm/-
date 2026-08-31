import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeTone = "brand" | "positive" | "caution" | "danger" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  brand: "bg-brand-light text-brand-dark",
  positive: "bg-positive-light text-positive",
  caution: "bg-caution-light text-caution",
  danger: "bg-danger-light text-danger",
  neutral: "bg-surface-subtle text-ink-soft",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
