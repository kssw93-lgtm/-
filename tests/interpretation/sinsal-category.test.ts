import { describe, expect, it } from "vitest";
import { getSinsalDescForCategory } from "@/lib/interpretation/sinsal-category";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { SinsalId } from "@/lib/calc/sinsal";
import sinsalJson from "@/data/sinsal.json";
import sinsalCategoryJson from "@/data/sinsal-category.json";

const ALL_SINSAL_IDS = Object.keys(sinsalJson) as SinsalId[];

describe("신살 카테고리별 문구 (data/sinsal-category.json)", () => {
  it("17개 신살 전부 relationship/career/wealth 세 문구가 채워져 있다", () => {
    for (const id of ALL_SINSAL_IDS) {
      const entry = (sinsalCategoryJson as Record<string, Record<string, string>>)[id];
      expect(entry, `${id}에 카테고리별 문구가 없음`).toBeDefined();
      expect(entry.relationship.length).toBeGreaterThan(0);
      expect(entry.career.length).toBeGreaterThan(0);
      expect(entry.wealth.length).toBeGreaterThan(0);
    }
  });

  it.each(ALL_SINSAL_IDS)("%s는 love/reunion/career/wealth 카테고리마다 base와 다른 문구를 반환한다", (id) => {
    const base = (sinsalJson as Record<string, { desc: string }>)[id].desc;
    const love = getSinsalDescForCategory(id, "love", base);
    const reunion = getSinsalDescForCategory(id, "reunion", base);
    const career = getSinsalDescForCategory(id, "career", base);
    const wealth = getSinsalDescForCategory(id, "wealth", base);
    expect(love).not.toBe(base);
    expect(career).not.toBe(base);
    expect(wealth).not.toBe(base);
    expect(love).toBe(reunion); // 연애운/재회운은 같은 relationship 문구를 공유
    expect(career).not.toBe(wealth);
  });

  it("종합사주(overall)는 기존 범용 설명을 그대로 쓴다(fallback)", () => {
    const base = (sinsalJson as Record<string, { desc: string }>).cheoneulgwiin.desc;
    expect(getSinsalDescForCategory("cheoneulgwiin", "overall", base)).toBe(base);
  });
});

describe("interpretSaju에서 신살 desc가 카테고리별로 실제로 달라진다", () => {
  const SAMPLE_INPUT = {
    year: 1990,
    month: 3,
    day: 15,
    hour: 10,
    minute: 0,
    gender: "male" as const,
    calendarType: "solar" as const,
    isLeapMonth: false,
  };

  it("같은 사람이라도 연애운/직업운/재물운/종합사주에서 같은 신살의 desc가 다르다(신살이 있을 때만)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const love = interpretSaju(saju, "love");
    const career = interpretSaju(saju, "career");
    const wealth = interpretSaju(saju, "wealth");
    const overall = interpretSaju(saju, "overall");

    // 종합사주에는 있는데 연애/직업/재물에 없는 신살은 없어야 한다(같은 계산 로직 재사용 확인)
    const overallNames = overall.sinsal.map((s) => s.name);
    for (const s of love.sinsal) expect(overallNames).toContain(s.name);

    for (const s of overall.sinsal) {
      const loveHit = love.sinsal.find((x) => x.name === s.name);
      const careerHit = career.sinsal.find((x) => x.name === s.name);
      const wealthHit = wealth.sinsal.find((x) => x.name === s.name);
      if (loveHit) expect(loveHit.desc).not.toBe(s.desc);
      if (careerHit) expect(careerHit.desc).not.toBe(s.desc);
      if (wealthHit) expect(wealthHit.desc).not.toBe(s.desc);
      if (careerHit && wealthHit) expect(careerHit.desc).not.toBe(wealthHit.desc);
    }
  });
});
