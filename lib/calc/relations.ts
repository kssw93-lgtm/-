import { BRANCH_RELATIONS, STEM_RELATIONS } from "./data";
import type { BranchId, FourPillars, RelationHit, StemId } from "./types";

/**
 * 계산 규칙서 33~41번: 합충형파해원진.
 * 계산 엔진은 "관계의 존재 여부"만 산출하고, 실제 성립·화(化) 여부와 해석은
 * 명리 해석 엔진의 영역이다(33, 36번).
 */
export function computeRelations(pillars: FourPillars): RelationHit[] {
  const stems: StemId[] = [pillars.yearPillar.stem, pillars.monthPillar.stem, pillars.dayPillar.stem];
  const branches: BranchId[] = [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch];
  if (pillars.hourPillar) {
    stems.push(pillars.hourPillar.stem);
    branches.push(pillars.hourPillar.branch);
  }

  const hits: RelationHit[] = [];

  const pairExists = (a: string, b: string, list: { source: string; target: string }[]) =>
    list.some((r) => (r.source === a && r.target === b) || (r.source === b && r.target === a));

  // 천간합
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      if (pairExists(stems[i], stems[j], STEM_RELATIONS.combine)) {
        hits.push({ type: "stem_combine", members: [stems[i], stems[j]] });
      }
    }
  }

  const branchPairChecks: { key: keyof typeof BRANCH_RELATIONS; type: RelationHit["type"] }[] = [
    { key: "sixCombine", type: "branch_six_combine" },
    { key: "clash", type: "branch_clash" },
    { key: "break", type: "branch_break" },
    { key: "harm", type: "branch_harm" },
    { key: "resentment", type: "branch_resentment" },
  ];

  for (const { key, type } of branchPairChecks) {
    const list = BRANCH_RELATIONS[key] as { source: BranchId; target: BranchId }[];
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        if (pairExists(branches[i], branches[j], list)) {
          hits.push({ type, members: [branches[i], branches[j]] });
        }
      }
    }
  }

  // 삼합/방합: 세 지지가 모두 존재해야 히트로 기록한다(부분 조합의 해석은 해석 엔진 영역).
  const branchSet = new Set(branches);
  for (const combo of BRANCH_RELATIONS.threeCombine) {
    if (combo.branches.every((b) => branchSet.has(b))) {
      hits.push({ type: "branch_three_combine", members: combo.branches, element: combo.element });
    }
  }
  for (const combo of BRANCH_RELATIONS.directionalCombine) {
    if (combo.branches.every((b) => branchSet.has(b))) {
      hits.push({ type: "branch_directional_combine", members: combo.branches, element: combo.element });
    }
  }

  // 형(刑)
  for (const p of BRANCH_RELATIONS.punishment) {
    if (p.type === "pair") {
      if (pairExists(p.branches[0], p.branches[1], [{ source: p.branches[0], target: p.branches[1] }]) &&
        branches.includes(p.branches[0]) && branches.includes(p.branches[1])) {
        hits.push({ type: "branch_punishment", members: p.branches });
      }
    } else if (p.type === "triple") {
      if (p.branches.every((b) => branchSet.has(b))) {
        hits.push({ type: "branch_punishment", members: p.branches });
      }
    } else if (p.type === "self") {
      const branch = p.branches[0];
      const count = branches.filter((b) => b === branch).length;
      if (count >= 2) {
        hits.push({ type: "branch_punishment", members: [branch, branch] });
      }
    }
  }

  return hits;
}
