import compatibilityJson from "@/data/interpretation-templates/compatibility.json";
import relationTypesJson from "@/data/relation-types.json";
import fiveElementsJson from "@/data/five-elements.json";
import { getTenGod } from "@/lib/calc/ten-gods";
import { BRANCH_RELATIONS, stemById, stemHanja, branchHanja } from "@/lib/calc/data";
import { GROUP_BY_TEN_GOD, type PatternGroup } from "./feature-extract";
import type { BranchId, ElementId, SajuResult } from "@/lib/calc/types";

const COMPAT_TEMPLATES = compatibilityJson as { id: string; pattern: PatternGroup; text: string }[];
const RELATION_TYPES = relationTypesJson as Record<string, { name: string; desc: string }>;
const FIVE_ELEMENTS = fiveElementsJson as { generates: Record<ElementId, ElementId>; controls: Record<ElementId, ElementId> };

const ELEMENT_LABEL: Record<ElementId, string> = { wood: "목(木)", fire: "화(火)", earth: "토(土)", metal: "금(金)", water: "수(水)" };

export type ElementRelationTier = "same" | "generates" | "controls" | "neutral";

export interface CompatibilityResult {
  groupAtoB: PatternGroup;
  groupBtoA: PatternGroup;
  /** A가 B를 바라보는 십신 관점의 궁합 해설 */
  textAtoB: string;
  /** B가 A를 바라보는 십신 관점의 궁합 해설 — 십신 관계는 방향에 따라 다르므로 A→B와 별개로 계산된다 */
  textBtoA: string;
  elementRelation: string;
  /** elementRelation 텍스트가 어떤 종류의 관계를 서술한 것인지 기계적으로 판별 가능한 값 (요약 축 계산용) */
  elementRelationTier: ElementRelationTier;
  dayBranchRelation: { type: string; name: string; desc: string } | null;
}

/**
 * 두 일간의 오행 사이에 상생(서로 살려주는 관계)·상극(서로 견제하는 관계)이 있는지 설명한다.
 * data/five-elements.json의 생/극 순환표를 그대로 사용 — 별도 판단 기준을 새로 만들지 않는다.
 */
function describeElementRelation(elA: ElementId, elB: ElementId): { text: string; tier: ElementRelationTier } {
  const labelA = ELEMENT_LABEL[elA];
  const labelB = ELEMENT_LABEL[elB];
  if (elA === elB) {
    return {
      tier: "same",
      text: `두 사람의 일간은 같은 ${labelA} 기운이에요. 같은 파장을 공유해서 말하지 않아도 통하는 부분이 많지만, 같은 약점도 공유하니 서로의 단점을 보완해줄 제3의 존재(취미, 친구, 환경)를 곁에 두면 균형이 잘 잡혀요.`,
    };
  }
  if (FIVE_ELEMENTS.generates[elA] === elB) {
    return {
      tier: "generates",
      text: `${labelA} 기운이 ${labelB} 기운을 북돋아주는 상생(相生) 관계예요. 한쪽이 자연스럽게 상대를 채워주고 힘을 실어주는 조합이라, 관계 안에서 서로 성장하는 느낌을 받기 쉬워요.`,
    };
  }
  if (FIVE_ELEMENTS.generates[elB] === elA) {
    return {
      tier: "generates",
      text: `${labelB} 기운이 ${labelA} 기운을 북돋아주는 상생(相生) 관계예요. 방향은 다르지만 마찬가지로 서로를 채워주는 조합이라, 관계 안에서 서로 성장하는 느낌을 받기 쉬워요.`,
    };
  }
  if (FIVE_ELEMENTS.controls[elA] === elB || FIVE_ELEMENTS.controls[elB] === elA) {
    return {
      tier: "controls",
      text: `${labelA}와(과) ${labelB}는 서로 견제하는 상극(相剋) 관계예요. 부딪히는 지점이 있을 수 있지만, 명리학에서는 적당한 상극이 오히려 서로를 긴장하게 하고 성장시키는 자극이 된다고도 봐요. 다름을 인정하고 조율하는 만큼 관계가 단단해지는 조합이에요.`,
    };
  }
  return {
    tier: "neutral",
    text: `${labelA}와(과) ${labelB}는 직접적인 생·극 관계는 없지만, 각자의 기운을 있는 그대로 존중해줄 때 무난하게 어울리는 조합이에요.`,
  };
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

  const templateAtoB = COMPAT_TEMPLATES.find((t) => t.pattern === groupAtoB) ?? COMPAT_TEMPLATES[0];
  const templateBtoA = COMPAT_TEMPLATES.find((t) => t.pattern === groupBtoA) ?? COMPAT_TEMPLATES[0];
  const dayBranchRelation = findDayBranchRelation(sajuA.pillars.dayPillar.branch, sajuB.pillars.dayPillar.branch);
  const { text: elementRelation, tier: elementRelationTier } = describeElementRelation(
    stemById(dayStemA).element,
    stemById(dayStemB).element
  );

  return {
    groupAtoB,
    groupBtoA,
    textAtoB: templateAtoB.text,
    textBtoA: templateBtoA.text,
    elementRelation,
    elementRelationTier,
    dayBranchRelation,
  };
}

export function describeDayMasterPair(sajuA: SajuResult, sajuB: SajuResult): string {
  return `${stemHanja(sajuA.pillars.dayPillar.stem)}${branchHanja(sajuA.pillars.dayPillar.branch)} · ${stemHanja(
    sajuB.pillars.dayPillar.stem
  )}${branchHanja(sajuB.pillars.dayPillar.branch)}`;
}
