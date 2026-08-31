import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CalculatorCard } from "@/components/CalculatorCard";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { getCalculatorsByCategory } from "@/lib/constants/calculatorMetadata";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "금융 계산기",
  description:
    "대출 상환과 퇴직금처럼 생활 속에서 자주 필요한 금액을 간편하게 확인하세요.",
  path: "/finance",
});

const calculators = getCalculatorsByCategory("finance");

export default function FinancePage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "금융 계산기" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">금융 계산기</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
        대출 상환과 퇴직금처럼 생활 속에서 자주 필요한 금액을 간편하게
        확인하세요.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.slug}
            calculator={calculator}
            showScope
          />
        ))}
      </div>

      <div className="mt-10">
        <CalculationNotice>
          위 계산 결과는 모두 참고용 예상 계산입니다. 실제 대출 조건은 금융기관,
          실제 퇴직금은 근로계약·취업규칙 및 관계 법령 기준으로 다시 확인하세요.
        </CalculationNotice>
      </div>
    </Container>
  );
}
