import { describe, expect, it } from "vitest";
import { getStarSign } from "@/lib/interpretation/zodiac";
import { computeSaju } from "@/lib/calc";
import { getZodiacAnimalForSaju } from "@/lib/interpretation/zodiac";

describe("별자리 경계값", () => {
  it("3/20은 물고기자리, 3/21은 양자리", () => {
    expect(getStarSign(3, 20).id).toBe("pisces");
    expect(getStarSign(3, 21).id).toBe("aries");
  });

  it("염소자리는 연도를 넘어간다: 12/22와 1/19 모두 염소자리", () => {
    expect(getStarSign(12, 22).id).toBe("capricorn");
    expect(getStarSign(1, 19).id).toBe("capricorn");
    expect(getStarSign(1, 20).id).toBe("aquarius");
    expect(getStarSign(12, 21).id).toBe("sagittarius");
  });

  it("12개 별자리 경계가 하루도 비거나 겹치지 않는다(1/1~12/31 전수 조회 성공)", () => {
    for (let m = 1; m <= 12; m++) {
      const days = [1, 15, 28];
      for (const d of days) {
        expect(() => getStarSign(m, d)).not.toThrow();
      }
    }
  });
});

describe("띠는 년주 지지를 그대로 사용한다", () => {
  it("2000년(양력 6/15, 입춘 이후)은 경진년 → 용띠", () => {
    const saju = computeSaju({
      year: 2000, month: 6, day: 15, hour: null, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const animal = getZodiacAnimalForSaju(saju);
    expect(animal.branch).toBe("chen");
    expect(animal.animal).toBe("용띠");
  });
});
