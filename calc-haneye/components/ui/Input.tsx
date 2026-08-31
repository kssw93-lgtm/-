import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-ink",
          "placeholder:text-ink-muted",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          invalid ? "border-danger" : "border-hairline",
          "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-ink-muted",
          className
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
