import compatAxesJson from "@/data/compatibility-axes.json";
import conflictPointsJson from "@/data/compatibility-conflict-points.json";
import type { CompatibilityResult } from "./compatibility";
import type { PatternGroup } from "./feature-extract";

export type CompatTier = "good" | "neutral" | "challenging";

export interface CompatAxis {
  label: string;
  tier: CompatTier;
  tierLabel: string;
  desc: string;
}

export interface CompatibilityAxes {
  personality: CompatAxis;
  communication: CompatAxis;
  emotional: CompatAxis;
  daily: CompatAxis;
  money: CompatAxis;
  marriage: CompatAxis;
}

const AXIS_TEXT = compatAxesJson as Record<
  "communication" | "daily" | "money" | "marriage",
  Partial<Record<CompatTier, string>>
>;

const TIER_LABEL: Record<CompatTier, string> = {
  good: "잘 맞아요",
  neutral: "무난해요",
  challenging: "노력이 필요해요",
};

const NO_DAY_BRANCH_RELATION_TEXT =
  "두 사람의 일지 사이에 뚜렷한 합충 관계는 없어요. 서로에게 큰 자극이나 마찰 없이 각자의 속도를 지키며 지낼 수 있는 조합이에요.";

export interface ConflictPoint {
  title: string;
  desc: string;
}

const CONFLICT_POINTS = conflictPointsJson as Record<string, ConflictPoint>;

/**
 * 배우자궁(일지) 관계가 충·파·해·원진일 때, 그 관계 유형이 두 사람 사이에서 구체적으로
 * 어떤 상황으로 나타나는 편인지 서술한다. 새 계산이 아니라 이미 계산된 dayBranchRelation.type
 * (합충형파해원진 존재 여부)을 그대로 재사용하고, 그 유형의 전통적 의미(relation-types.json)를
 * 부부/커플 상황에 맞게 더 구체적으로 풀어썼을 뿐이다. 육합이거나 관계가 없으면 null.
 */
export function getConflictPoint(dayBranchRelation: CompatibilityResult["dayBranchRelation"]): ConflictPoint | null {
  if (!dayBranchRelation || dayBranchRelation.type === "branch_six_combine") return null;
  return CONFLICT_POINTS[dayBranchRelation.type] ?? null;
}

/** 배우자궁(일지) 관계의 유형에 따라 정서적 자극의 성격을 3단계로 나눈다. 육합=긍정적 안정, 충/파/해/원진=자극과 긴장, 관계 없음=무난. */
function emotionalTier(dayBranchRelation: CompatibilityResult["dayBranchRelation"]): CompatTier {
  if (!dayBranchRelation) return "neutral";
  return dayBranchRelation.type === "branch_six_combine" ? "good" : "challenging";
}

function hasGroup(compat: CompatibilityResult, target: PatternGroup): boolean {
  return compat.groupAtoB === target || compat.groupBtoA === target;
}

/**
 * 궁합 요약 6축 — 새 계산이 아니라 computeCompatibility()가 이미 산출한 값(십신 그룹 양방향,
 * 오행 생극 관계, 배우자궁 합충 관계)을 여섯 개의 익숙한 관점으로 재배열한 것이다.
 * 성격/감정 축은 이미 작성된 설명 텍스트를 그대로 재사용하고, 대화/생활/금전/결혼 축은
 * 전통 십신 배속(식상=표현, 비겁=독립생활, 재성=재물, 관성=책임)의 존재 여부만으로 판정한다.
 * 점수(%)는 상생/상극이나 합/충을 몇 점으로 환산할 근거가 없어 만들지 않고, 3단계 정성 라벨만 쓴다.
 */
export function computeCompatibilityAxes(compat: CompatibilityResult): CompatibilityAxes {
  const eTier: CompatTier = compat.elementRelationTier === "controls" ? "challenging" : compat.elementRelationTier === "neutral" ? "neutral" : "good";
  const emoTier = emotionalTier(compat.dayBranchRelation);
  const commTier: CompatTier = hasGroup(compat, "siksang") ? "good" : "neutral";
  const dailyTier: CompatTier = hasGroup(compat, "bigeob") ? "good" : "neutral";
  const moneyTier: CompatTier = hasGroup(compat, "jaeseong") ? "good" : "neutral";
  const marriageTier: CompatTier =
    emoTier === "challenging" ? "challenging" : hasGroup(compat, "gwanseong") || emoTier === "good" ? "good" : "neutral";

  return {
    personality: { label: "성격 궁합", tier: eTier, tierLabel: TIER_LABEL[eTier], desc: compat.elementRelation },
    communication: {
      label: "대화 궁합",
      tier: commTier,
      tierLabel: TIER_LABEL[commTier],
      desc: AXIS_TEXT.communication[commTier] ?? "",
    },
    emotional: {
      label: "감정 궁합",
      tier: emoTier,
      tierLabel: TIER_LABEL[emoTier],
      desc: compat.dayBranchRelation
        ? `배우자궁이 ${compat.dayBranchRelation.name} 관계예요. ${compat.dayBranchRelation.desc}.`
        : NO_DAY_BRANCH_RELATION_TEXT,
    },
    daily: { label: "생활 궁합", tier: dailyTier, tierLabel: TIER_LABEL[dailyTier], desc: AXIS_TEXT.daily[dailyTier] ?? "" },
    money: { label: "금전 궁합", tier: moneyTier, tierLabel: TIER_LABEL[moneyTier], desc: AXIS_TEXT.money[moneyTier] ?? "" },
    marriage: {
      label: "결혼 궁합",
      tier: marriageTier,
      tierLabel: TIER_LABEL[marriageTier],
      desc: AXIS_TEXT.marriage[marriageTier] ?? "",
    },
  };
}
