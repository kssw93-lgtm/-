import { HIDDEN_STEMS } from "./data";
import type { BranchId, FourPillars, HiddenStemEntry } from "./types";

/** 계산 규칙서 28번, 32번: 지장간 데이터 조회 (고정 매핑, 임의 변경 금지) */
export function hiddenStemsOf(branch: BranchId): HiddenStemEntry[] {
  return HIDDEN_STEMS[branch];
}

export function computeHiddenStemsForPillars(pillars: FourPillars): Record<BranchId, HiddenStemEntry[]> {
  const branches: BranchId[] = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) branches.push(pillars.hourPillar.branch);

  const result = {} as Record<BranchId, HiddenStemEntry[]>;
  for (const b of branches) {
    result[b] = hiddenStemsOf(b);
  }
  return result;
}
