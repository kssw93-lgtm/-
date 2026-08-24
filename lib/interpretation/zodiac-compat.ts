import relationTypesJson from "@/data/relation-types.json";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";
import { BRANCH_RELATIONS } from "@/lib/calc/data";
import type { BranchId } from "@/lib/calc/types";

interface RelationTypeInfo {
  name: string;
  desc: string;
}

const RELATION_TYPES = relationTypesJson as Record<string, RelationTypeInfo>;

const ANIMAL_BY_BRANCH = new Map<BranchId, string>(
  (zodiacAnimalsJson as { branch: BranchId; animal: string }[]).map((z) => [z.branch, z.animal])
);

function animalOf(branch: BranchId): string {
  return ANIMAL_BY_BRANCH.get(branch) ?? branch;
}

export type StarElementId = "fire" | "earth" | "air" | "water";

/** 서양 점성술의 4원소 배속 — 어느 출처에서나 동일하게 쓰이는 비쟁점 고정표 */
export const STAR_SIGN_ELEMENT: Record<string, StarElementId> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
};

const ELEMENT_COMPLEMENT: Record<StarElementId, StarElementId> = {
  fire: "air",
  air: "fire",
  earth: "water",
  water: "earth",
};

/** 정반대 별자리(6쌍) — 점성술에서 가장 널리 쓰이는 "매력적이지만 부딪히는 조합"의 기준 */
const OPPOSITE_SIGN: Record<string, string> = {
  aries: "libra",
  libra: "aries",
  taurus: "scorpio",
  scorpio: "taurus",
  gemini: "sagittarius",
  sagittarius: "gemini",
  cancer: "capricorn",
  capricorn: "cancer",
  leo: "aquarius",
  aquarius: "leo",
  virgo: "pisces",
  pisces: "virgo",
};

const SIGN_NAME_BY_ID = new Map<string, string>(
  ([
    ["aries", "양자리"],
    ["taurus", "황소자리"],
    ["gemini", "쌍둥이자리"],
    ["cancer", "게자리"],
    ["leo", "사자자리"],
    ["virgo", "처녀자리"],
    ["libra", "천칭자리"],
    ["scorpio", "전갈자리"],
    ["sagittarius", "사수자리"],
    ["capricorn", "염소자리"],
    ["aquarius", "물병자리"],
    ["pisces", "물고기자리"],
  ] as const)
);

function signName(id: string): string {
  return SIGN_NAME_BY_ID.get(id) ?? id;
}

export interface CompatEntry {
  labels: string[];
  desc: string;
}

export interface ZodiacCompat {
  animalBest: CompatEntry;
  animalGood: CompatEntry;
  animalEffort: CompatEntry;
  starBest: CompatEntry;
  starGood: CompatEntry;
  starChallenging: CompatEntry;
}

/**
 * 띠 궁합 — 새 궁합표를 만들지 않고, 궁합(사람 대 사람) 리포트에서 이미 쓰는 지지 관계
 * (육합·삼합·충·파·해·원진, data/branch-relations.json + data/relation-types.json)를 그대로
 * 재사용한다. 각 지지가 어느 띠에 대응하는지만 변환했을 뿐, 관계의 의미(RELATION_TYPES.desc)도
 * 궁합 화면과 동일한 문구를 그대로 쓴다 — 새로 지어낸 "띠 궁합표"가 아니다.
 */
function computeAnimalCompat(branch: BranchId): { best: CompatEntry; good: CompatEntry; effort: CompatEntry } {
  const sixCombine = BRANCH_RELATIONS.sixCombine.find((r) => r.source === branch || r.target === branch);
  const bestBranch = sixCombine ? (sixCombine.source === branch ? sixCombine.target : sixCombine.source) : null;

  const threeCombineGroup = BRANCH_RELATIONS.threeCombine.find((g) => g.branches.includes(branch));
  const goodBranches = threeCombineGroup ? threeCombineGroup.branches.filter((b) => b !== branch) : [];

  const effortBranches: BranchId[] = [];
  for (const key of ["clash", "break", "harm", "resentment"] as const) {
    const hit = BRANCH_RELATIONS[key].find((r) => r.source === branch || r.target === branch);
    if (hit) effortBranches.push(hit.source === branch ? hit.target : hit.source);
  }

  return {
    best: { labels: bestBranch ? [animalOf(bestBranch)] : [], desc: RELATION_TYPES.branch_six_combine.desc },
    good: { labels: goodBranches.map(animalOf), desc: RELATION_TYPES.branch_three_combine.desc },
    effort: {
      labels: [...new Set(effortBranches.map(animalOf))],
      desc: "부딪히거나 서먹해지기 쉬운 조합이지만, 서로 다름을 이해하려는 노력이 있으면 오히려 자극이 되는 관계예요",
    },
  };
}

function computeStarCompat(signId: string): { best: CompatEntry; good: CompatEntry; challenging: CompatEntry } {
  const element = STAR_SIGN_ELEMENT[signId];
  const complement = ELEMENT_COMPLEMENT[element];
  const bestIds = Object.entries(STAR_SIGN_ELEMENT)
    .filter(([id, el]) => id !== signId && el === element)
    .map(([id]) => id);
  const oppositeId = OPPOSITE_SIGN[signId];
  // 12별자리는 4원소가 순서대로 반복 배치되어 있어, 정반대 별자리(180도)는 항상 보완 원소
  // 그룹 안에 포함된다(수학적으로 필연). 그대로 두면 같은 별자리가 "잘 맞는 편"과
  // "노력이 필요한 편"에 동시에 나와 모순처럼 보이므로, 보완 원소 목록에서는 제외한다.
  const goodIds = Object.entries(STAR_SIGN_ELEMENT)
    .filter(([id, el]) => el === complement && id !== oppositeId)
    .map(([id]) => id);

  return {
    best: { labels: bestIds.map(signName), desc: "같은 원소라 감정의 결이 비슷해서 편하게 통하는 편이에요" },
    good: { labels: goodIds.map(signName), desc: "서로 다른 매력에 자연스럽게 이끌리며 보완이 되는 조합이에요" },
    challenging: {
      labels: oppositeId ? [signName(oppositeId)] : [],
      desc: "정반대 성향이라 부딪히기 쉽지만, 그만큼 서로에게 강하게 끌리는 조합으로도 알려져 있어요",
    },
  };
}

export function getZodiacCompat(branch: BranchId, starSignId: string): ZodiacCompat {
  const animal = computeAnimalCompat(branch);
  const star = computeStarCompat(starSignId);
  return {
    animalBest: animal.best,
    animalGood: animal.good,
    animalEffort: animal.effort,
    starBest: star.best,
    starGood: star.good,
    starChallenging: star.challenging,
  };
}
