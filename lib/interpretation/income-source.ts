import incomeJson from "@/data/income-source.json";
import type { PatternGroup } from "./feature-extract";

export interface IncomeSource {
  sources: string[];
  flowIn: string;
  flowOut: string;
}

const INCOME_SOURCE = incomeJson as Record<PatternGroup, IncomeSource>;

/**
 * 재물운 전용 — "돈이 들어오는 경로"는 새 이론이 아니라 전통 명리학의 십신 배속을 그대로 쓴다:
 * 재성(jaeseong)=재물 직접, 관성(gwanseong)=조직·직위, 식상(siksang)=재능·표현,
 * 인성(inseong)=학문·자격, 비겁(bigeob)=동료·독립. 이미 계산된 PatternGroup을 재사용할 뿐이다.
 */
export function getIncomeSource(group: PatternGroup): IncomeSource {
  return INCOME_SOURCE[group];
}
