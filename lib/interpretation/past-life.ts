import pastLifeJson from "@/data/past-life.json";
import { extractDominantTenGodGroup, type PatternGroup } from "./feature-extract";
import type { SajuResult } from "@/lib/calc/types";

export interface PastLife {
  group: PatternGroup;
  title: string;
  text: string;
  tags: string[];
}

const PAST_LIFE_TABLE = pastLifeJson as Record<PatternGroup, { title: string; text: string; tags: string[] }>;

/**
 * 재미 콘텐츠(전생 보기): 원국의 우세 십신 그룹(축1)을 그대로 재사용해
 * "조선시대 전생" 컨셉으로 표현한다. 새로운 계산 규칙을 만들지 않고
 * 이미 계산 엔진이 산출한 값 위에서만 텍스트를 매칭한다.
 */
export function computePastLife(saju: SajuResult): PastLife {
  const group = extractDominantTenGodGroup(saju);
  return { group, ...PAST_LIFE_TABLE[group] };
}
