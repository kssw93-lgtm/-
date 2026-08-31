import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CalculatorCard } from "@/components/CalculatorCard";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { getCalculatorsByCategory } from "@/lib/constants/calculatorMetadata";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "세금·부동산 계산기",
  description: "주택 취득 시 예상되는 취득세를 조건에 맞춰 간편하게 확인하세요.",
  path: "/property-tax",
});

const calculators = getCalculatorsByCategory("property-tax");

export default function PropertyTaxPage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs
        items={[{ label: "홈", href: "/" }, { label: "세금·부동산 계산기" }]}
      />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
        세금·부동산 계산기
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
        주택 취득 시 예상되는 취득세를 조건에 맞춰 간편하게 확인하세요.
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

      <div className="mt-10 space-y-3">
        <CalculationNotice>
          개인·유상취득·일반 1주택·감면 미적용 조건을 중심으로 한 참고용
          계산입니다.
        </CalculationNotice>
        <CalculationNotice>
          다주택, 법인, 감면, 상속·증여 등의 조건은 이 계산기의 1차 지원 범위
          밖입니다. 해당 조건에 해당한다면 위택스 또는 관할 지방자치단체를 통해
          실제 세액을 확인하세요.
        </CalculationNotice>
      </div>
    </Container>
  );
}
