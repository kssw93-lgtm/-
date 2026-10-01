import newyearBranchRelationJson from "@/data/newyear-branch-relation.json";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";
import { pillarForEffectiveYear } from "@/lib/calc/year-pillar";
import { classifyBranchRelation } from "./daily-branch-fortune";
import { hashSeed } from "./template-select";
import type { BranchId } from "@/lib/calc/types";

type RelationKey =
  | "sixCombine" | "threeCombine" | "sameBranch" | "clash" | "punishment"
  | "selfPunishment" | "break" | "harm" | "resentment" | "neutral";

interface RelationCopy {
  label: string;
  emoji: string;
  scoreBase: number;
  headline: string;
  overall: string;
  careerNote: string;
  wealthNote: string;
  loveNote: string;
  caution: string;
}

const RELATION_COPY = newyearBranchRelationJson as Record<RelationKey, RelationCopy>;
const ZODIAC_ANIMALS = zodiacAnimalsJson as { branch: BranchId; animal: string; hanja: string }[];
const ANIMAL_BY_BRANCH = new Map(ZODIAC_ANIMALS.map((z) => [z.branch, z.animal]));

export interface NewYearFortune {
  year: number;
  yearHanja: string;
  yearAnimal: string;
  relation: RelationKey;
  label: string;
  emoji: string;
  score: number;
  headline: string;
  overall: string;
  careerNote: string;
  wealthNote: string;
  loveNote: string;
  caution: string;
}

/**
 * 세운(해당 연도의 60갑자, lib/calc/saeun.ts·year-pillar.ts와 동일 계산)의 지지와 내
 * 띠(년지) 사이의 실제 지지 관계(육합·삼합/방합·충·형·자형·파·해·원진)로 "OO년
 * 신년운세"를 계산한다. daily-branch-fortune.ts의 classifyBranchRelation을 그대로
 * 재사용해, 같은 관계 분류 로직을 날짜 단위(오늘)와 연 단위(올해)에 동일하게 적용한다.
 * 점수는 관계별 기준점 + 연도·띠마다 달라지는 결정론적 보정값(해시)을 더한 것이다.
 */
export function computeNewYearFortune(myBranch: BranchId, year: number): NewYearFortune {
  const yearPillar = pillarForEffectiveYear(year);
  const relation = classifyBranchRelation(myBranch, yearPillar.branch);
  const copy = RELATION_COPY[relation];

  const myAnimal = ANIMAL_BY_BRANCH.get(myBranch) ?? "";
  const yearAnimal = ANIMAL_BY_BRANCH.get(yearPillar.branch) ?? "";
  const headline = copy.headline.replaceAll("{myAnimal}", myAnimal).replaceAll("{yearAnimal}", yearAnimal);

  const jitterSeed = hashSeed(`${year}|${myBranch}|newyear`);
  const jitter = (jitterSeed % 11) - 5; // -5 ~ +5
  const score = Math.max(35, Math.min(95, copy.scoreBase + jitter));

  return {
    year,
    yearHanja: yearPillar.hanja,
    yearAnimal,
    relation,
    label: copy.label,
    emoji: copy.emoji,
    score,
    headline,
    overall: copy.overall,
    careerNote: copy.careerNote,
    wealthNote: copy.wealthNote,
    loveNote: copy.loveNote,
    caution: copy.caution,
  };
}
