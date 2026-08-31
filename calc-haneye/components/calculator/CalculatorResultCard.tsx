import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

interface CalculatorResultCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function CalculatorResultCard({
  title = "계산 결과",
  children,
  className,
}: CalculatorResultCardProps) {
  return (
    <Card className={cn("bg-surface-subtle/60", className)}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
