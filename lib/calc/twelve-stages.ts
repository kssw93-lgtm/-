import { BRANCHES, stemById } from "./data";
import startBranchJson from "@/data/twelve-stages.json";
import type { BranchId, FourPillars, StemId, TwelveStageId } from "./types";

const STAGE_ORDER: TwelveStageId[] = [
  "jangsaeng", "mokyok", "gwandae", "geonrok", "jewang", "soe",
  "byeong", "sa", "myo", "jeol", "tae", "yang",
];

const START_BRANCH = startBranchJson as Record<StemId, BranchId>;
const BRANCH_INDEX_BY_ID = new Map(BRANCHES.map((b) => [b.id, b.index]));

/**
 * 십이운성(十二運星): 천간이 특정 지지 위에서 갖는 생왕사절(生旺死絶)의 기세를 나타낸다.
 * 양간(갑병무경임)은 장생지에서 지지 순행 방향으로, 음간(을정기신계)은 지지 역행
 * 방향으로 12단계를 돈다 — 계산 규칙서에 없던 항목이라 이번에 조사해 검증 후 추가했다.
 * 각 천간의 장생지(長生支)는 고전 건록(祿) 위치(甲祿寅·乙祿卯·丙戊祿巳·丁己祿午·
 * 庚祿申·辛祿酉·壬祿亥·癸祿子)로 10개 천간 전부 교차검증했다.
 */
export function computeTwelveStage(stem: StemId, branch: BranchId): TwelveStageId {
  const startBranch = START_BRANCH[stem];
  const startIdx = BRANCH_INDEX_BY_ID.get(startBranch)!;
  const targetIdx = BRANCH_INDEX_BY_ID.get(branch)!;
  const isYang = stemById(stem).yinYang === "yang";
  const diff = isYang ? (targetIdx - startIdx + 12) % 12 : (startIdx - targetIdx + 12) % 12;
  return STAGE_ORDER[diff];
}

export interface TwelveStageByPillar {
  pillar: "year" | "month" | "day" | "hour";
  branch: BranchId;
  stageId: TwelveStageId;
}

/**
 * 일간을 기준으로 년지·월지·일지·시지 네 곳에서의 십이운성을 각각 계산한다.
 * (일간이 사주 해석의 중심 기준점이라는 원칙은 이 사이트의 십신·신강신약 계산과 동일하게 유지)
 */
export function computeTwelveStagesForPillars(pillars: FourPillars): TwelveStageByPillar[] {
  const dayStem = pillars.dayPillar.stem;
  const entries: { pillar: TwelveStageByPillar["pillar"]; branch: BranchId | null }[] = [
    { pillar: "year", branch: pillars.yearPillar.branch },
    { pillar: "month", branch: pillars.monthPillar.branch },
    { pillar: "day", branch: pillars.dayPillar.branch },
    { pillar: "hour", branch: pillars.hourPillar?.branch ?? null },
  ];
  return entries.flatMap(({ pillar, branch }) => {
    if (!branch) return [];
    return [{ pillar, branch, stageId: computeTwelveStage(dayStem, branch) }];
  });
}
