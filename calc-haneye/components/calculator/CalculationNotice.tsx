import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/components/ui/cn";

interface CalculationNoticeProps {
  children: ReactNode;
  className?: string;
}

export function CalculationNotice({ children, className }: CalculationNoticeProps) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-lg border border-caution/30 bg-caution-light p-4 text-sm leading-relaxed text-caution",
        className
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
