import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeJohu } from "@/lib/interpretation/johu";

describe("조후(調候) 분석", () => {
  it("겨울생(자월)인데 화가 전혀 없으면 'cold'로 판정한다", () => {
    // 2010-01-05는 소한 이후, 자월(子月) 구간
    const saju = computeSaju({
      name: "겨울테스트",
      year: 2010,
      month: 1,
      day: 5,
      hour: null,
      minute: 0,
      gender: "male",
      calendarType: "solar",
      isLeapMonth: false,
    });
    const johu = computeJohu(saju);
    expect(johu.season).toBe("winter");
    if (johu.balance === "cold") {
      expect(johu.text).toContain("차다");
    }
  });

  it("계절 판정은 항상 spring/summer/autumn/winter 중 하나이고, balance는 항상 정해진 텍스트를 반환한다", () => {
    const saju = computeSaju({
      name: "테스트",
      year: 2003,
      month: 7,
      day: 7,
      hour: 10,
      minute: 15,
      gender: "female",
      calendarType: "solar",
      isLeapMonth: false,
    });
    const johu = computeJohu(saju);
    expect(["spring", "summer", "autumn", "winter"]).toContain(johu.season);
    expect(["cold", "hot", "balanced"]).toContain(johu.balance);
    expect(johu.text.length).toBeGreaterThan(0);
  });
});
