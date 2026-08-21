import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";

/**
 * 계산 규칙서 63번: 입춘 직전/직후 경계값 테스트.
 * KASI 실측: 2024년 입춘 = 2024-02-04 17:27 KST.
 */
describe("입춘 경계 (년주)", () => {
  it("입춘 1분 전(17:26) → 이전 연도(癸卯) 년주", () => {
    const result = computeSaju({
      year: 2024,
      month: 2,
      day: 4,
      hour: 17,
      minute: 26,
      gender: "male",
      calendarType: "solar",
      isLeapMonth: false,
    });
    expect(result.pillars.yearPillar.hanja).toBe("癸卯");
  });

  it("입춘 1분 후(17:28) → 새 연도(甲辰) 년주", () => {
    const result = computeSaju({
      year: 2024,
      month: 2,
      day: 4,
      hour: 17,
      minute: 28,
      gender: "male",
      calendarType: "solar",
      isLeapMonth: false,
    });
    expect(result.pillars.yearPillar.hanja).toBe("甲辰");
  });
});

describe("자시 경계 (일주는 자정 기준, 시지는 23시 기준 — v2.1 22번)", () => {
  const base = {
    year: 2024,
    month: 3,
    day: 10,
    gender: "male" as const,
    calendarType: "solar" as const,
    isLeapMonth: false,
  };

  it("22:59 → 시지 亥, 일주는 당일 날짜", () => {
    const r = computeSaju({ ...base, hour: 22, minute: 59 });
    expect(r.pillars.hourPillar?.branch).toBe("hai");
  });

  it("23:00 → 시지 子로 전환, 일주는 여전히 당일 날짜(다음날로 넘기지 않음)", () => {
    const dayOnly = computeSaju({ ...base, hour: 12, minute: 0 });
    const atZi = computeSaju({ ...base, hour: 23, minute: 0 });
    expect(atZi.pillars.hourPillar?.branch).toBe("zi");
    expect(atZi.pillars.dayPillar.hanja).toBe(dayOnly.pillars.dayPillar.hanja);
  });

  it("23:59 → 여전히 당일 날짜의 일주", () => {
    const dayOnly = computeSaju({ ...base, hour: 12, minute: 0 });
    const late = computeSaju({ ...base, hour: 23, minute: 59 });
    expect(late.pillars.dayPillar.hanja).toBe(dayOnly.pillars.dayPillar.hanja);
  });

  it("00:00 → 다음 날짜의 일주 + 시지 子", () => {
    const next = computeSaju({ ...base, day: 11, hour: 0, minute: 0 });
    const late = computeSaju({ ...base, hour: 23, minute: 59 });
    expect(next.pillars.hourPillar?.branch).toBe("zi");
    // 3/10 23:59와 3/11 00:00은 서로 다른 날짜의 일주여야 한다(같은 子時지만 날짜 경계는 자정).
    expect(next.pillars.dayPillar.hanja).not.toBe(late.pillars.dayPillar.hanja);
  });

  it("00:59 → 여전히 시지 子", () => {
    const r = computeSaju({ ...base, hour: 0, minute: 59 });
    expect(r.pillars.hourPillar?.branch).toBe("zi");
  });

  it("01:00 → 시지 丑로 전환", () => {
    const r = computeSaju({ ...base, hour: 1, minute: 0 });
    expect(r.pillars.hourPillar?.branch).toBe("chou");
  });
});

describe("시간 미상", () => {
  it("hour=null이면 hourPillar는 null이고 나머지 필드는 계산된다", () => {
    const r = computeSaju({
      year: 2024,
      month: 5,
      day: 20,
      hour: null,
      minute: 0,
      gender: "female",
      calendarType: "solar",
      isLeapMonth: false,
    });
    expect(r.pillars.hourPillar).toBeNull();
    expect(r.pillars.dayPillar.hanja).toBeTruthy();
    expect(r.pillars.yearPillar.hanja).toBeTruthy();
  });
});

describe("회귀 테스트: 연도 경계와 무관한 날짜에서 인접 연도 데이터 누락으로 오류가 나면 안 된다", () => {
  it("2000-06-15(시간 미상)는 1999/2001년 절기 데이터가 없어도 정상 계산된다", () => {
    const r = computeSaju({
      year: 2000,
      month: 6,
      day: 15,
      hour: null,
      minute: 0,
      gender: "female",
      calendarType: "solar",
      isLeapMonth: false,
    });
    expect(r.pillars.yearPillar.hanja).toBe("庚辰");
    expect(r.pillars.hourPillar).toBeNull();
  });
});

describe("결정론적 재현성 (규칙서 74번 16항)", () => {
  it("동일 입력 → 동일 결과", () => {
    const input = {
      year: 2010,
      month: 11,
      day: 3,
      hour: 9,
      minute: 15,
      gender: "male" as const,
      calendarType: "solar" as const,
      isLeapMonth: false,
    };
    const a = computeSaju(input);
    const b = computeSaju(input);
    expect(JSON.stringify(a.pillars)).toBe(JSON.stringify(b.pillars));
  });
});
