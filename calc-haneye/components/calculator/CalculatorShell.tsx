import type { ReactNode } from "react";

interface CalculatorShellProps {
  inputSlot: ReactNode;
  resultSlot: ReactNode;
}

export function CalculatorShell({ inputSlot, resultSlot }: CalculatorShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
      <div>{inputSlot}</div>
      <div className="lg:sticky lg:top-24">{resultSlot}</div>
    </div>
  );
}
