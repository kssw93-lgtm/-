import type { BranchId, FourPillars, StemId } from "./types";

export type SinsalId = "cheoneulgwiin" | "yeokma" | "dohwa" | "yangin" | "hwagae" | "munchang";

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

// 역마살/도화살/화개살: 년지/일지 삼합 그룹 → 각 지지
const SAMHAP_GROUPS: { members: BranchId[]; yeokma: BranchId; dohwa: BranchId; hwagae: BranchId }[] = [
  { members: ["shen", "zi", "chen"], yeokma: "yin", dohwa: "you", hwagae: "chen" },
  { members: ["hai", "mao", "wei"], yeokma: "si", dohwa: "zi", hwagae: "wei" },
  { members: ["yin", "wu", "xu"], yeokma: "shen", dohwa: "mao", hwagae: "xu" },
  { members: ["si", "you", "chou"], yeokma: "hai", dohwa: "wu", hwagae: "chou" },
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
    if (branches.includes(group.yeokma)) hits.push({ id: "yeokma", matchedBranch: group.yeokma });
    if (branches.includes(group.dohwa)) hits.push({ id: "dohwa", matchedBranch: group.dohwa });
    if (branches.includes(group.hwagae)) hits.push({ id: "hwagae", matchedBranch: group.hwagae });
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
