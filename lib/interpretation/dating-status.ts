import datingStatusJson from "@/data/interpretation-templates/dating-status.json";
import type { PatternGroup } from "./feature-extract";

const DATING_STATUS_TEXT = datingStatusJson as Record<PatternGroup, string>;

/**
 * 연애 중인 사용자 전용 — 이미 계산된 PatternGroup(비겁/식상/재성/관성/인성)을
 * 그대로 재사용해, "다음 인연을 찾는" 관점이 아니라 "지금 관계를 다루는" 관점의
 * 문구를 하나 더 매칭한다. 새 계산은 없다.
 */
export function getDatingAdvice(group: PatternGroup): string {
  return DATING_STATUS_TEXT[group];
}
