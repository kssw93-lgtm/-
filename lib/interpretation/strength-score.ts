import { FIVE_ELEMENTS, stemById, branchById } from "@/lib/calc/data";
import { hiddenStemsOf } from "@/lib/calc/hidden-stems";
import type { SajuResult } from "@/lib/calc/types";

export type Strength = "gang" | "yak";

/**
 * 매핑규칙서 01번 축2: 신강/신약 점수제 (계산 규칙서 45번 "월령·통근·생조/극설" 원자료 기반).
 *
 * ① 득령(30) — 월지 오행이 일간을 생조(비겁·인성 관계)하면 30점
 * ② 득지(20) — 일지 지장간 중 일간을 생조하는 것이 있으면 20점
 * ③ 득세(최대48) — 일간 제외 나머지 천간 + 일지 제외 나머지 지지 중 일간을 생조하는 것의 개수 × 배점
 *
 * 주의(문서 원문 대비 해석): 매핑규칙서 원문은 득세 지지 풀을 "월지·일지 제외"라고 쓰고 있으나,
 * 곧이어 "모집단 6개(천간3+지지3)", 시주 미상 시 "4개(천간2+지지2)", 최대점 48을 항상 유지한다고
 * 명시한다. 월지+일지를 모두 제외하면 지지 풀이 2개(시주 있음)/1개(시주 없음)가 되어 이 숫자와
 * 모순되므로, 본 구현은 "일지만 제외"(월지는 포함)로 해석해 문서가 명시한 3+3=6 / 2+2=4 풀 크기와
 * 48점 만점을 정확히 재현한다.
 */
export interface StrengthScoreBreakdown {
  deukryeong: number;
  deukji: number;
  deukse: number;
  total: number;
  strength: Strength;
}

function supportsDay(dayElement: string, candidateElement: string): boolean {
  return candidateElement === dayElement || FIVE_ELEMENTS.generates[candidateElement as never] === dayElement;
}

export function computeStrengthScore(saju: SajuResult): StrengthScoreBreakdown {
  const dayStem = saju.pillars.dayPillar.stem;
  const dayElement = stemById(dayStem).element;
  const hasHour = saju.pillars.hourPillar !== null;

  // ① 득령
  const monthElement = branchById(saju.pillars.monthPillar.branch).element;
  const deukryeong = supportsDay(dayElement, monthElement) ? 30 : 0;

  // ② 득지
  const dayBranchHidden = hiddenStemsOf(saju.pillars.dayPillar.branch);
  const deukji = dayBranchHidden.some((h) => supportsDay(dayElement, stemById(h.stem).element)) ? 20 : 0;

  // ③ 득세
  const stemPool = [saju.pillars.yearPillar.stem, saju.pillars.monthPillar.stem];
  if (hasHour && saju.pillars.hourPillar) stemPool.push(saju.pillars.hourPillar.stem);

  const branchPool = [saju.pillars.yearPillar.branch, saju.pillars.monthPillar.branch];
  if (hasHour && saju.pillars.hourPillar) branchPool.push(saju.pillars.hourPillar.branch);

  const supportingCount =
    stemPool.filter((s) => supportsDay(dayElement, stemById(s).element)).length +
    branchPool.filter((b) => supportsDay(dayElement, branchById(b).element)).length;

  const perItemPoints = hasHour ? 8 : 12; // 6개×8=48 또는 4개×12=48
  const deukse = supportingCount * perItemPoints;

  const total = deukryeong + deukji + deukse;
  const strength: Strength = total >= 50 ? "gang" : "yak";

  return { deukryeong, deukji, deukse, total, strength };
}

export type StrengthBand = "taeyak" | "yak" | "junghwaYak" | "junghwaGang" | "gang" | "taegang";

const BAND_LABEL: Record<StrengthBand, string> = {
  taeyak: "태약",
  yak: "신약",
  junghwaYak: "중화신약",
  junghwaGang: "중화신강",
  gang: "신강",
  taegang: "태강",
};

/** 0~98점 총점을 6단계 게이지(태약~태강)로 변환한다. 매핑규칙서의 이진(신강/신약) 판정을 보완하는 표시용 세분화. */
export function strengthBand(total: number): { band: StrengthBand; label: string; percent: number } {
  const percent = Math.max(0, Math.min(100, (total / 98) * 100));
  let band: StrengthBand;
  if (percent < 17) band = "taeyak";
  else if (percent < 34) band = "yak";
  else if (percent < 50) band = "junghwaYak";
  else if (percent < 66) band = "junghwaGang";
  else if (percent < 83) band = "gang";
  else band = "taegang";

  return { band, label: BAND_LABEL[band], percent };
}
