import { pillarHanja, SEXAGENARY } from "./data";
import type { SolarTermSource } from "./solar-terms";
import type { Pillar } from "./types";

/**
 * 계산 규칙서 11~13번: 입춘 절입 시각을 년주 경계로 사용한다.
 * 입춘 이전 → 이전 연도 간지 / 입춘 이후 → 해당 연도 간지.
 *
 * utcMillis가 null(출생시간 모름)인 경우, 입춘 당일과 겹치는 극히 드문 경계 케이스를
 * 제외하면 날짜 비교만으로 충분하므로 로컬 정오(12:00)를 중립값으로 사용한다.
 */
export function computeYearPillar(
  localYear: number,
  localMonth: number,
  localDay: number,
  utcMillisOrNull: number | null,
  solarTerms: SolarTermSource
): { pillar: Pillar; effectiveYear: number } {
  const utcMillis =
    utcMillisOrNull ??
    Date.UTC(localYear, localMonth - 1, localDay, 12, 0) - 9 * 60 * 60 * 1000;

  const ipchunThisYear = solarTerms.findTermInstant(localYear, "입춘");
  if (!ipchunThisYear) {
    throw new Error(`${localYear}년 입춘 절입 데이터를 찾을 수 없습니다.`);
  }

  const effectiveYear = utcMillis < ipchunThisYear.instantUtcMillis ? localYear - 1 : localYear;

  return { pillar: pillarForEffectiveYear(effectiveYear), effectiveYear };
}

/**
 * 60갑자 기준 연도 간지: 기준점으로 잘 알려진 갑자년(1984년 = 갑자년, index 0)을 사용해
 * (effectiveYear - 1984) mod 60 으로 산출한다. 세운(saeun.ts)에서도 동일 매핑을 재사용한다.
 */
const REFERENCE_JIAZI_YEAR = 1984;

export function pillarForEffectiveYear(effectiveYear: number): Pillar {
  const diff = effectiveYear - REFERENCE_JIAZI_YEAR;
  const index = ((diff % 60) + 60) % 60;
  const entry = SEXAGENARY[index];
  return { stem: entry.stem, branch: entry.branch, hanja: pillarHanja(entry.stem, entry.branch) };
}
