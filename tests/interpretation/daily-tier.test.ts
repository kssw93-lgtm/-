import { describe, expect, it } from "vitest";
import { getDailyTierText } from "@/lib/interpretation/daily-tier";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { TenGod } from "@/lib/calc/types";
import type { Category } from "@/lib/interpretation/template-select";

const ALL_TEN_GODS: TenGod[] = [
  "bigyeon",
  "geopjae",
  "siksin",
  "sanggwan",
  "jeongjae",
  "pyeonjae",
  "jeonggwan",
  "pyeongwan",
  "jeongin",
  "pyeonin",
];
const DAILY_CATEGORIES: Category[] = ["love", "reunion", "career", "wealth"];

describe("오늘의 OO운 (data/daily-tier.json)", () => {
  it.each(DAILY_CATEGORIES)("%s 카테고리는 모든 십신에 대해 문구가 채워져 있다", (category) => {
    for (const tenGod of ALL_TEN_GODS) {
      const text = getDailyTierText(category, tenGod);
      expect(text).not.toBeNull();
      expect(text!.length).toBeGreaterThan(0);
    }
  });

  it("종합사주는 별도의 오늘의 OO운 문구가 없다 (상단 오늘의 운세 카드와 중복 방지)", () => {
    expect(getDailyTierText("overall", "bigyeon")).toBeNull();
  });

  it("같은 카테고리 안에서도 십신마다 서로 다른 문구를 반환한다(재탕 아님)", () => {
    const a = getDailyTierText("love", "bigyeon");
    const b = getDailyTierText("love", "jeongin");
    expect(a).not.toBe(b);
  });
});

describe("interpretSaju에서 오늘의 OO운은 love/reunion/career/wealth에서만 채워진다", () => {
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

  it.each(DAILY_CATEGORIES)("%s 결과에는 '오늘의' 섹션이 포함된다", (category) => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, category);
    expect(result.sections.some((s) => s.heading.startsWith("오늘의"))).toBe(true);
  });

  it("종합사주 결과에는 '오늘의' 섹션이 없다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "overall");
    expect(result.sections.some((s) => s.heading.startsWith("오늘의"))).toBe(false);
  });
});
