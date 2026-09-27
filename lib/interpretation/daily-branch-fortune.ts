import dailyBranchRelationJson from "@/data/daily-branch-relation.json";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";
import { BRANCH_RELATIONS } from "@/lib/calc/data";
import { computeDayPillar } from "@/lib/calc/day-pillar";
import { hashSeed } from "./template-select";
import type { BranchId } from "@/lib/calc/types";
import type { CalendarDate } from "@/lib/calc/day-pillar";

type RelationKey =
  | "sixCombine" | "threeCombine" | "sameBranch" | "clash" | "punishment"
  | "selfPunishment" | "break" | "harm" | "resentment" | "neutral";

interface RelationCopy {
  label: string;
  emoji: string;
  scoreBase: number;
  headline: string;
  summary: string;
  loveNote: string;
  moneyNote: string;
  caution: string;
}

const RELATION_COPY = dailyBranchRelationJson as Record<RelationKey, RelationCopy>;
const ZODIAC_ANIMALS = zodiacAnimalsJson as { branch: BranchId; animal: string; hanja: string }[];

const ANIMAL_BY_BRANCH = new Map(ZODIAC_ANIMALS.map((z) => [z.branch, z.animal]));

function pairMatches(a: BranchId, b: BranchId, list: { source: BranchId; target: BranchId }[]): boolean {
  return list.some((r) => (r.source === a && r.target === b) || (r.source === b && r.target === a));
}

/**
 * 두 지지(내 띠의 년지, 오늘 일진의 지지) 사이의 관계를 하나로 분류한다.
 * 삼합/방합은 세 지지가 모두 있어야 실제로 "성립"하지만, 두 지지만으로도 그 조합의
 * 일부(반합)라는 점 자체는 참고할 만한 신호라 별도 카테고리로 다룬다.
 */
export function classifyBranchRelation(mine: BranchId, today: BranchId): RelationKey {
  if (pairMatches(mine, today, BRANCH_RELATIONS.sixCombine)) return "sixCombine";
  if (mine === today) {
    const isSelfPunishment = BRANCH_RELATIONS.punishment.some(
      (p) => p.type === "self" && p.branches[0] === mine
    );
    return isSelfPunishment ? "selfPunishment" : "sameBranch";
  }
  const inThreeOrDirectional = [...BRANCH_RELATIONS.threeCombine, ...BRANCH_RELATIONS.directionalCombine].some(
    (combo) => combo.branches.includes(mine) && combo.branches.includes(today)
  );
  if (inThreeOrDirectional) return "threeCombine";
  if (pairMatches(mine, today, BRANCH_RELATIONS.clash)) return "clash";
  const isPairPunishment = BRANCH_RELATIONS.punishment.some(
    (p) => p.type === "pair" && p.branches.includes(mine) && p.branches.includes(today)
  );
  if (isPairPunishment) return "punishment";
  if (pairMatches(mine, today, BRANCH_RELATIONS.break)) return "break";
  if (pairMatches(mine, today, BRANCH_RELATIONS.harm)) return "harm";
  if (pairMatches(mine, today, BRANCH_RELATIONS.resentment)) return "resentment";
  return "neutral";
}

export interface AnimalDailyFortune {
  dateLabel: string;
  relation: RelationKey;
  label: string;
  emoji: string;
  score: number;
  headline: string;
  summary: string;
  loveNote: string;
  moneyNote: string;
  caution: string;
  todayAnimal: string;
}

/**
 * 오늘의 일진(day pillar)의 지지와 내 띠(년지) 사이의 합충형파해원진 관계로
 * "오늘의 띠별 운세"를 뽑는다. 점수는 관계별 기준점 + 날짜·띠마다 달라지는
 * 결정론적 보정값(해시)을 더한 것 — 같은 날엔 항상 같은 값이 나온다.
 */
export function computeAnimalDailyFortune(myBranch: BranchId, now: Date = new Date()): AnimalDailyFortune {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const date: CalendarDate = { year: y, month: m, day: d };

  const todayPillar = computeDayPillar(date);
  const relation = classifyBranchRelation(myBranch, todayPillar.branch);
  const copy = RELATION_COPY[relation];

  const myAnimal = ANIMAL_BY_BRANCH.get(myBranch) ?? "";
  const todayAnimal = ANIMAL_BY_BRANCH.get(todayPillar.branch) ?? "";
  const fill = (text: string) => text.replaceAll("{myAnimal}", myAnimal).replaceAll("{todayAnimal}", todayAnimal);

  const jitterSeed = hashSeed(`${y}-${m}-${d}|${myBranch}|daily-branch`);
  const jitter = (jitterSeed % 11) - 5; // -5 ~ +5
  const score = Math.max(35, Math.min(95, copy.scoreBase + jitter));

  return {
    dateLabel: `${y}년 ${m}월 ${d}일`,
    relation,
    label: copy.label,
    emoji: copy.emoji,
    score,
    headline: fill(copy.headline),
    summary: copy.summary,
    loveNote: copy.loveNote,
    moneyNote: copy.moneyNote,
    caution: copy.caution,
    todayAnimal,
  };
}
