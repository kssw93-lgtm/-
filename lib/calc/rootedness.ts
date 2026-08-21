import { stemById } from "./data";
import { hiddenStemsOf } from "./hidden-stems";
import type { BranchId, FourPillars, RootednessResult, StemId } from "./types";

/**
 * 계산 규칙서 43번 / 데이터테이블 31번: 통근.
 * 일간과 같은 오행의 지장간이 해당 지지에 있으면 rooted=true.
 * (통근의 강약·명리적 의미는 해석 엔진에서 결정 — 계산 엔진은 존재 여부만 산출)
 */
export function computeRootednessForBranch(dayMaster: StemId, branch: BranchId): RootednessResult {
  const dayElement = stemById(dayMaster).element;
  const matching = hiddenStemsOf(branch)
    .filter((h) => stemById(h.stem).element === dayElement)
    .map((h) => h.stem);

  return { branch, rooted: matching.length > 0, matchingHiddenStems: matching };
}

export function computeRootedness(pillars: FourPillars): RootednessResult[] {
  const dayMaster = pillars.dayPillar.stem;
  const branches: BranchId[] = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) branches.push(pillars.hourPillar.branch);

  return branches.map((b) => computeRootednessForBranch(dayMaster, b));
}
