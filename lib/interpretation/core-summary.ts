import keywordsJson from "@/data/pattern-keywords.json";
import type { PatternGroup } from "./feature-extract";

export interface CoreSummary {
  strengths: string[];
  cautions: string[];
  keywords: string[];
}

const KEYWORDS = keywordsJson as Record<PatternGroup, CoreSummary>;

/**
 * 결과 화면 맨 위에 놓는 압축 요약 — 이미 계산된 십신 강세 그룹(PatternGroup)을 그대로 재사용해
 * "강점 / 주의 / 핵심 키워드" 세 줄로 압축한다. 새 계산이 아니라 같은 값을 다르게 요약해 보여줄 뿐이다.
 */
export function computeCoreSummary(group: PatternGroup): CoreSummary {
  return KEYWORDS[group];
}
