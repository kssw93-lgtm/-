import { SEXAGENARY, VOID_BRANCHES } from "./data";
import type { BranchId } from "./types";

/**
 * 계산 규칙서 42번 / 데이터테이블 30번: 공망은 일주가 속한 순(旬)을 기준으로 계산한다.
 */
export function computeVoidBranches(dayPillarIndex: number): BranchId[] {
  const xunStartIndex = dayPillarIndex - (dayPillarIndex % 10);
  const xunStartEntry = SEXAGENARY[xunStartIndex];
  const voidPair = VOID_BRANCHES.byXunStartBranch[xunStartEntry.branch];
  if (!voidPair) {
    throw new Error(`공망 계산 실패: xun start branch ${xunStartEntry.branch}`);
  }
  return voidPair;
}
