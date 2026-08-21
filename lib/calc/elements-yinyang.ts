import { branchById, stemById } from "./data";
import type { ElementId, FourPillars, YinYang } from "./types";

/** 계산 규칙서 26~30번: 사주 8글자(시주 미상 시 6글자)의 오행/음양 배열을 생성한다. */
export function computeElementsAndYinYang(pillars: FourPillars) {
  const stemIds = [pillars.yearPillar.stem, pillars.monthPillar.stem, pillars.dayPillar.stem];
  const branchIds = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) {
    stemIds.push(pillars.hourPillar.stem);
    branchIds.push(pillars.hourPillar.branch);
  }

  const stemElements: ElementId[] = stemIds.map((id) => stemById(id).element);
  const branchElements: ElementId[] = branchIds.map((id) => branchById(id).element);
  const stemYinYang: YinYang[] = stemIds.map((id) => stemById(id).yinYang);
  const branchYinYang: YinYang[] = branchIds.map((id) => branchById(id).yinYang);

  return { stemElements, branchElements, stemYinYang, branchYinYang };
}
