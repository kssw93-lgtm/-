import { pillarHanja, STEMS, branchById } from "./data";
import type { SolarTermSource } from "./solar-terms";
import type { BranchId, Pillar, StemId } from "./types";

/** 계산 규칙서 14번: 월주 경계에 쓰이는 12절과 월지 매핑 */
const TERM_TO_BRANCH: Record<string, BranchId> = {
  입춘: "yin",
  경칩: "mao",
  청명: "chen",
  입하: "si",
  망종: "wu",
  소서: "wei",
  입추: "shen",
  백로: "you",
  한로: "xu",
  입동: "hai",
  대설: "zi",
  소한: "chou",
};

const TWELVE_TERMS = Object.keys(TERM_TO_BRANCH);

const STEM_ORDER: StemId[] = STEMS.map((s) => s.id);

/**
 * 계산 규칙서 15번: 각 월지는 해당 절입 시각부터 다음 절입 직전까지 적용한다.
 * birthUtcMillis 이전(또는 같은) 가장 최근 절입을 찾는다. 연말/연초 경계를 위해
 * 전년/해당연도/다음연도 3개년의 12절 데이터를 모두 모아 비교한다.
 */
export interface TermInstant {
  term: string;
  instantUtcMillis: number;
}

/**
 * birthUtcMillis 기준 직전(governing/previous) 절입과 직후(next) 절입을 함께 찾는다.
 * 대운 기산(50, 51번)의 순행/역행 기준 절기 선택에도 사용한다.
 */
export function findAdjacentTerms(
  localYear: number,
  birthUtcMillis: number,
  solarTerms: SolarTermSource
): { previous: TermInstant; next: TermInstant } {
  const candidates: TermInstant[] = [];
  for (const y of [localYear - 1, localYear, localYear + 1]) {
    for (const term of TWELVE_TERMS) {
      const instant = solarTerms.findTermInstant(y, term);
      if (instant) candidates.push({ term, instantUtcMillis: instant.instantUtcMillis });
    }
  }
  candidates.sort((a, b) => a.instantUtcMillis - b.instantUtcMillis);

  let previous: TermInstant | null = null;
  let next: TermInstant | null = null;
  for (const c of candidates) {
    if (c.instantUtcMillis <= birthUtcMillis) {
      previous = c;
    } else if (!next) {
      next = c;
      break;
    }
  }
  if (!previous || !next) {
    throw new Error("월주/대운 계산에 필요한 절기 데이터 범위가 부족합니다.");
  }
  return { previous, next };
}

/**
 * 계산 규칙서 16, 17번: 오호둔월법.
 * startStemIndex = ((yearStemIndex % 5) * 2 + 2) % 10 (甲己→丙寅, 乙庚→戊寅, 丙辛→庚寅, 丁壬→壬寅, 戊癸→甲寅)
 * 월운(wolun.ts)도 이 공식을 그대로 재사용한다(연간만 다르게 대입).
 */
export function monthStemFromYearStem(yearStem: StemId, monthBranch: BranchId): StemId {
  const yearStemIndex = STEM_ORDER.indexOf(yearStem);
  const startStemIndex = ((yearStemIndex % 5) * 2 + 2) % 10;

  const monthBranchIndex = branchById(monthBranch).index;
  const yinIndex = branchById("yin").index; // 寅
  const offset = ((monthBranchIndex - yinIndex) % 12 + 12) % 12;
  const monthStemIndex = (startStemIndex + offset) % 10;
  return STEM_ORDER[monthStemIndex];
}

export function computeMonthPillar(
  localYear: number,
  birthUtcMillis: number,
  yearPillarStem: StemId,
  solarTerms: SolarTermSource
): Pillar {
  const { previous } = findAdjacentTerms(localYear, birthUtcMillis, solarTerms);
  const monthBranch = TERM_TO_BRANCH[previous.term];
  const monthStem = monthStemFromYearStem(yearPillarStem, monthBranch);

  return { stem: monthStem, branch: monthBranch, hanja: pillarHanja(monthStem, monthBranch) };
}

export { TERM_TO_BRANCH, TWELVE_TERMS };
