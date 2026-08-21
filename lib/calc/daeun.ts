import { pillarHanja, SEXAGENARY, sexagenaryIndexOf, stemById } from "./data";
import { findAdjacentTerms } from "./month-pillar";
import type { SolarTermSource } from "./solar-terms";
import type { LuckPillar, Pillar, StemId } from "./types";

const MINUTES_PER_YEAR = 4320; // 계산 규칙서 51번: 3일=1년, 4320분(3일×24시간×60분)=1년
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;
const AVG_DAYS_PER_YEAR = 365.2425;

/** 계산 규칙서 49번 / 데이터테이블 41번: 양남·음녀 순행, 음남·양녀 역행 */
export function computeLuckDirection(yearStem: StemId, gender: "male" | "female"): "forward" | "backward" {
  const isYangYear = stemById(yearStem).yinYang === "yang";
  if (gender === "male") return isYangYear ? "forward" : "backward";
  return isYangYear ? "backward" : "forward";
}

export interface DaeunComputationInput {
  localYear: number;
  birthUtcMillis: number; // 시간 미상 시에도 index.ts에서 정오 대체값을 전달
  monthPillar: Pillar;
  luckDirection: "forward" | "backward";
  solarTerms: SolarTermSource;
  count?: number;
}

/**
 * 계산 규칙서 50, 51번(v2.1 확정): 대운 계산.
 * 순행: 다음 절입까지 시간차 / 역행: 직전 절입까지 시간차. 3일=1년(4320분=1년), 소수점 유지.
 */
export function computeMajorLuck(input: DaeunComputationInput): LuckPillar[] {
  const { localYear, birthUtcMillis, monthPillar, luckDirection, solarTerms, count = 8 } = input;

  const { previous, next } = findAdjacentTerms(localYear, birthUtcMillis, solarTerms);
  const referenceInstant = luckDirection === "forward" ? next.instantUtcMillis : previous.instantUtcMillis;

  const diffMinutes = Math.abs(referenceInstant - birthUtcMillis) / MS_PER_MINUTE;
  const preciseYears = diffMinutes / MINUTES_PER_YEAR; // 대운수_정밀 (소수점 유지)

  const monthIndex = sexagenaryIndexOf(monthPillar.stem, monthPillar.branch);
  const direction = luckDirection === "forward" ? 1 : -1;

  const luckPillars: LuckPillar[] = [];
  for (let k = 1; k <= count; k++) {
    const sexIndex = ((monthIndex + direction * k) % 60 + 60) % 60;
    const entry = SEXAGENARY[sexIndex];
    const pillar: Pillar = { stem: entry.stem, branch: entry.branch, hanja: pillarHanja(entry.stem, entry.branch) };

    const periodStartYears = preciseYears + (k - 1) * 10;
    const periodEndYears = preciseYears + k * 10;

    const startDateMillis = birthUtcMillis + periodStartYears * AVG_DAYS_PER_YEAR * MS_PER_DAY;
    const endDateMillis = birthUtcMillis + periodEndYears * AVG_DAYS_PER_YEAR * MS_PER_DAY;

    luckPillars.push({
      index: k,
      pillar,
      startAgePrecise: periodStartYears,
      // 반올림 규칙: 0.5는 올림 (계산 규칙서 51번 4항)
      startAgeDisplay: Math.floor(periodStartYears + 0.5),
      startDate: new Date(startDateMillis).toISOString().slice(0, 10),
      endDate: new Date(endDateMillis).toISOString().slice(0, 10),
    });
  }

  return luckPillars;
}
