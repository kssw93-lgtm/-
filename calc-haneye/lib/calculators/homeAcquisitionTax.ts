import {
  getGeneralOneHomeAcquisitionTaxRate,
  HOME_ACQUISITION_TAX_REFERENCE,
} from "@/lib/constants/taxRates";

export type AcquisitionType =
  | "paidIndividual"
  | "inheritance"
  | "gift"
  | "corporate"
  | "other";

export type HomeCount = "one" | "two" | "threeOrMore" | "unknown";

export type ReductionStatus = "notApplied" | "possibleFirstTime" | "unknown";

export type PropertyType = "house" | "officetel" | "land" | "commercial" | "other";

export interface HomeAcquisitionTaxInput {
  priceWon: number;
  acquisitionType: AcquisitionType;
  homeCount: HomeCount;
  reductionStatus: ReductionStatus;
  jointOwnership: boolean;
  propertyType: PropertyType;
}

export interface HomeAcquisitionTaxCalculatedResult {
  status: "calculated";
  priceWon: number;
  applicableRate: number;
  estimatedBasicAcquisitionTax: number;
  appliedConditions: string[];
  excludedItems: string[];
  effectiveDate: string;
  lastReviewedAt: string;
}

export interface HomeAcquisitionTaxScopeResult {
  status: "outOfScope" | "needsReview";
  reason: string;
  itemsToCheck: string[];
}

export type HomeAcquisitionTaxResult =
  | HomeAcquisitionTaxCalculatedResult
  | HomeAcquisitionTaxScopeResult;

export const EXCLUDED_ITEMS = [
  "지방교육세",
  "농어촌특별세",
  "다주택 중과",
  "법인 취득",
  "생애최초 등 각종 감면",
  "상속·증여",
  "공동취득·지분취득",
  "규제지역(조정대상지역) 중과",
];

const APPLIED_CONDITIONS = [
  "개인·유상취득",
  "일반 1주택",
  "감면 미적용",
  "단독 취득(공동·지분 취득 아님)",
  "주택(오피스텔·토지·상가 제외)",
];

function assertValidPrice(priceWon: number): void {
  if (!Number.isFinite(priceWon) || priceWon <= 0) {
    throw new RangeError("취득가액은 0보다 큰 숫자여야 합니다.");
  }
}

function findScopeIssue(
  input: HomeAcquisitionTaxInput
): HomeAcquisitionTaxScopeResult | null {
  if (input.acquisitionType !== "paidIndividual") {
    return {
      status: "outOfScope",
      reason:
        "선택하신 취득 형태는 현재 1차 계산 범위 밖입니다. 상속·증여·법인 취득 등은 " +
        "개인 유상취득과 세율·과세 방식이 다르게 적용됩니다.",
      itemsToCheck: [
        "취득 형태별 정확한 세율은 위택스 또는 관할 세무서에서 확인하세요.",
      ],
    };
  }

  if (input.homeCount === "two" || input.homeCount === "threeOrMore") {
    return {
      status: "outOfScope",
      reason:
        "다주택자는 지역 및 보유 주택 수에 따라 중과세율이 적용될 수 있어 " +
        "1차 계산 범위 밖입니다.",
      itemsToCheck: [
        "다주택 중과 여부와 세율은 위택스 또는 관할 지방자치단체에서 확인하세요.",
      ],
    };
  }

  if (input.homeCount === "unknown") {
    return {
      status: "needsReview",
      reason:
        "보유 주택 수를 확인해야 정확한 세율을 계산할 수 있습니다. 다주택 여부에 " +
        "따라 세율이 크게 달라질 수 있습니다.",
      itemsToCheck: ["본인의 세대 기준 보유 주택 수를 먼저 확인해 주세요."],
    };
  }

  if (input.reductionStatus !== "notApplied") {
    return {
      status: "needsReview",
      reason:
        "감면 적용 가능성이 있는 경우 실제 요건 충족 여부에 따라 세액이 달라져 " +
        "1차 계산에서는 감면 미적용 조건만 지원합니다.",
      itemsToCheck: [
        "생애최초 주택 구입 감면 등 요건 충족 여부는 위택스 또는 관할 지방자치단체에서 확인하세요.",
      ],
    };
  }

  if (input.jointOwnership) {
    return {
      status: "outOfScope",
      reason:
        "공동취득·지분취득은 지분 비율에 따라 개별 세액 산정이 달라져 1차 계산 " +
        "범위 밖입니다.",
      itemsToCheck: ["지분율별 세액 산정은 관할 지방자치단체 또는 세무전문가에게 확인하세요."],
    };
  }

  if (input.propertyType !== "house") {
    return {
      status: "outOfScope",
      reason:
        "주택 외 오피스텔·토지·상가 등은 세율 체계가 달라 1차 계산 범위 밖입니다.",
      itemsToCheck: ["부동산 유형별 취득세율은 위택스에서 확인하세요."],
    };
  }

  return null;
}

export function calculateHomeAcquisitionTax(
  input: HomeAcquisitionTaxInput
): HomeAcquisitionTaxResult {
  assertValidPrice(input.priceWon);

  const scopeIssue = findScopeIssue(input);
  if (scopeIssue) return scopeIssue;

  const applicableRate = getGeneralOneHomeAcquisitionTaxRate(input.priceWon);
  const estimatedBasicAcquisitionTax = Math.round(
    input.priceWon * applicableRate
  );

  return {
    status: "calculated",
    priceWon: input.priceWon,
    applicableRate,
    estimatedBasicAcquisitionTax,
    appliedConditions: APPLIED_CONDITIONS,
    excludedItems: EXCLUDED_ITEMS,
    effectiveDate: HOME_ACQUISITION_TAX_REFERENCE.effectiveDate,
    lastReviewedAt: HOME_ACQUISITION_TAX_REFERENCE.lastReviewedAt,
  };
}
