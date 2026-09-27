import { describe, expect, it } from "vitest";
import { isSonEomneunNal, getSonEomneunNalOfMonth } from "@/lib/calc/son-eomneun-nal";

describe("isSonEomneunNal", () => {
  it("2027년 1월 6일(음력 12/29)은 손없는날이다", () => {
    expect(isSonEomneunNal({ year: 2027, month: 1, day: 6 })).toBe(true);
  });
  it("2027년 1월 16일(음력 12/9)은 손없는날이다", () => {
    expect(isSonEomneunNal({ year: 2027, month: 1, day: 16 })).toBe(true);
  });
  it("2027년 1월 1일(음력 11/24)은 손없는날이 아니다", () => {
    expect(isSonEomneunNal({ year: 2027, month: 1, day: 1 })).toBe(false);
  });
  it("지원 범위(1950~2028) 밖의 날짜는 null을 반환한다", () => {
    expect(isSonEomneunNal({ year: 2030, month: 1, day: 1 })).toBeNull();
    expect(isSonEomneunNal({ year: 1949, month: 1, day: 1 })).toBeNull();
  });
});

describe("getSonEomneunNalOfMonth", () => {
  it("2027년 1월의 손없는날 6일을 정확히 찾는다", () => {
    const entries = getSonEomneunNalOfMonth(2027, 1);
    expect(entries.map((e) => e.solarDate)).toEqual([
      "2027-01-06", "2027-01-07", "2027-01-16", "2027-01-17", "2027-01-26", "2027-01-27",
    ]);
  });
  it("지원 범위 밖의 연도는 빈 배열을 반환한다", () => {
    expect(getSonEomneunNalOfMonth(2030, 1)).toEqual([]);
  });
  it("모든 항목의 음력 일자는 9·10·19·20·29·30 중 하나다", () => {
    const entries = getSonEomneunNalOfMonth(2027, 6);
    for (const e of entries) {
      expect([9, 10, 19, 20, 29, 30]).toContain(e.lunarDay);
    }
  });
});
