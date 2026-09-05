import relationTypesJson from "@/data/relation-types.json";
import { BRANCH_RELATIONS } from "@/lib/calc/data";
import { getZodiacCompat } from "@/lib/interpretation/zodiac-compat";
import { STAR_SIGNS, ZODIAC_ANIMALS, type StarSignEntry, type ZodiacAnimalEntry } from "@/lib/content/zodiac-pages";
import type { BranchId } from "@/lib/calc/types";

interface RelationTypeInfo {
  name: string;
  desc: string;
}

const RELATION_TYPES = relationTypesJson as Record<string, RelationTypeInfo>;

/**
 * 78개 조합 페이지(a,b)는 항상 이 배열 순서를 기준으로 인덱스가 낮은 쪽을 a로 둬서
 * URL을 하나로 고정한다(예: zi-vs-chou는 있어도 chou-vs-zi는 만들지 않음).
 * data/zodiac-animals.json 자체가 이미 자축인묘진사오미신유술해 순서라 그대로 쓴다.
 */
const BRANCH_ORDER: BranchId[] = ZODIAC_ANIMALS.map((z) => z.branch as BranchId);
const STAR_ORDER: string[] = STAR_SIGNS.map((s) => s.id);

export type CompatCategory = "best" | "good" | "effort" | "punishment" | "neutral";

export interface PairRelationView {
  category: CompatCategory;
  label: string;
  emoji: string;
  desc: string;
}

function branchIndex(branch: string): number {
  return BRANCH_ORDER.indexOf(branch as BranchId);
}

function starIndex(id: string): number {
  return STAR_ORDER.indexOf(id);
}

export function sortBranchPair(a: string, b: string): [string, string] {
  return branchIndex(a) <= branchIndex(b) ? [a, b] : [b, a];
}

export function sortStarPair(a: string, b: string): [string, string] {
  return starIndex(a) <= starIndex(b) ? [a, b] : [b, a];
}

export function getAnimalEntry(branch: string): ZodiacAnimalEntry | undefined {
  return ZODIAC_ANIMALS.find((z) => z.branch === branch);
}

export function getStarEntry(id: string): StarSignEntry | undefined {
  return STAR_SIGNS.find((s) => s.id === id);
}

/** 모든 지지 쌍(자기 자신 포함) — 순서 무관 78쌍 = C(12,2) 66 + 자기 자신 12 */
export function allAnimalPairs(): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < BRANCH_ORDER.length; i++) {
    for (let j = i; j < BRANCH_ORDER.length; j++) {
      pairs.push([BRANCH_ORDER[i], BRANCH_ORDER[j]]);
    }
  }
  return pairs;
}

/** 모든 별자리 쌍(자기 자신 포함) — 순서 무관 78쌍 = C(12,2) 66 + 자기 자신 12 */
export function allStarPairs(): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < STAR_ORDER.length; i++) {
    for (let j = i; j < STAR_ORDER.length; j++) {
      pairs.push([STAR_ORDER[i], STAR_ORDER[j]]);
    }
  }
  return pairs;
}

function relationView(key: keyof typeof RELATION_TYPES, category: CompatCategory, emoji: string, label: string): PairRelationView {
  const info = RELATION_TYPES[key];
  return { category, label, emoji, desc: info.desc };
}

/**
 * 새 궁합표를 만들지 않고, lib/interpretation/zodiac-compat.ts의 getZodiacCompat이
 * 만들어내는 찰떡궁합(육합)/잘 맞는 편(삼합)/노력이 필요한 편(충·파·해·원진) 분류를
 * 그대로 재사용해 두 띠 사이의 관계를 판정한다. 결과 화면(ResultScreen)에서 쓰는
 * 이모지·라벨과도 동일하게 맞췄다.
 *
 * 세 분류 중 어디에도 없으면(같은 띠거나, 명리학적으로 특별히 이름 붙은 관계가 없는
 * 조합) data/branch-relations.json의 형(刑) 관계까지 직접 확인한다 — 형은
 * zodiac-compat.ts의 "노력이 필요한 편" 집계에는 포함돼 있지 않지만(연간에서 이미
 * 그렇게 설계됨), 실제 계산 엔진(lib/calc/relations.ts)이 판정하는 엄연한 지지
 * 관계이므로 두 띠 조합 페이지에서는 함께 보여준다. 그 무엇에도 해당하지 않으면
 * "무관"으로 표시한다 — 이 경우도 새 문구를 짓지 않고 사실을 있는 그대로 전달한다.
 */
