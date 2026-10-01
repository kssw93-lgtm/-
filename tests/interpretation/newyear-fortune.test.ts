import { describe, expect, it } from "vitest";
import { computeNewYearFortune } from "@/lib/interpretation/newyear-fortune";
import { ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import type { BranchId } from "@/lib/calc/types";

describe("computeNewYearFortune", () => {
  it("2027년은 정미년(丁未)이다", () => {
    const fortune = computeNewYearFortune("zi", 2027);
    expect(fortune.yearHanja).toBe("丁未");
    expect(fortune.yearAnimal).toBe("양띠");
  });

  it("양띠(未)에게 2027년은 비견(sameBranch) 관계다", () => {
    const fortune = computeNewYearFortune("wei", 2027);
    expect(fortune.relation).toBe("sameBranch");
  });

  it("소띠(丑)에게 2027년(未)은 충(clash) 관계다 — 축미충", () => {
    const fortune = computeNewYearFortune("chou", 2027);
    expect(fortune.relation).toBe("clash");
  });

  it("같은 연도·같은 띠는 항상 같은 결과를 낸다(결정론적)", () => {
    const a = computeNewYearFortune("zi", 2027);
    const b = computeNewYearFortune("zi", 2027);
    expect(a).toEqual(b);
  });

  it("모든 띠에서 점수가 35~95 범위 안에 있고 헤드라인에 두 띠 이름이 들어간다", () => {
    for (const z of ZODIAC_ANIMALS) {
      const fortune = computeNewYearFortune(z.branch as BranchId, 2027);
      expect(fortune.score).toBeGreaterThanOrEqual(35);
      expect(fortune.score).toBeLessThanOrEqual(95);
      expect(fortune.headline).toContain(z.animal);
    }
  });
});
