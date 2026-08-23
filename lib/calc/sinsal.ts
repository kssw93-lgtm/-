import type { BranchId, FourPillars, StemId } from "./types";

export type SinsalId =
  | "cheoneulgwiin" | "yeokma" | "dohwa" | "yangin" | "hwagae" | "munchang"
  | "geopsal" | "jaesal" | "cheonsal" | "jisal" | "wolsal"
  | "mangsinsal" | "jangseongsal" | "banansal" | "yukhaesal";

/**
 * 신살(神殺)은 고정된 전통 대조표를 기반으로 한 "존재 여부" 계산이다(계산 규칙서 58, 59번의
 * "고정 데이터/AI 임의 변경 금지" 원칙과 동일하게 취급). 의미 해석은 별도 텍스트로 분리한다.
 * 일지(day branch)를 기준 지지로 사용한다(현대 실무에서 널리 쓰이는 방식).
 */

// 천을귀인: 일간 → 귀인 지지 2개
const CHEONEUL_TABLE: Record<StemId, BranchId[]> = {
  jia: ["chou", "wei"], wu: ["chou", "wei"], geng: ["chou", "wei"],
  yi: ["zi", "shen"], ji: ["zi", "shen"],
  bing: ["hai", "you"], ding: ["hai", "you"],
  xin: ["yin", "wu"],
  ren: ["si", "mao"], gui: ["si", "mao"],
};

// 십이신살: 일지 삼합 그룹 → 12개 지지 전부. 겁살부터 화개살까지 순서대로 배치되며,
// 기존에 검증된 역마·년살(도화)·화개 세 지점을 교차검증 기준점으로 삼아 나머지 9개를 확정했다.
interface SamhapGroup {
  members: BranchId[];
  geopsal: BranchId;
  jaesal: BranchId;
  cheonsal: BranchId;
  jisal: BranchId;
  dohwa: BranchId; // 년살
  wolsal: BranchId;
  mangsinsal: BranchId;
  jangseongsal: BranchId;
  banansal: BranchId;
  yeokma: BranchId;
  yukhaesal: BranchId;
  hwagae: BranchId;
}
const SAMHAP_GROUPS: SamhapGroup[] = [
  {
    members: ["shen", "zi", "chen"],
    geopsal: "si", jaesal: "wu", cheonsal: "wei", jisal: "shen", dohwa: "you", wolsal: "xu",
    mangsinsal: "hai", jangseongsal: "zi", banansal: "chou", yeokma: "yin", yukhaesal: "mao", hwagae: "chen",
  },
  {
    members: ["hai", "mao", "wei"],
    geopsal: "shen", jaesal: "you", cheonsal: "xu", jisal: "hai", dohwa: "zi", wolsal: "chou",
    mangsinsal: "yin", jangseongsal: "mao", banansal: "chen", yeokma: "si", yukhaesal: "wu", hwagae: "wei",
  },
  {
    members: ["yin", "wu", "xu"],
    geopsal: "hai", jaesal: "zi", cheonsal: "chou", jisal: "yin", dohwa: "mao", wolsal: "chen",
    mangsinsal: "si", jangseongsal: "wu", banansal: "wei", yeokma: "shen", yukhaesal: "you", hwagae: "xu",
  },
  {
    members: ["si", "you", "chou"],
    geopsal: "yin", jaesal: "mao", cheonsal: "chen", jisal: "si", dohwa: "wu", wolsal: "wei",
    mangsinsal: "shen", jangseongsal: "you", banansal: "xu", yeokma: "hai", yukhaesal: "zi", hwagae: "chou",
  },
];

// 양인살: 일간(양간만) → 제왕지. 갑묘·병오·무오·경유·임자 — 음간 양인은 유파별로 갈려 제외.
const YANGIN_TABLE: Partial<Record<StemId, BranchId>> = {
  jia: "mao", bing: "wu", wu: "wu", geng: "you", ren: "zi",
};

// 문창귀인: 일간 → 지지 1개. 갑사·을오·병신·정유·무신·기유·경해·신자·임인·계묘.
const MUNCHANG_TABLE: Record<StemId, BranchId> = {
  jia: "si", yi: "wu", bing: "shen", ding: "you", wu: "shen",
  ji: "you", geng: "hai", xin: "zi", ren: "yin", gui: "mao",
};

export interface SinsalHit {
  id: SinsalId;
  matchedBranch: BranchId;
}

/** 천을귀인 지지 대조표를 원국 밖(예: 대운)에서도 재사용할 수 있게 노출한다. */
export function getCheoneulTargets(dayStem: StemId): BranchId[] {
  return CHEONEUL_TABLE[dayStem];
}

export function computeSinsal(pillars: FourPillars): SinsalHit[] {
  const dayStem = pillars.dayPillar.stem;
  const dayBranch = pillars.dayPillar.branch;
  const branches: BranchId[] = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) branches.push(pillars.hourPillar.branch);

  const hits: SinsalHit[] = [];

  const cheoneulTargets = CHEONEUL_TABLE[dayStem];
  for (const b of branches) {
    if (cheoneulTargets.includes(b)) {
      hits.push({ id: "cheoneulgwiin", matchedBranch: b });
      break;
    }
  }

  const group = SAMHAP_GROUPS.find((g) => g.members.includes(dayBranch));
  if (group) {
    const samhapChecks: { id: SinsalId; branch: BranchId }[] = [
      { id: "geopsal", branch: group.geopsal },
      { id: "jaesal", branch: group.jaesal },
      { id: "cheonsal", branch: group.cheonsal },
      { id: "jisal", branch: group.jisal },
      { id: "dohwa", branch: group.dohwa },
      { id: "wolsal", branch: group.wolsal },
      { id: "mangsinsal", branch: group.mangsinsal },
      { id: "jangseongsal", branch: group.jangseongsal },
      { id: "banansal", branch: group.banansal },
      { id: "yeokma", branch: group.yeokma },
      { id: "yukhaesal", branch: group.yukhaesal },
      { id: "hwagae", branch: group.hwagae },
    ];
    for (const { id, branch } of samhapChecks) {
      if (branches.includes(branch)) hits.push({ id, matchedBranch: branch });
    }
  }

  const yanginTarget = YANGIN_TABLE[dayStem];
  if (yanginTarget && branches.includes(yanginTarget)) {
    hits.push({ id: "yangin", matchedBranch: yanginTarget });
  }

  const munchangTarget = MUNCHANG_TABLE[dayStem];
  if (branches.includes(munchangTarget)) {
    hits.push({ id: "munchang", matchedBranch: munchangTarget });
  }

  return hits;
}
