import { describe, expect, it } from "vitest";
import { calculateLoanInterest } from "@/lib/calculators/loanInterest";

describe("calculateLoanInterest", () => {
  it("원리금균등상환 정상 케이스: 매월 납입액이 동일하고 총 이자가 0보다 크다", () => {
    const result = calculateLoanInterest({
      principal: 100_000_000,
      annualRatePercent: 4,
      termMonths: 12,
      repaymentMethod: "equalPayment",
    });

    expect(result.schedule).toHaveLength(12);
    const firstPayment = result.schedule[0]?.payment ?? 0;
    for (const row of result.schedule.slice(0, -1)) {
      expect(row.payment).toBe(firstPayment);
    }
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPayment).toBe(result.totalInterest + result.totalPrincipal);
  });

  it("원금균등상환 정상 케이스: 매월 원금 상환액이 동일하고 이자가 점차 감소한다", () => {
    const result = calculateLoanInterest({
      principal: 120_000_000,
      annualRatePercent: 5,
      termMonths: 12,
      repaymentMethod: "equalPrincipal",
    });

    expect(result.schedule).toHaveLength(12);
    const firstPrincipal = result.schedule[0]?.principal ?? 0;
    for (const row of result.schedule.slice(0, -1)) {
      expect(row.principal).toBe(firstPrincipal);
    }
    const interests = result.schedule.map((row) => row.interest);
    for (let i = 1; i < interests.length; i += 1) {
      expect(interests[i]).toBeLessThanOrEqual(interests[i - 1] ?? 0);
    }
  });

  it("만기일시상환 정상 케이스: 마지막 회차에만 원금이 상환된다", () => {
    const result = calculateLoanInterest({
      principal: 50_000_000,
      annualRatePercent: 3,
      termMonths: 6,
      repaymentMethod: "bulletPayment",
    });

    for (const row of result.schedule.slice(0, -1)) {
      expect(row.principal).toBe(0);
    }
    const lastRow = result.schedule[result.schedule.length - 1];
    expect(lastRow?.principal).toBe(50_000_000);
    expect(lastRow?.remainingPrincipal).toBe(0);
  });

  it("연 이자율 0%: 이자가 전혀 발생하지 않는다", () => {
    const result = calculateLoanInterest({
      principal: 12_000_000,
      annualRatePercent: 0,
      termMonths: 12,
      repaymentMethod: "equalPayment",
    });

    expect(result.totalInterest).toBe(0);
    expect(result.totalPayment).toBe(12_000_000);
    expect(result.schedule[0]?.payment).toBe(1_000_000);
  });

  it("1개월 기간: 단일 회차로 원금 전액이 상환된다", () => {
    const result = calculateLoanInterest({
      principal: 5_000_000,
      annualRatePercent: 6,
      termMonths: 1,
      repaymentMethod: "equalPrincipal",
    });

    expect(result.schedule).toHaveLength(1);
    expect(result.schedule[0]?.principal).toBe(5_000_000);
    expect(result.schedule[0]?.remainingPrincipal).toBe(0);
  });

  it.each([
    "equalPayment",
    "equalPrincipal",
    "bulletPayment",
  ] as const)(
    "%s: 총 원금 상환 합계가 대출 원금과 일치하고 마지막 잔여 원금이 0이다",
    (repaymentMethod) => {
      const principal = 87_654_321;
      const result = calculateLoanInterest({
        principal,
        annualRatePercent: 3.5,
        termMonths: 24,
        repaymentMethod,
      });

      expect(result.totalPrincipal).toBe(principal);
      const lastRow = result.schedule[result.schedule.length - 1];
      expect(lastRow?.remainingPrincipal).toBe(0);
    }
  );

  it("잘못된 입력(원금 0 이하)은 오류를 던진다", () => {
    expect(() =>
      calculateLoanInterest({
        principal: 0,
        annualRatePercent: 3,
        termMonths: 12,
        repaymentMethod: "equalPayment",
      })
    ).toThrow();
  });

  it("잘못된 입력(음수 금리)은 오류를 던진다", () => {
    expect(() =>
      calculateLoanInterest({
        principal: 1_000_000,
        annualRatePercent: -1,
        termMonths: 12,
        repaymentMethod: "equalPayment",
      })
    ).toThrow();
  });

  it("잘못된 입력(0개월 기간)은 오류를 던진다", () => {
    expect(() =>
      calculateLoanInterest({
        principal: 1_000_000,
        annualRatePercent: 3,
        termMonths: 0,
        repaymentMethod: "equalPayment",
      })
    ).toThrow();
  });
});
