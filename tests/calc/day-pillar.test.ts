import { describe, expect, it } from "vitest";
import { computeDayPillar } from "@/lib/calc/day-pillar";

/**
 * 계산 규칙서 v2.1 19번의 교차검증점 + KASI 실제 음양력 API에서 확보한
 * 일진(day_pillar) 검증 데이터(data/day-pillars/sample.json)와 대조한다.
 */
describe("computeDayPillar", () => {
  it("REFERENCE_DATE 자체는 甲子", () => {
    const p = computeDayPillar({ year: 2024, month: 1, day: 1 });
    expect(p.hanja).toBe("甲子");
  });

  it("규칙서 19번 교차검증점: 2026-07-02 = 丁丑(index 13)", () => {
    const p = computeDayPillar({ year: 2026, month: 7, day: 2 });
    expect(p.hanja).toBe("丁丑");
  });

  it("KASI 실측: 2026-02-17 = 壬戌", () => {
    const p = computeDayPillar({ year: 2026, month: 2, day: 17 });
    expect(p.hanja).toBe("壬戌");
  });

  it("KASI 실측: 2026-02-04(입춘 당일) = 己酉", () => {
    const p = computeDayPillar({ year: 2026, month: 2, day: 4 });
    expect(p.hanja).toBe("己酉");
  });

  it("KASI 실측: 1961-08-10(표준시 변경 경계일) = 乙亥", () => {
    const p = computeDayPillar({ year: 1961, month: 8, day: 10 });
    expect(p.hanja).toBe("乙亥");
  });
});
