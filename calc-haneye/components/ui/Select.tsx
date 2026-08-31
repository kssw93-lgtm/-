import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  options: readonly SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-[15px] text-ink",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
            invalid ? "border-danger" : "border-hairline",
            "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-ink-muted",
            className
          )}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    );
  }
);

Select.displayName = "Select";
