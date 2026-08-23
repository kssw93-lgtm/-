import { getCheoneulTargets } from "@/lib/calc/sinsal";
import type { SajuResult } from "@/lib/calc/types";

export interface GwiinDaeun {
  ageLabel: string;
  pillarHanja: string;
}

/**
 * 평생 대운(saju.majorLuck) 중 천을귀인 지지에 해당하는 시기를 찾는다. 새 대조표를
 * 만들지 않고, 원국 신살 계산에서 이미 검증된 천을귀인 표(sinsal.ts)를 대운 지지에도
 * 그대로 적용한 것 — 원국 4개 자리뿐 아니라 평생 중 어느 시기에 귀인 기운이 드는지를
 * 보여준다. 종합사주에서만 제공한다(개별 대운 서사와 겹치지 않는 요약형 하이라이트).
 */
export function computeGwiinDaeunList(saju: SajuResult): GwiinDaeun[] {
  const targets = getCheoneulTargets(saju.pillars.dayPillar.stem);
  return saju.majorLuck
    .filter((lp) => targets.includes(lp.pillar.branch))
    .map((lp) => ({
      ageLabel: `${lp.startAgeDisplay}세~${lp.startAgeDisplay + 9}세`,
      pillarHanja: lp.pillar.hanja,
    }));
}
