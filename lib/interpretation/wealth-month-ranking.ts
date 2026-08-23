import { computeAnnualLuckForDate } from "@/lib/calc/saeun";
import { computeMonthlyLuck } from "@/lib/calc/wolun";
import { createDefaultSolarTermSource } from "@/lib/calc/solar-terms";
import { getTenGod } from "@/lib/calc/ten-gods";
import { hashSeed } from "./template-select";
import wealthMonthTagJson from "@/data/wealth-month-tag.json";
import dailyTenGodJson from "@/data/daily-ten-god.json";
import type { SajuResult, TenGod } from "@/lib/calc/types";

const WEALTH_MONTH_TAG = wealthMonthTagJson as Record<TenGod, { tag: string; desc: string }>;
const DAILY_TEN_GOD = dailyTenGodJson as Record<TenGod, { baseScore: number }>;

function localNoonUtcMillis(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 12, 0) - 9 * 60 * 60 * 1000;
}

export interface WealthMonthEntry {
  month: number;
  tag: string;
  desc: string;
  score: number;
}

export interface WealthMonthRanking {
  topMonths: WealthMonthEntry[];
  cautionMonths: WealthMonthEntry[];
}

/**
 * 재물운 관점에서 올해 12개월을 순위 매긴다. 점수는 "오늘의 운세"에 이미 쓰이고 있는
 * 십신별 baseScore(daily-ten-god.json)를 그대로 재사용하고(새 점수 체계를 따로 만들지
 * 않음), 사람마다·달마다 달라지는 결정론적 보정값(해시)만 더한다. 월운 계산은
 * computeYearRhythm과 동일한 절기 기반 로직(saeun/wolun)을 그대로 쓴다.
 */
export function computeWealthMonthRanking(
  saju: SajuResult,
  year: number = new Date().getFullYear()
): WealthMonthRanking | null {
  const solarTerms = createDefaultSolarTermSource();
  const dayStem = saju.pillars.dayPillar.stem;
  const entries: WealthMonthEntry[] = [];

  for (let month = 1; month <= 12; month++) {
    try {
      const day = 15;
      const utcMillis = localNoonUtcMillis(year, month, day);
      const { pillar: annualPillar } = computeAnnualLuckForDate(year, month, day, utcMillis, solarTerms);
      const monthlyPillar = computeMonthlyLuck(year, utcMillis, annualPillar.stem, solarTerms);
      const tenGod = getTenGod(dayStem, monthlyPillar.stem);
      const info = WEALTH_MONTH_TAG[tenGod];
      const baseScore = DAILY_TEN_GOD[tenGod].baseScore;
      const jitterSeed = hashSeed(`${year}-${month}|${dayStem}|wealthmonth`);
      const jitter = (jitterSeed % 11) - 5; // -5 ~ +5
      const score = Math.max(30, Math.min(99, baseScore + jitter));
      entries.push({ month, tag: info.tag, desc: info.desc, score });
    } catch {
      // 해당 월의 절기 데이터가 없으면(지원 범위 밖) 건너뛴다.
    }
  }

  if (entries.length < 6) return null; // 데이터가 너무 적으면 순위가 의미 없으므로 섹션 자체를 건너뛴다.

  const sorted = [...entries].sort((a, b) => b.score - a.score);
  return {
    topMonths: sorted.slice(0, 3),
    cautionMonths: sorted.slice(-3).reverse(),
  };
}
