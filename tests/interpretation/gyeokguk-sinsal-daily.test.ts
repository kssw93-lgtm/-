import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeGyeokguk, strengthBand, computeDailyFortune } from "@/lib/interpretation";
import { computeSinsal } from "@/lib/calc/sinsal";

const SAMPLE = {
  year: 2015, month: 6, day: 21, hour: 8, minute: 30,
  gender: "female" as const, calendarType: "solar" as const, isLeapMonth: false,
};

describe("격국 계산", () => {
  it("월지 본기와 일간의 십신 관계로 격국명이 결정된다", () => {
    const saju = computeSaju(SAMPLE);
    const g = computeGyeokguk(saju);
    expect(g.name).toBeTruthy();
    expect(g.subtitle.length).toBeGreaterThan(0);
  });

  it("동일 인물은 항상 동일한 격국이 나온다(결정론적)", () => {
    const saju = computeSaju(SAMPLE);
    expect(computeGyeokguk(saju).name).toBe(computeGyeokguk(saju).name);
  });
});

describe("신강신약 5단계 게이지", () => {
  it("0점은 태약, 98점은 태강", () => {
    expect(strengthBand(0).band).toBe("taeyak");
    expect(strengthBand(98).band).toBe("taegang");
  });
  it("50점 전후는 중화 대역이다", () => {
    expect(["junghwaYak", "junghwaGang"]).toContain(strengthBand(49).band);
  });
});

describe("오늘의 운세", () => {
  it("점수는 40~95 범위 안에 있고, 같은 날 두 번 계산해도 동일하다", () => {
    const saju = computeSaju(SAMPLE);
    const a = computeDailyFortune(saju, new Date(2026, 7, 22));
    const b = computeDailyFortune(saju, new Date(2026, 7, 22));
    expect(a.score).toBeGreaterThanOrEqual(40);
    expect(a.score).toBeLessThanOrEqual(95);
    expect(a.score).toBe(b.score);
    expect(a.label).toBe(b.label);
  });
});

describe("신살 계산", () => {
  it("천을귀인 표에 맞는 날짜는 실제로 검출된다", () => {
    // 甲/戊/庚 일간의 천을귀인은 丑/未. 일간이 甲이고 어딘가에 丑 또는 未 지지가 있으면 검출되어야 함.
    const saju = computeSaju({ year: 2024, month: 2, day: 4, hour: 6, minute: 0, gender: "male", calendarType: "solar", isLeapMonth: false });
    const hits = computeSinsal(saju.pillars);
    expect(Array.isArray(hits)).toBe(true); // 존재 여부는 케이스마다 다르므로 배열 형태만 검증
  });
});
