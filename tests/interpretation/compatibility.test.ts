import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeCompatibility } from "@/lib/interpretation/compatibility";

describe("궁합 계산", () => {
  it("두 사람의 사주를 각각 독립적으로 계산해 비교한다(계산 규칙서 60번)", () => {
    const a = computeSaju({
      year: 2000, month: 6, day: 15, hour: 10, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const b = computeSaju({
      year: 2001, month: 3, day: 3, hour: 14, minute: 30,
      gender: "male", calendarType: "solar", isLeapMonth: false,
    });
    const result = computeCompatibility(a, b);
    expect(result.text.length).toBeGreaterThan(0);
    expect(["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"]).toContain(result.groupAtoB);
    expect(["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"]).toContain(result.groupBtoA);
  });

  it("동일 두 사람은 항상 동일한 궁합 결과가 나온다(결정론적)", () => {
    const a = computeSaju({
      year: 2003, month: 9, day: 9, hour: null, minute: 0,
      gender: "male", calendarType: "solar", isLeapMonth: false,
    });
    const b = computeSaju({
      year: 2004, month: 11, day: 20, hour: null, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const r1 = computeCompatibility(a, b);
    const r2 = computeCompatibility(a, b);
    expect(r1.groupAtoB).toBe(r2.groupAtoB);
    expect(r1.text).toBe(r2.text);
  });
});
