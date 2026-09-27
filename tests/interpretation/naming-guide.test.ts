import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeNamingGuide } from "@/lib/interpretation/naming-guide";

describe("computeNamingGuide", () => {
  it("금(金)이 0개인 원국에서 금을 보완 오행으로 추천한다", () => {
    // 년주 乙亥·월주 壬午·일주 丁丑·시주 丙午 — 금은 0개(five-elements-balance.test.ts와 동일 케이스)
    const saju = computeSaju({
      year: 1995, month: 6, day: 15, hour: 12, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const guide = computeNamingGuide(saju, "female");

    expect(guide.counts.metal).toBe(0);
    const metalRec = guide.recommendations.find((r) => r.element === "metal");
    expect(metalRec).toBeDefined();
    expect(metalRec!.chosung).toEqual(["ㅅ", "ㅈ", "ㅊ"]);
    expect(metalRec!.exampleNames.length).toBeGreaterThan(0);
  });

  it("성별에 맞는 예시 이름 목록을 반환한다", () => {
    const saju = computeSaju({
      year: 1995, month: 6, day: 15, hour: 12, minute: 0,
      gender: "male", calendarType: "solar", isLeapMonth: false,
    });
    const guideMale = computeNamingGuide(saju, "male");
    const guideFemale = computeNamingGuide(saju, "female");
    expect(guideMale.recommendations[0].exampleNames).not.toEqual(guideFemale.recommendations[0].exampleNames);
  });

  it("추천 오행은 최대 2개까지만 반환한다", () => {
    const saju = computeSaju({
      year: 1995, month: 6, day: 15, hour: 12, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const guide = computeNamingGuide(saju, "female");
    expect(guide.recommendations.length).toBeLessThanOrEqual(2);
  });
});
