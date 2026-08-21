import { pillarHanja, SEXAGENARY } from "./data";
import type { Pillar } from "./types";

/**
 * 계산 규칙서 v2.1 19번(확정): 일주 기준일.
 * REFERENCE_DATE = 2024-01-01, REFERENCE_DAY_PILLAR = 甲子(index 0)
 * 교차검증점: 2026-07-02 = 丁丑(index 13), 913일 경과, 913 mod 60 = 13.
 *
 * 22번: DAY_BOUNDARY_MODE = midnight. 날짜 경계는 00:00이므로, 시각과 무관하게
 * "정규화된 KST 달력 날짜" 하나만으로 일주가 결정된다.
 */
const REFERENCE_DATE_UTC_MILLIS = Date.UTC(2024, 0, 1);
const REFERENCE_INDEX = 0; // 甲子

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export function computeDayPillarIndex(date: CalendarDate): number {
  const dateUtcMillis = Date.UTC(date.year, date.month - 1, date.day);
  const diffDays = Math.round((dateUtcMillis - REFERENCE_DATE_UTC_MILLIS) / 86_400_000);
  return (((REFERENCE_INDEX + diffDays) % 60) + 60) % 60;
}

export function computeDayPillar(date: CalendarDate): Pillar {
  const index = computeDayPillarIndex(date);
  const entry = SEXAGENARY[index];
  return { stem: entry.stem, branch: entry.branch, hanja: pillarHanja(entry.stem, entry.branch) };
}
