import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeVoidBranches } from "@/lib/calc/void-branches";

/** 계산 규칙서 63번: 절기(경칩) 직전/직후 경계. KASI 실측: 2024년 경칩 = 2024-03-05 11:23 KST. */
describe("절기 경계 (월지)", () => {
  const base = {
    year: 2024,
    month: 3,
    day: 5,
    gender: "male" as const,
    calendarType: "solar" as const,
    isLeapMonth: false,
  };

  it("경칩 1분 전 → 寅월 유지", () => {
    const r = computeSaju({ ...base, hour: 11, minute: 22 });
    expect(r.pillars.monthPillar.branch).toBe("yin");
  });

  it("경칩 1분 후 → 卯월로 전환", () => {
    const r = computeSaju({ ...base, hour: 11, minute: 24 });
    expect(r.pillars.monthPillar.branch).toBe("mao");
  });
});

describe("공망 (데이터테이블 30번)", () => {
  it("甲子旬(index 0~9)의 공망은 戌亥", () => {
    expect(computeVoidBranches(3)).toEqual(["xu", "hai"]);
  });
  it("甲午旬(index 30~39)의 공망은 辰巳", () => {
    expect(computeVoidBranches(35)).toEqual(["chen", "si"]);
  });
});
