import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-hairline bg-white p-5 shadow-card sm:p-6",
        className
      )}
      {...props}
    />
  );
}
