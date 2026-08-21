import { computeYearPillar } from "./year-pillar";
import type { SolarTermSource } from "./solar-terms";
import type { Pillar } from "./types";

/**
 * 계산 규칙서 53번 / 데이터테이블 45번: 세운 = 해당 연도의 60갑자.
 * 세운은 원국과 별도로 저장하며, 원국·대운과의 상호작용 해석은 해석 엔진 영역이다.
 *
 * 년주와 마찬가지로 입춘을 연 경계로 사용한다(11~13번과 동일 원칙을 "올해"에도 적용) —
 * 즉 특정 날짜가 속한 세운은 computeYearPillar와 동일한 입춘 판정 로직을 그대로 재사용한다.
 */
export function computeAnnualLuckForDate(
  year: number,
  month: number,
  day: number,
  utcMillis: number | null,
  solarTerms: SolarTermSource
): { pillar: Pillar; effectiveYear: number } {
  return computeYearPillar(year, month, day, utcMillis, solarTerms);
}
