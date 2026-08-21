import { pillarHanja } from "./data";
import { findAdjacentTerms, monthStemFromYearStem, TERM_TO_BRANCH } from "./month-pillar";
import type { SolarTermSource } from "./solar-terms";
import type { Pillar, StemId } from "./types";

/**
 * 계산 규칙서 54번 / 데이터테이블 46번: 월운 = 연간 + 절기 월지.
 * 일반 달력 월이 아니라 절기 기준으로 계산하며, 월주(month-pillar.ts)와 동일한
 * 오호둔월법 공식을 그 시점의 연간(annualStem)에 적용한다.
 */
export function computeMonthlyLuck(
  queryLocalYear: number,
  queryUtcMillis: number,
  annualStem: StemId,
  solarTerms: SolarTermSource
): Pillar {
  const { previous } = findAdjacentTerms(queryLocalYear, queryUtcMillis, solarTerms);
  const monthBranch = TERM_TO_BRANCH[previous.term];
  const monthStem = monthStemFromYearStem(annualStem, monthBranch);

  return { stem: monthStem, branch: monthBranch, hanja: pillarHanja(monthStem, monthBranch) };
}
