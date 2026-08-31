export type CalculatorCategory = "finance" | "property-tax";

export interface CalculatorMeta {
  slug: string;
  href: string;
  guideHref: string;
  category: CalculatorCategory;
  icon: "loan" | "severance" | "acquisition-tax";
  title: string;
  shortDescription: string;
  supportScope: string;
}

export const calculators: CalculatorMeta[] = [
  {
    slug: "loan-interest",
    href: "/calculators/loan-interest",
    guideHref: "/guides/loan-interest-guide",
    category: "finance",
    icon: "loan",
    title: "대출 이자 계산기",
    shortDescription:
      "대출 원금, 금리, 기간, 상환 방식을 입력해 월 예상 납입액과 총 이자를 확인하세요.",
    supportScope: "원리금균등·원금균등·만기일시상환 기준의 참고용 예상 계산",
  },
  {
    slug: "severance-pay",
    href: "/calculators/severance-pay",
    guideHref: "/guides/severance-pay-guide",
    category: "finance",
    icon: "severance",
    title: "퇴직금 계산기",
    shortDescription:
      "입사일, 퇴사일, 최근 3개월 임금 정보를 바탕으로 예상 퇴직금을 확인하세요.",
    supportScope: "평균임금 기준 단순 참고용 예상 계산",
  },
  {
    slug: "home-acquisition-tax",
    href: "/calculators/home-acquisition-tax",
    guideHref: "/guides/home-acquisition-tax-guide",
    category: "property-tax",
    icon: "acquisition-tax",
    title: "주택 취득세 계산기",
    shortDescription:
      "일반 1주택을 유상 취득하는 경우의 기본 취득세를 참고용으로 계산합니다.",
    supportScope: "개인·유상취득·일반 1주택·감면 미적용 조건의 기본 취득세만 지원",
  },
];

export function getCalculatorsByCategory(
  category: CalculatorCategory
): CalculatorMeta[] {
  return calculators.filter((item) => item.category === category);
}

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return calculators.find((item) => item.slug === slug);
}