export function getAnimalPairRelation(a: string, b: string): PairRelationView {
  const branchA = a as BranchId;
  const branchB = b as BranchId;
  const compat = getZodiacCompat(branchA, "aries"); // 별자리 인자는 애니멀 궁합 계산과 무관 — 고정값
  const animalB = getAnimalEntry(b)?.animal ?? b;

  if (compat.animalBest.labels.includes(animalB)) {
    return relationView("branch_six_combine", "best", "💛", "찰떡궁합");
  }
  if (compat.animalGood.labels.includes(animalB)) {
    return relationView("branch_three_combine", "good", "🟢", "잘 맞는 편");
  }
  if (compat.animalEffort.labels.includes(animalB)) {
    // effort 묶음은 충/파/해/원진 중 어느 것이 실제로 걸렸는지 다시 찾아 더 구체적인 설명을 쓴다.
    const specific = findEffortRelationType(branchA, branchB);
    if (specific) return relationView(specific, "effort", "🔴", "노력이 필요한 편");
    return {
      category: "effort",
      label: "노력이 필요한 편",
      emoji: "🔴",
      desc: compat.animalEffort.desc,
    };
  }

  const punishment = hasPunishment(branchA, branchB);
  if (punishment) {
    return relationView("branch_punishment", "punishment", "🟠", "형(刑) 관계");
  }

  return {
    category: "neutral",
    label: "무관",
    emoji: "⚪",
    desc: "명리학에서 육합·삼합·충·파·해·원진·형처럼 특별히 이름 붙인 지지 관계에는 해당하지 않는 조합이에요. 특별히 끌리거나 부딪힐 이유가 없는, 무난한 조합으로 볼 수 있어요.",
  };
}

function findEffortRelationType(a: BranchId, b: BranchId): keyof typeof RELATION_TYPES | null {
  const pairMatch = (list: { source: BranchId; target: BranchId }[]) =>
    list.some((r) => (r.source === a && r.target === b) || (r.source === b && r.target === a));
  if (pairMatch(BRANCH_RELATIONS.clash)) return "branch_clash";
  if (pairMatch(BRANCH_RELATIONS.break)) return "branch_break";
  if (pairMatch(BRANCH_RELATIONS.harm)) return "branch_harm";
  if (pairMatch(BRANCH_RELATIONS.resentment)) return "branch_resentment";
  return null;
}

function hasPunishment(a: BranchId, b: BranchId): boolean {
  for (const p of BRANCH_RELATIONS.punishment) {
    if (p.type === "pair" && ((p.branches[0] === a && p.branches[1] === b) || (p.branches[0] === b && p.branches[1] === a))) {
      return true;
    }
    if (p.type === "triple" && a !== b && p.branches.includes(a) && p.branches.includes(b)) {
      return true;
    }
    if (p.type === "self" && a === b && p.branches[0] === a) {
      return true;
    }
  }
  return false;
}

/**
 * 별자리 궁합도 같은 원리 — getZodiacCompat이 4원소 배속으로 계산하는
 * 찰떡궁합(같은 원소)/잘 맞는 편(보완 원소)/노력이 필요한 편(정반대 별자리) 분류를
 * 그대로 재사용한다. 세 분류에 없는 조합(같은 별자리, 또는 관련 없는 원소 조합)은
 * "무관"으로 표시한다.
 */
export function getStarPairRelation(a: string, b: string): PairRelationView {
  const compat = getZodiacCompat("zi", a); // 띠 인자는 별자리 궁합 계산과 무관 — 고정값
  const starB = getStarEntry(b)?.name ?? b;

  if (compat.starBest.labels.includes(starB)) {
    return { category: "best", label: "찰떡궁합", emoji: "💛", desc: compat.starBest.desc };
  }
  if (compat.starGood.labels.includes(starB)) {
    return { category: "good", label: "잘 맞는 편", emoji: "🟢", desc: compat.starGood.desc };
  }
  if (compat.starChallenging.labels.includes(starB)) {
    return { category: "effort", label: "노력이 필요한 편(정반대 별자리)", emoji: "🔴", desc: compat.starChallenging.desc };
  }

  return {
    category: "neutral",
    label: "무관",
    emoji: "⚪",
    desc: "같은 원소도, 보완 원소도, 정반대 자리도 아닌 조합이에요. 특별히 끌리거나 부딪힐 이유가 없는, 무난한 조합으로 볼 수 있어요.",
  };
}
