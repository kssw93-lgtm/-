import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeFiveElementsBalance } from "@/lib/interpretation/five-elements-balance";
import fiveElementsBalanceJson from "@/data/five-elements-balance.json";
import type { ElementId } from "@/lib/calc/types";

const ALL_ELEMENTS: ElementId[] = ["wood", "fire", "earth", "metal", "water"];

describe("오행 과다/결핍 데이터", () => {
  it("모든 오행에 과다(excess)·결핍(deficient) 문구가 채워져 있다", () => {
    const balance = fiveElementsBalanceJson as Record<ElementId, { excess: string; deficient: string }>;
    for (const el of ALL_ELEMENTS) {
      expect(balance[el].excess.length).toBeGreaterThan(0);
      expect(balance[el].deficient.length).toBeGreaterThan(0);
    }
  });
});

describe("computeFiveElementsBalance", () => {
  it("화(火)가 4개로 쏠리고 금(金)이 하나도 없는 원국에서 과다/결핍을 정확히 잡아낸다", () => {
    // 년주 乙亥·월주 壬午·일주 丁丑·시주 丙午 — 화가 4개(丁,丙,午,午), 금은 0개
    const saju = computeSaju({
      year: 1995,
      month: 6,
      day: 15,
      hour: 12,
      minute: 0,
      gender: "female",
      calendarType: "solar",
      isLeapMonth: false,
    });
    const balance = computeFiveElementsBalance(saju);

    expect(balance.counts.fire).toBe(4);
    expect(balance.excessElements).toContain("fire");
    expect(balance.counts.metal).toBe(0);
    expect(balance.deficientElements).toContain("metal");
    expect(balance.narrative).not.toBeNull();
    expect(balance.narrative).toContain("화(火)");
    expect(balance.narrative).toContain("금(金)");
  });

  it("과다·결핍 오행이 하나도 없으면 narrative는 null이다(억지로 지어내지 않는다)", () => {
    const balanced = computeFiveElementsBalance({
      elements: {
        stemElements: ["wood", "fire", "earth", "metal"],
        branchElements: ["water", "wood", "fire", "earth"],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    expect(balanced.excessElements).toHaveLength(0);
    expect(balanced.deficientElements).toHaveLength(0);
    expect(balanced.narrative).toBeNull();
  });
});
