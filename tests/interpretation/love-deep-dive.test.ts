import { describe, expect, it } from "vitest";
import { getLoveDeepDive } from "@/lib/interpretation/love-deep-dive";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { PatternGroup } from "@/lib/interpretation/feature-extract";

const ALL_GROUPS: PatternGroup[] = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];

describe("연애운 심화 (data/love-deep-dive.json)", () => {
  it.each(ALL_GROUPS)("%s는 네 항목(이상형/나를 좋아하는 사람/갈등포인트/결혼운)이 모두 채워져 있다", (group) => {
    const d = getLoveDeepDive(group);
    expect(d.idealType.length).toBeGreaterThan(0);
    expect(d.attractsYou.length).toBeGreaterThan(0);
    expect(d.conflictPoint.length).toBeGreaterThan(0);
    expect(d.marriageTendency.length).toBeGreaterThan(0);
  });

  it("그룹마다 서로 다른 문구를 반환한다(재탕 아님)", () => {
    const a = getLoveDeepDive("bigeob");
    const b = getLoveDeepDive("inseong");
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
