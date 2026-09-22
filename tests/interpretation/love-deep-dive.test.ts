import { describe, expect, it } from "vitest";
import { getLoveDeepDive } from "@/lib/interpretation/love-deep-dive";
import { getWorkStyle } from "@/lib/interpretation/work-style";
import { computeStrengthScore, type Strength } from "@/lib/interpretation/strength-score";
import { extractDominantTenGodGroup } from "@/lib/interpretation/feature-extract";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { PatternGroup } from "@/lib/interpretation/feature-extract";

const ALL_GROUPS: PatternGroup[] = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];

const ALL_STRENGTHS: Strength[] = ["gang", "yak"];
const ALL_PATTERNS = ALL_GROUPS.flatMap((group) => ALL_STRENGTHS.map((strength) => ({ group, strength })));

describe("연애운 심화 (data/love-deep-dive.json)", () => {
  it.each(ALL_PATTERNS)("$group/$strength는 네 항목이 모두 채워져 있다", ({ group, strength }) => {
    const d = getLoveDeepDive(group, strength);
    expect(d.idealType.length).toBeGreaterThan(0);
    expect(d.attractsYou.length).toBeGreaterThan(0);
    expect(d.conflictPoint.length).toBeGreaterThan(0);
    expect(d.marriageTendency.length).toBeGreaterThan(0);
  });

  it("그룹마다 서로 다른 문구를 반환한다(재탕 아님)", () => {
    const a = getLoveDeepDive("bigeob", "gang");
    const b = getLoveDeepDive("inseong", "gang");
    expect(a.idealType).not.toBe(b.idealType);
    expect(a.attractsYou).not.toBe(b.attractsYou);
    expect(a.conflictPoint).not.toBe(b.conflictPoint);
    expect(a.marriageTendency).not.toBe(b.marriageTendency);
  });
});

describe("interpretSaju에서 loveDeepDive는 연애운/종합사주에서만 채워진다", () => {
  const SAMPLE_INPUT = {
    year: 1993,
    month: 5,
    day: 30,
    hour: 12,
    minute: 0,
    gender: "female" as const,
    calendarType: "solar" as const,
    isLeapMonth: false,
  };

  it("연애운에서만 loveDeepDive가 채워진다 (종합사주는 개별 카테고리 심화 콘텐츠를 복제하지 않는다)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    expect(interpretSaju(saju, "love").loveDeepDive).not.toBeNull();
    expect(interpretSaju(saju, "overall").loveDeepDive).toBeNull();
    expect(interpretSaju(saju, "reunion").loveDeepDive).toBeNull();
    expect(interpretSaju(saju, "career").loveDeepDive).toBeNull();
    expect(interpretSaju(saju, "wealth").loveDeepDive).toBeNull();
  });
});

describe("신강/신약에 따른 연애 심화와 업무 스타일", () => {
  it("각 필드는 10개 조합에서 모두 다른 문구를 갖는다", () => {
    const love = ALL_PATTERNS.map(({ group, strength }) => getLoveDeepDive(group, strength));
    const work = ALL_PATTERNS.map(({ group, strength }) => getWorkStyle(group, strength));
    for (const key of ["idealType", "attractsYou", "conflictPoint", "marriageTendency"] as const) {
      expect(new Set(love.map((entry) => entry[key])).size).toBe(10);
      for (const entry of love) expect(entry[key].split(". ")).toHaveLength(3);
    }
    for (const key of ["style", "goodEnv", "badEnv"] as const) {
      expect(new Set(work.map((entry) => entry[key])).size).toBe(10);
      for (const entry of work) expect(entry[key]).toMatch(/요\.$/);
    }
  });

  it("실제 사주의 강약이 연애운과 직업운 결과에 전달된다", () => {
    const seen = new Set<Strength>();
    for (let month = 1; month <= 12; month++) {
      const saju = computeSaju({
        year: 1993, month, day: 15, hour: 12, minute: 0,
        gender: "female", calendarType: "solar", isLeapMonth: false,
      });
      const group = extractDominantTenGodGroup(saju);
      const { strength } = computeStrengthScore(saju);
      seen.add(strength);
      expect(interpretSaju(saju, "love").loveDeepDive).toEqual(getLoveDeepDive(group, strength));
      expect(interpretSaju(saju, "career").workStyle).toEqual(getWorkStyle(group, strength));
    }
    expect([...seen].sort()).toEqual(["gang", "yak"]);
  });
});