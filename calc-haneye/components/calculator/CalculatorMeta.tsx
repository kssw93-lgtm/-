import { CalendarClock } from "lucide-react";

interface CalculatorMetaProps {
  effectiveDateLabel: string;
  lastReviewedLabel?: string;
}

export function CalculatorMeta({
  effectiveDateLabel,
  lastReviewedLabel,
}: CalculatorMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
      <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{effectiveDateLabel}</span>
      {lastReviewedLabel ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{lastReviewedLabel}</span>
        </>
      ) : null}
    </div>
  );
}
