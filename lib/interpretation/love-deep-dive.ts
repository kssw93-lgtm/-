import loveDeepDiveJson from "@/data/love-deep-dive.json";
import type { PatternGroup } from "./feature-extract";

export interface LoveDeepDive {
  idealType: string;
  attractsYou: string;
  conflictPoint: string;
  marriageTendency: string;
}

const LOVE_DEEP_DIVE = loveDeepDiveJson as Record<PatternGroup, LoveDeepDive>;

/**
 * 연애운 심화 — 이상형/나를 좋아하기 쉬운 사람/갈등 포인트/결혼운. 새 계산 없이
 * 이미 계산된 지배적 성향(dominant PatternGroup)이 관계에서 무엇을 원하고,
 * 어떤 사람에게 매력적으로 비치고, 어디서 부딪히기 쉬운지를 풀어썼다 — 상대방
 * 데이터 없이 본인의 성향만으로 구성했다.
 */
export function getLoveDeepDive(group: PatternGroup): LoveDeepDive {
  return LOVE_DEEP_DIVE[group];
}
