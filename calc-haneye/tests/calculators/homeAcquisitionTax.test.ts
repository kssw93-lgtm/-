import { describe, expect, it } from "vitest";
import {
  calculateHomeAcquisitionTax,
  type HomeAcquisitionTaxInput,
} from "@/lib/calculators/homeAcquisitionTax";

const baseInput: HomeAcquisitionTaxInput = {
  priceWon: 500_000_000,
  acquisitionType: "paidIndividual",
  homeCount: "one",
  reductionStatus: "notApplied",
  jointOwnership: false,
  propertyType: "house",
};

describe("calculateHomeAcquisitionTax", () => {
  it("1주택 6억 원 이하: 1% 세율이 적용된다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      priceWon: 500_000_000,
    });
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result.applicableRate).toBeCloseTo(0.01, 10);
    expect(result.estimatedBasicAcquisitionTax).toBe(5_000_000);
  });

  it("정확히 6억 원: 1% 세율이 적용된다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      priceWon: 600_000_000,
    });
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result.applicableRate).toBeCloseTo(0.01, 10);
    expect(result.estimatedBasicAcquisitionTax).toBe(6_000_000);
  });

  it("7억 5천만 원: 2% 세율, 1,500만 원 예상 기본 취득세", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      priceWon: 750_000_000,
    });
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result.applicableRate).toBeCloseTo(0.02, 10);
    expect(result.estimatedBasicAcquisitionTax).toBe(15_000_000);
  });

  it("정확히 9억 원: 중간 구간 공식이 적용되어 3%가 산출된다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      priceWon: 900_000_000,
    });
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result.applicableRate).toBeCloseTo(0.03, 10);
    expect(result.estimatedBasicAcquisitionTax).toBe(27_000_000);
  });

  it("9억 원 초과: 3% 세율이 적용된다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      priceWon: 1_000_000_000,
    });
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result.applicableRate).toBeCloseTo(0.03, 10);
    expect(result.estimatedBasicAcquisitionTax).toBe(30_000_000);
  });

  it("2주택: 지원 범위 밖 상태를 반환한다", () => {
    const result = calculateHomeAcquisitionTax({ ...baseInput, homeCount: "two" });
    expect(result.status).toBe("outOfScope");
  });

  it("법인 취득: 지원 범위 밖 상태를 반환한다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      acquisitionType: "corporate",
    });
    expect(result.status).toBe("outOfScope");
  });

  it("감면 가능성 있음: 추가 확인 필요 상태를 반환한다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      reductionStatus: "possibleFirstTime",
    });
    expect(result.status).toBe("needsReview");
  });

  it("공동취득: 지원 범위 밖 상태를 반환한다", () => {
    const result = calculateHomeAcquisitionTax({
      ...baseInput,
      jointOwnership: true,
    });
    expect(result.status).toBe("outOfScope");
  });

  it("취득가액이 0이면 오류를 던진다", () => {
    expect(() =>
      calculateHomeAcquisitionTax({ ...baseInput, priceWon: 0 })
    ).toThrow();
  });

  it("취득가액이 음수이면 오류를 던진다", () => {
    expect(() =>
      calculateHomeAcquisitionTax({ ...baseInput, priceWon: -1 })
    ).toThrow();
  });

  it("계산 결과는 '예상 총 세금'이 아니라 '예상 기본 취득세'로 모델링된다", () => {
    const result = calculateHomeAcquisitionTax(baseInput);
    expect(result.status).toBe("calculated");
    if (result.status !== "calculated") throw new Error("unreachable");
    expect(result).toHaveProperty("estimatedBasicAcquisitionTax");
    expect(result).not.toHaveProperty("totalTax");
    expect(result).not.toHaveProperty("estimatedTotalTax");
  });
});
