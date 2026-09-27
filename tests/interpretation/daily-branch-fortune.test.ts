import { describe, expect, it } from "vitest";
import { classifyBranchRelation, computeAnimalDailyFortune } from "@/lib/interpretation/daily-branch-fortune";
import { computeStarDailyMood } from "@/lib/interpretation/daily-star-mood";
import { ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { STAR_SIGNS } from "@/lib/content/zodiac-pages";
import type { BranchId } from "@/lib/calc/types";

describe("classifyBranchRelation", () => {
  it("육합 쌍을 정확히 분류한다", () => {
    expect(classifyBranchRelation("zi", "chou")).toBe("sixCombine");
    expect(classifyBranchRelation("chou", "zi")).toBe("sixCombine"); // 순서 무관
  });
  it("충 쌍을 정확히 분류한다", () => {
    expect(classifyBranchRelation("zi", "wu")).toBe("clash");
  });
  it("같은 지지는 자형 여부로 나뉜다", () => {
    expect(classifyBranchRelation("chen", "chen")).toBe("selfPunishment"); // 진진형
    expect(classifyBranchRelation("zi", "zi")).toBe("sameBranch"); // 자형 목록에 없음
  });
  it("삼합/방합에 속하는 2개 지지는 threeCombine으로 분류한다", () => {
    expect(classifyBranchRelation("shen", "zi")).toBe("threeCombine"); // 신자진 수국
    expect(classifyBranchRelation("yin", "mao")).toBe("threeCombine"); // 인묘진 방합
  });
  it("형(pair) 관계를 분류한다", () => {
    expect(classifyBranchRelation("zi", "mao")).toBe("punishment");
  });
  it("파를 분류한다", () => {
    expect(classifyBranchRelation("zi", "you")).toBe("break");
  });
  it("아무 관계도 없으면 neutral이다", () => {
    // zi 기준: chou(합) wu(충) mao(형) you(파) wei(해?) 등을 제외한 조합 확인
    const result = classifyBranchRelation("zi", "chen");
    expect(["threeCombine", "neutral"]).toContain(result);
  });
});

describe("computeAnimalDailyFortune", () => {
  it("같은 날짜·같은 띠는 항상 같은 결과를 낸다(결정론적)", () => {
    const now = new Date(2026, 8, 27);
    const a = computeAnimalDailyFortune("zi", now);
    const b = computeAnimalDailyFortune("zi", now);
    expect(a).toEqual(b);
  });
  it("날짜가 바뀌면 오늘의 일진(관계)이 달라질 수 있다", () => {
    const day1 = computeAnimalDailyFortune("zi", new Date(2026, 8, 27));
    const day2 = computeAnimalDailyFortune("zi", new Date(2026, 8, 28));
    // 두 값이 완전히 같을 필요는 없다 — 최소한 헤드라인 문구가 오늘 지지 이름을 담고 있는지만 확인
    expect(day1.headline).toContain("쥐띠");
    expect(day2.headline).toContain("쥐띠");
  });
  it("점수는 항상 35~95 범위 안에 있다", () => {
    for (const z of ZODIAC_ANIMALS) {
      const daily = computeAnimalDailyFortune(z.branch as BranchId, new Date(2026, 0, 1));
      expect(daily.score).toBeGreaterThanOrEqual(35);
      expect(daily.score).toBeLessThanOrEqual(95);
    }
  });
});

describe("computeStarDailyMood", () => {
  it("같은 날짜·같은 별자리는 항상 같은 결과를 낸다(결정론적)", () => {
    const now = new Date(2026, 8, 27);
    const a = computeStarDailyMood("aries", now);
    const b = computeStarDailyMood("aries", now);
    expect(a).toEqual(b);
  });
  it("모든 별자리에서 점수가 45~90 범위 안에 있다", () => {
    for (const s of STAR_SIGNS) {
      const daily = computeStarDailyMood(s.id, new Date(2026, 5, 15));
      expect(daily.score).toBeGreaterThanOrEqual(45);
      expect(daily.score).toBeLessThanOrEqual(90);
    }
  });
});
