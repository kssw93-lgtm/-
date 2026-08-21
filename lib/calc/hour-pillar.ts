import { pillarHanja, STEMS } from "./data";
import type { MaybePillar, StemId } from "./types";

const STEM_ORDER: StemId[] = STEMS.map((s) => s.id);

/**
 * 계산 규칙서 04번: 시간 미상이면 시주는 확정하지 않는다(null).
 * hour가 null인 경우 이 함수를 호출하지 않고 index.ts에서 바로 null 처리한다.
 */
export function computeHourBranchIndex(localHour: number): number {
  return Math.floor(((localHour + 1) % 24) / 2);
}

/**
 * 계산 규칙서 23, 24번 / 데이터테이블 15, 16번: 시지 + 오자둔시법.
 * startStemIndex = ((dayStemIndex % 5) * 2) % 10
 * (甲己日→甲子, 乙庚日→丙子, 丙辛日→戊子, 丁壬日→庚子, 戊癸日→壬子)
 */
export function computeHourPillar(dayStem: StemId, localHour: number | null): MaybePillar {
  if (localHour === null) return null;

  const branchIndex = computeHourBranchIndex(localHour);
  const branchList = ["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"] as const;
  const hourBranch = branchList[branchIndex];

  const dayStemIndex = STEM_ORDER.indexOf(dayStem);
  const startStemIndex = ((dayStemIndex % 5) * 2) % 10;
  const hourStemIndex = (startStemIndex + branchIndex) % 10;
  const hourStem = STEM_ORDER[hourStemIndex];

  return { stem: hourStem, branch: hourBranch, hanja: pillarHanja(hourStem, hourBranch) };
}
