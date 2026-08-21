import { computeAnnualLuckForDate } from "@/lib/calc/saeun";
import { computeMonthlyLuck } from "@/lib/calc/wolun";
import { createDefaultSolarTermSource } from "@/lib/calc/solar-terms";
import { getTenGod } from "@/lib/calc/ten-gods";
import { GROUP_BY_TEN_GOD, type PatternGroup } from "./feature-extract";
import type { SajuResult, StemId } from "@/lib/calc/types";

function localNoonUtcMillis(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 12, 0) - 9 * 60 * 60 * 1000;
}

/**
 * "지금(오늘)"이 어느 세운/월운 흐름 안에 있는지 계산해 일간과의 십신 관계로 그룹(5종)을 뽑는다.
 * 원국 계산과 동일하게 100% 결정론적 계산 함수만 사용하고, KASI 절기 데이터 지원 범위(2000~2028년)를
 * 벗어나면(예: 2029년 이후 접속) null을 반환해 해당 섹션을 화면에서 건너뛰도록 한다.
 */
export interface CurrentFlow {
  annualGroup: PatternGroup;
  annualStem: StemId;
  monthlyGroup: PatternGroup;
}

export function computeCurrentFlow(saju: SajuResult, now: Date = new Date()): CurrentFlow | null {
  try {
    const solarTerms = createDefaultSolarTermSource();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const utcMillis = localNoonUtcMillis(y, m, d);

    const { pillar: annualPillar } = computeAnnualLuckForDate(y, m, d, utcMillis, solarTerms);
    const annualTenGod = getTenGod(saju.pillars.dayPillar.stem, annualPillar.stem);

    const monthlyPillar = computeMonthlyLuck(y, utcMillis, annualPillar.stem, solarTerms);
    const monthlyTenGod = getTenGod(saju.pillars.dayPillar.stem, monthlyPillar.stem);

    return {
      annualGroup: GROUP_BY_TEN_GOD[annualTenGod],
      annualStem: annualPillar.stem,
      monthlyGroup: GROUP_BY_TEN_GOD[monthlyTenGod],
    };
  } catch {
    return null;
  }
}

export interface MonthRhythm {
  month: number;
  group: PatternGroup;
}

/** 올해 1~12월 각각의 리듬(월운 십신 그룹)을 계산한다. 데이터 범위를 벗어나는 달은 배열에서 제외한다. */
export function computeYearRhythm(saju: SajuResult, year: number = new Date().getFullYear()): MonthRhythm[] {
  const solarTerms = createDefaultSolarTermSource();
  const dayStem = saju.pillars.dayPillar.stem;
  const results: MonthRhythm[] = [];

  for (let month = 1; month <= 12; month++) {
    try {
      const day = 15;
      const utcMillis = localNoonUtcMillis(year, month, day);
      const { pillar: annualPillar } = computeAnnualLuckForDate(year, month, day, utcMillis, solarTerms);
      const monthlyPillar = computeMonthlyLuck(year, utcMillis, annualPillar.stem, solarTerms);
      const tenGod = getTenGod(dayStem, monthlyPillar.stem);
      results.push({ month, group: GROUP_BY_TEN_GOD[tenGod] });
    } catch {
      // 해당 월의 절기 데이터가 없으면(지원 범위 밖) 건너뛴다.
    }
  }

  return results;
}
