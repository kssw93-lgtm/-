import Link from "next/link";
import { ArrowRight, House, Landmark, WalletCards, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CalculatorMeta } from "@/lib/constants/calculatorMetadata";

const ICONS: Record<CalculatorMeta["icon"], LucideIcon> = {
  loan: Landmark,
  severance: WalletCards,
  "acquisition-tax": House,
};

interface CalculatorCardProps {
  calculator: CalculatorMeta;
  showScope?: boolean;
}

export function CalculatorCard({ calculator, showScope }: CalculatorCardProps) {
  const Icon = ICONS[calculator.icon];

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">{calculator.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {calculator.shortDescription}
      </p>
      {showScope ? (
        <p className="mt-2 flex-1 text-xs text-ink-muted">
          지원 범위: {calculator.supportScope}
        </p>
      ) : (
        <div className="flex-1" />
      )}
      <Link
        href={calculator.href}
        className="mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        계산하기
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </Card>
  );
}
