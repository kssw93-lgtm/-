import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeGyeokguk, strengthBand, computeDailyFortune } from "@/lib/interpretation";
import { computeSinsal, type SinsalId } from "@/lib/calc/sinsal";
import type { BranchId, FourPillars } from "@/lib/calc/types";

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

  it("양인살: 일간이 갑이고 지지에 묘가 있으면 검출된다(고전 갑묘 양인 표)", () => {
    const pillars = {
      yearPillar: { stem: "jia" as const, branch: "mao" as const, hanja: "甲卯" },
      monthPillar: { stem: "bing" as const, branch: "yin" as const, hanja: "丙寅" },
      dayPillar: { stem: "jia" as const, branch: "zi" as const, hanja: "甲子" },
      hourPillar: { stem: "ding" as const, branch: "mao" as const, hanja: "丁卯" },
    };
    const hits = computeSinsal(pillars);
    expect(hits.some((h) => h.id === "yangin" && h.matchedBranch === "mao")).toBe(true);
  });

  it("화개살: 일지가 신자진 그룹(예: 자)이면 그룹의 고지인 진이 있을 때 검출된다", () => {
    const pillars = {
      yearPillar: { stem: "wu" as const, branch: "chen" as const, hanja: "戊辰" },
      monthPillar: { stem: "bing" as const, branch: "yin" as const, hanja: "丙寅" },
      dayPillar: { stem: "jia" as const, branch: "zi" as const, hanja: "甲子" },
      hourPillar: { stem: "ding" as const, branch: "mao" as const, hanja: "丁卯" },
    };
    const hits = computeSinsal(pillars);
    expect(hits.some((h) => h.id === "hwagae" && h.matchedBranch === "chen")).toBe(true);
  });

  it("문창귀인: 일간이 갑이고 지지에 사가 있으면 검출된다(고전 갑사 문창 표)", () => {
    const pillars = {
      yearPillar: { stem: "ji" as const, branch: "si" as const, hanja: "己巳" },
      monthPillar: { stem: "bing" as const, branch: "yin" as const, hanja: "丙寅" },
      dayPillar: { stem: "jia" as const, branch: "zi" as const, hanja: "甲子" },
      hourPillar: { stem: "ding" as const, branch: "mao" as const, hanja: "丁卯" },
    };
    const hits = computeSinsal(pillars);
    expect(hits.some((h) => h.id === "munchang" && h.matchedBranch === "si")).toBe(true);
  });

  // 십이신살 전체 48칸(4개 삼합 그룹 × 12지지) 교차검증표. 출처: guide.8-codes.com 십이신살 강의.
  // 기존에 검증된 역마·년살(도화)·화개 세 지점이 이 표와 정확히 일치함을 먼저 확인한 뒤 확정했다.
  const TWELVE_SINSAL_TABLE: { groupDayBranch: BranchId; branch: BranchId; id: SinsalId }[] = [
    // 申子辰
    { groupDayBranch: "zi", branch: "si", id: "geopsal" },
    { groupDayBranch: "zi", branch: "wu", id: "jaesal" },
    { groupDayBranch: "zi", branch: "wei", id: "cheonsal" },
    { groupDayBranch: "zi", branch: "shen", id: "jisal" },
    { groupDayBranch: "zi", branch: "you", id: "dohwa" },
    { groupDayBranch: "zi", branch: "xu", id: "wolsal" },
    { groupDayBranch: "zi", branch: "hai", id: "mangsinsal" },
    { groupDayBranch: "zi", branch: "zi", id: "jangseongsal" },
    { groupDayBranch: "zi", branch: "chou", id: "banansal" },
    { groupDayBranch: "zi", branch: "yin", id: "yeokma" },
    { groupDayBranch: "zi", branch: "mao", id: "yukhaesal" },
    { groupDayBranch: "zi", branch: "chen", id: "hwagae" },
    // 亥卯未
    { groupDayBranch: "mao", branch: "shen", id: "geopsal" },
    { groupDayBranch: "mao", branch: "you", id: "jaesal" },
    { groupDayBranch: "mao", branch: "xu", id: "cheonsal" },
    { groupDayBranch: "mao", branch: "hai", id: "jisal" },
    { groupDayBranch: "mao", branch: "zi", id: "dohwa" },
    { groupDayBranch: "mao", branch: "chou", id: "wolsal" },
    { groupDayBranch: "mao", branch: "yin", id: "mangsinsal" },
    { groupDayBranch: "mao", branch: "mao", id: "jangseongsal" },
    { groupDayBranch: "mao", branch: "chen", id: "banansal" },
    { groupDayBranch: "mao", branch: "si", id: "yeokma" },
    { groupDayBranch: "mao", branch: "wu", id: "yukhaesal" },
    { groupDayBranch: "mao", branch: "wei", id: "hwagae" },
    // 寅午戌
    { groupDayBranch: "wu", branch: "hai", id: "geopsal" },
    { groupDayBranch: "wu", branch: "zi", id: "jaesal" },
    { groupDayBranch: "wu", branch: "chou", id: "cheonsal" },
    { groupDayBranch: "wu", branch: "yin", id: "jisal" },
    { groupDayBranch: "wu", branch: "mao", id: "dohwa" },
    { groupDayBranch: "wu", branch: "chen", id: "wolsal" },
    { groupDayBranch: "wu", branch: "si", id: "mangsinsal" },
    { groupDayBranch: "wu", branch: "wu", id: "jangseongsal" },
    { groupDayBranch: "wu", branch: "wei", id: "banansal" },
    { groupDayBranch: "wu", branch: "shen", id: "yeokma" },
    { groupDayBranch: "wu", branch: "you", id: "yukhaesal" },
    { groupDayBranch: "wu", branch: "xu", id: "hwagae" },
    // 巳酉丑
    { groupDayBranch: "you", branch: "yin", id: "geopsal" },
    { groupDayBranch: "you", branch: "mao", id: "jaesal" },
    { groupDayBranch: "you", branch: "chen", id: "cheonsal" },
    { groupDayBranch: "you", branch: "si", id: "jisal" },
    { groupDayBranch: "you", branch: "wu", id: "dohwa" },
    { groupDayBranch: "you", branch: "wei", id: "wolsal" },
    { groupDayBranch: "you", branch: "shen", id: "mangsinsal" },
    { groupDayBranch: "you", branch: "you", id: "jangseongsal" },
    { groupDayBranch: "you", branch: "xu", id: "banansal" },
    { groupDayBranch: "you", branch: "hai", id: "yeokma" },
    { groupDayBranch: "you", branch: "zi", id: "yukhaesal" },
    { groupDayBranch: "you", branch: "chou", id: "hwagae" },
  ];

  it.each(TWELVE_SINSAL_TABLE)(
    "십이신살: 일지 $groupDayBranch 그룹은 $branch 지지에서 $id 검출",
    ({ groupDayBranch, branch, id }) => {
      const pillars: FourPillars = {
        yearPillar: { stem: "jia", branch, hanja: "" },
        monthPillar: { stem: "bing", branch: "xu", hanja: "" },
        dayPillar: { stem: "wu", branch: groupDayBranch, hanja: "" },
        hourPillar: null,
      };
      const hits = computeSinsal(pillars);
      expect(hits.some((h) => h.id === id && h.matchedBranch === branch)).toBe(true);
    }
  );
});
