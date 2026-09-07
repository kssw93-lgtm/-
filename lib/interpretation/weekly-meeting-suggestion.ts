import weeklySuggestionJson from "@/data/weekly-meeting-suggestion.json";
import { hashSeed } from "./template-select";
import type { PatternGroup } from "./feature-extract";

const WEEKLY_SUGGESTION = weeklySuggestionJson as Record<PatternGroup, string[]>;

/**
 * ISO 주차까지 정밀하게 맞출 필요는 없는 값(명리학적 계산이 아니라 "이번주" 감각만 필요)이라,
 * 1월 1일 기준 경과일을 7로 나눈 대략적인 주차로 충분하다. 연도가 바뀌면 주차 키도 자연히
 * 달라져서 연말~연초 경계에서도 문제없이 서로 다른 주로 취급된다.
 */
export function getApproxWeekKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diffDays = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const week = Math.floor(diffDays / 7) + 1;
  return `${year}-W${week}`;
}

/**
 * 연애운/재회운의 "인연이 들어오는 경로"(meeting-channel.ts의 PatternGroup별 type/desc)는
 * 원국의 십신 강세 그룹으로 정해지는 값이라 그대로 영구 고정해 둔다. 여기서는 그 아래
 * "이번주는 이런 곳 어때요?" 같은 보조 문구만 주 단위로 바꾼다 — 같은 그룹이라도 매주 같은
 * 문장만 반복되는 느낌을 줄이기 위함이며, 새로운 명리학적 주장을 추가하는 게 아니라 실용적인
 * 활동 제안 후보 중 하나를 결정론적으로 골라 보여줄 뿐이다.
 * 사람(birthKey) + 이번주(weekKey)를 함께 해시하므로, 같은 사람은 같은 주엔 항상 같은
 * 문구가 나오고, 주가 바뀌면(또는 사람이 다르면) 다른 문구가 나온다.
 */
export function computeWeeklyMeetingSuggestion(
  group: PatternGroup,
  birthKey: string,
  now: Date = new Date()
): string {
  const candidates = WEEKLY_SUGGESTION[group];
  const weekKey = getApproxWeekKey(now);
  const index = hashSeed(`${birthKey}|${weekKey}|weeklyMeetingSuggestion`) % candidates.length;
  return candidates[index];
}
