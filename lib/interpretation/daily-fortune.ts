import dailyTenGodJson from "@/data/daily-ten-god.json";
import { computeDayPillar } from "@/lib/calc/day-pillar";
import { getTenGod } from "@/lib/calc/ten-gods";
import { hashSeed } from "./template-select";
import type { SajuResult, TenGod } from "@/lib/calc/types";

const DAILY_TEN_GOD = dailyTenGodJson as Record<
  TenGod,
  { label: string; oneliner: string; loveTag: string; moneyTag: string; baseScore: number }
>;

export interface DailyFortune {
  dateLabel: string;
  dayPillarHanja: string;
  tenGod: TenGod;
  label: string;
  oneliner: string;
  loveTag: string;
  moneyTag: string;
  score: number;
}

/**
 * 오늘의 운세: 오늘 날짜의 일진(day pillar, day-pillar.ts로 결정론적 산출)과
 * 내 일간의 십신 관계로 오늘의 기운을 뽑는다. 점수는 십신별 기준점 + 날짜·사람마다
 * 달라지는 결정론적 보정값(해시)을 더한 것 — 매일 새로 계산해도 같은 날엔 항상 같은 값이 나온다.
 */
export function computeDailyFortune(saju: SajuResult, now: Date = new Date()): DailyFortune {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const todayPillar = computeDayPillar({ year: y, month: m, day: d });
  const tenGod = getTenGod(saju.pillars.dayPillar.stem, todayPillar.stem);
  const info = DAILY_TEN_GOD[tenGod];

  const jitterSeed = hashSeed(`${y}-${m}-${d}|${saju.pillars.dayPillar.stem}|daily`);
  const jitter = (jitterSeed % 15) - 7; // -7 ~ +7
  const score = Math.max(40, Math.min(95, info.baseScore + jitter));

  return {
    dateLabel: `${y}년 ${m}월 ${d}일`,
    dayPillarHanja: todayPillar.hanja,
    tenGod,
    label: info.label,
    oneliner: info.oneliner,
    loveTag: info.loveTag,
    moneyTag: info.moneyTag,
    score,
  };
}
