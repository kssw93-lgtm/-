import { describe, expect, it } from "vitest";
import { getLifeStageFraming } from "@/lib/interpretation/life-stage-framing";

describe("getLifeStageFraming — 대운 나이대별 생애주기 프레이밍", () => {
  it("10대는 학업/자립 관련 문구를 반환한다", () => {
    expect(getLifeStageFraming(7)).toContain("학업");
    expect(getLifeStageFraming(19)).toContain("학업");
  });

  it("20~30대는 취업/진로/연애 관련 문구를 반환한다", () => {
    expect(getLifeStageFraming(20)).toContain("진로");
    expect(getLifeStageFraming(39)).toContain("진로");
  });

  it("40~50대는 직장 책임/자산 관련 문구를 반환한다", () => {
    expect(getLifeStageFraming(40)).toContain("승진");
    expect(getLifeStageFraming(59)).toContain("승진");
  });

  it("60대 이상은 건강/여가 관련 문구를 반환한다", () => {
    expect(getLifeStageFraming(60)).toContain("건강");
    expect(getLifeStageFraming(97)).toContain("건강");
  });
});
