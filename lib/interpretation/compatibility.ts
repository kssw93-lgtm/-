import compatibilityJson from "@/data/interpretation-templates/compatibility.json";
import relationTypesJson from "@/data/relation-types.json";
import { getTenGod } from "@/lib/calc/ten-gods";
import { BRANCH_RELATIONS, stemHanja, branchHanja } from "@/lib/calc/data";
import { GROUP_BY_TEN_GOD, type PatternGroup } from "./feature-extract";
import type { BranchId, SajuResult } from "@/lib/calc/types";

const COMPAT_TEMPLATES = compatibilityJson as { id: string; pattern: PatternGroup; text: string }[];
const RELATION_TYPES = relationTypesJson as Record<string, { name: string; desc: string }>;

export interface CompatibilityResult {
  groupAtoB: PatternGroup;
  groupBtoA: PatternGroup;
  text: string;
  dayBranchRelation: { type: string; name: string; desc: string } | null;
}

function findDayBranchRelation(a: BranchId, b: BranchId): { type: string; name: string; desc: string } | null {
  const checks: { key: keyof typeof BRANCH_RELATIONS; type: string }[] = [
    { key: "sixCombine", type: "branch_six_combine" },
    { key: "clash", type: "branch_clash" },
    { key: "break", type: "branch_break" },
    { key: "harm", type: "branch_harm" },
    { key: "resentment", type: "branch_resentment" },
  ];
  for (const { key, type } of checks) {
    const list = BRANCH_RELATIONS[key] as { source: BranchId; target: BranchId }[];
    const hit = list.some((r) => (r.source === a && r.target === b) || (r.source === b && r.target === a));
    if (hit) return { type, ...RELATION_TYPES[type] };
  }
  return null;
}

/**
 * 궁합: 계산 규칙서 60번 원칙(두 사람의 독립 사주를 각각 계산한 뒤 비교, 한 사람 기준으로
 * 다른 사람을 추정하지 않음)을 그대로 따른다. 이미 각각 정확히 계산된 두 SajuResult를
 * 입력받아, 두 일간 사이의 십신 관계 + 일지(배우자궁) 관계라는 실제 계산값만으로 판정한다.
 */
export function computeCompatibility(sajuA: SajuResult, sajuB: SajuResult): CompatibilityResult {
  const dayStemA = sajuA.pillars.dayPillar.stem;
  const dayStemB = sajuB.pillars.dayPillar.stem;

  const tenGodAtoB = getTenGod(dayStemA, dayStemB);
  const tenGodBtoA = getTenGod(dayStemB, dayStemA);
  const groupAtoB = GROUP_BY_TEN_GOD[tenGodAtoB];
  const groupBtoA = GROUP_BY_TEN_GOD[tenGodBtoA];

  const template = COMPAT_TEMPLATES.find((t) => t.pattern === groupAtoB) ?? COMPAT_TEMPLATES[0];
  const dayBranchRelation = findDayBranchRelation(sajuA.pillars.dayPillar.branch, sajuB.pillars.dayPillar.branch);

  return { groupAtoB, groupBtoA, text: template.text, dayBranchRelation };
}

export function describeDayMasterPair(sajuA: SajuResult, sajuB: SajuResult): string {
  return `${stemHanja(sajuA.pillars.dayPillar.stem)}${branchHanja(sajuA.pillars.dayPillar.branch)} · ${stemHanja(
    sajuB.pillars.dayPillar.stem
  )}${branchHanja(sajuB.pillars.dayPillar.branch)}`;
}
