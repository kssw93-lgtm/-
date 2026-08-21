import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { applyToneStyle, buildBirthKey, interpretSaju } from "@/lib/interpretation";

const SAMPLE_INPUT = {
  year: 2003,
  month: 7,
  day: 7,
  hour: 10,
  minute: 15,
  gender: "female" as const,
  calendarType: "solar" as const,
  isLeapMonth: false,
};

describe("톤/스타일 레이어", () => {
  const saju = computeSaju({ name: "테스트", ...SAMPLE_INPUT });
  const birthKey = buildBirthKey({
    year: saju.input.year,
    month: saju.input.month,
    day: saju.input.day,
    hour: saju.input.hour,
    minute: saju.input.minute,
    calendarType: saju.input.calendarType,
  });

  it("standard 스타일은 원본 해석을 그대로 반환한다", () => {
    const base = interpretSaju(saju, "overall");
    const styled = applyToneStyle(base, "standard", birthKey, "overall");
    expect(styled).toEqual(base);
  });

  it("mz/조선 스타일은 헤딩과 본문을 바꾸되 핵심 명리 문장은 유지한다", () => {
    const base = interpretSaju(saju, "overall");
    const mz = applyToneStyle(base, "mz", birthKey, "overall");
    const joseon = applyToneStyle(base, "joseon", birthKey, "overall");

    expect(mz.sections[0].heading).not.toBe(base.sections[0].heading);
    expect(joseon.sections[0].heading).not.toBe(base.sections[0].heading);
    expect(mz.sections[0].heading).not.toBe(joseon.sections[0].heading);

    // 핵심 해석 문장(원본 텍스트)은 그대로 포함되어 있어야 한다 — 계산/해석 내용은 안 바뀜
    for (let i = 0; i < base.sections.length; i++) {
      expect(mz.sections[i].text).toContain(base.sections[i].text);
      expect(joseon.sections[i].text).toContain(base.sections[i].text);
    }
  });

  it("같은 사람 + 같은 카테고리 + 같은 스타일이면 항상 같은 결과가 나온다(결정론적)", () => {
    const base = interpretSaju(saju, "overall");
    const a = applyToneStyle(base, "mz", birthKey, "overall");
    const b = applyToneStyle(base, "mz", birthKey, "overall");
    expect(a).toEqual(b);
  });
});
