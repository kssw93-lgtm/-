import workRelationshipsJson from "@/data/work-relationships.json";
import type { PatternGroup } from "./feature-extract";

export interface WorkRelationships {
  boss: string;
  peer: string;
  subordinate: string;
}

const WORK_RELATIONSHIPS = workRelationshipsJson as Record<PatternGroup, WorkRelationships>;

/**
 * 직장 내 인간관계(상사·동료·부하) — 전통 십신 이론에서 정관(관성)은 나를 통제하는
 * 존재로 조직·상사를, 식상은 내가 낳는 것으로 부하·아랫사람을, 비겁은 나와 대등한
 * 존재로 동료·경쟁자를 상징한다는 배속을 참고했다. 다만 사람마다 5개 그룹의 세부
 * 강도를 전부 노출하지는 않으므로, 이미 계산된 지배적 성향(dominant PatternGroup —
 * workStyle 등과 동일하게 쓰는 값)이 위계 관계에서 어떻게 드러나는지로 풀어썼다.
 */
export function getWorkRelationships(group: PatternGroup): WorkRelationships {
  return WORK_RELATIONSHIPS[group];
}
