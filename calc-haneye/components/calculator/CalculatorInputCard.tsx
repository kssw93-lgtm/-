import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface CalculatorInputCardProps {
  title?: string;
  children: ReactNode;
}

export function CalculatorInputCard({
  title = "계산 정보 입력",
  children,
}: CalculatorInputCardProps) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
