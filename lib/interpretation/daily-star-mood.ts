import dailyStarMoodJson from "@/data/daily-star-mood.json";
import { hashSeed } from "./template-select";
import { STAR_SIGN_ELEMENT, type StarElementId } from "./zodiac-compat";

interface MoodEntry {
  mood: string;
  summary: string;
  tip: string;
}

const DAILY_STAR_MOOD = dailyStarMoodJson as Record<StarElementId, MoodEntry[]>;

export interface StarDailyMood {
  dateLabel: string;
  element: StarElementId;
  score: number;
  mood: string;
  summary: string;
  tip: string;
}

/**
 * 서양 별자리는 명리학과 무관한 별개 체계라 실제 천문 이벤트(트랜싯 등)를 계산하지
 * 않는다 — 대신 별자리의 4원소(zodiac-career.ts와 동일 배속)별로 미리 써둔 "오늘의
 * 무드" 후보 중 날짜로 결정되는 하나를 고르는 방식이다. 같은 날엔 항상 같은 결과가
 * 나오고, 매일 달라지되 없는 사실(실제 점성술적 근거)을 지어내지 않는다.
 */
export function computeStarDailyMood(starSignId: string, now: Date = new Date()): StarDailyMood {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const element = STAR_SIGN_ELEMENT[starSignId];
  const pool = DAILY_STAR_MOOD[element];

  const seed = hashSeed(`${y}-${m}-${d}|${starSignId}|daily-star`);
  const entry = pool[seed % pool.length];
  const jitter = (seed % 13) - 6; // -6 ~ +6
  const score = Math.max(45, Math.min(90, 68 + jitter));

  return {
    dateLabel: `${y}년 ${m}월 ${d}일`,
    element,
    score,
    mood: entry.mood,
    summary: entry.summary,
    tip: entry.tip,
  };
}
