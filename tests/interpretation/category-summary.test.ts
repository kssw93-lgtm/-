import { describe, expect, it } from "vitest";
import { getCategorySummary } from "@/lib/interpretation/category-summary";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { PatternGroup } from "@/lib/interpretation/feature-extract";
import type { Category } from "@/lib/interpretation/template-select";

const ALL_GROUPS: PatternGroup[] = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];
const ALL_CATEGORIES: Category[] = ["love", "reunion", "career", "wealth", "overall"];

describe("총평 (data/category-summary.json)", () => {
  it.each(ALL_CATEGORIES)("%s 카테고리는 모든 그룹에 대해 총평 문구가 채워져 있다", (category) => {
    for (const group of ALL_GROUPS) {
      const text = getCategorySummary(category, group);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it("같은 카테고리 안에서도 그룹마다 서로 다른 문구를 반환한다(재탕 아님)", () => {
    const a = getCategorySummary("love", "bigeob");
    const b = getCategorySummary("love", "inseong");
    expect(a).not.toBe(b);
  });
});

describe("interpretSaju에서 categorySummary는 모든 카테고리에서 항상 채워진다", () => {
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

  it.each(ALL_CATEGORIES)("%s 결과에는 categorySummary가 채워져 있고 resultText 맨 끝에도 포함된다", (category) => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, category);
    expect(result.categorySummary.length).toBeGreaterThan(0);
    expect(result.resultText.endsWith(result.categorySummary)).toBe(true);
  });
});
