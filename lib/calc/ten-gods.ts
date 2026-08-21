import { FIVE_ELEMENTS, stemById } from "./data";
import type { FourPillars, HiddenStemTenGod, StemId, TenGod } from "./types";
import { hiddenStemsOf } from "./hidden-stems";

/**
 * 계산 규칙서 31, 32번 / 데이터테이블 18, 19, 20번: 십신은 일간을 기준으로
 * 오행 생극 관계 + 음양 관계를 고정 매핑 테이블로 계산한다. AI가 판단하지 않는다.
 */
export function getTenGod(dayMaster: StemId, target: StemId): TenGod {
  const dm = stemById(dayMaster);
  const tg = stemById(target);
  const sameYinYang = dm.yinYang === tg.yinYang;

  if (dm.element === tg.element) {
    return sameYinYang ? "bigyeon" : "geopjae";
  }
  if (FIVE_ELEMENTS.generates[dm.element] === tg.element) {
    return sameYinYang ? "siksin" : "sanggwan";
  }
  if (FIVE_ELEMENTS.controls[dm.element] === tg.element) {
    return sameYinYang ? "pyeonjae" : "jeongjae";
  }
  if (FIVE_ELEMENTS.controls[tg.element] === dm.element) {
    return sameYinYang ? "pyeongwan" : "jeonggwan";
  }
  if (FIVE_ELEMENTS.generates[tg.element] === dm.element) {
    return sameYinYang ? "pyeonin" : "jeongin";
  }
  throw new Error(`십신 계산 실패: ${dayMaster} vs ${target}`);
}

/**
 * stems 배열 순서: [년간, 월간, 일간(=null, 기준이므로 십신 없음), 시간(시주 미상이면 undefined)]
 */
export function computeStemTenGods(pillars: FourPillars): (TenGod | null)[] {
  const dayStem = pillars.dayPillar.stem;
  const result: (TenGod | null)[] = [
    getTenGod(dayStem, pillars.yearPillar.stem),
    getTenGod(dayStem, pillars.monthPillar.stem),
    null,
  ];
  if (pillars.hourPillar) {
    result.push(getTenGod(dayStem, pillars.hourPillar.stem));
  }
  return result;
}

/** 계산 규칙서 32번: 지장간 각각을 일간과 비교해 독립적으로 십신을 계산한다. */
export function computeHiddenStemTenGods(pillars: FourPillars): Record<string, HiddenStemTenGod[]> {
  const dayStem = pillars.dayPillar.stem;
  const branches = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) branches.push(pillars.hourPillar.branch);

  const result: Record<string, HiddenStemTenGod[]> = {};
  for (const branch of branches) {
    result[branch] = hiddenStemsOf(branch).map((h) => ({
      ...h,
      tenGod: getTenGod(dayStem, h.stem),
    }));
  }
  return result;
}
