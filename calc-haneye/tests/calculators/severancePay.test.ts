import { describe, expect, it } from "vitest";
import { calculateSeverancePay } from "@/lib/calculators/severancePay";
import { parseDateOnly } from "@/lib/utils/date";

function date(value: string): Date {
  const parsed = parseDateOnly(value);
  if (!parsed) throw new Error(`invalid test date: ${value}`);
  return parsed;
}

describe("calculateSeverancePay", () => {
  it("정상 재직기간: 3년 이상 근무 시 수급 요건을 충족한다", () => {
    const result = calculateSeverancePay({
      hireDate: date("2020-01-01"),
      resignationDate: date("2023-01-01"),
      threeMonthWages: 9_000_000,
      threeMonthDays: 92,
    });

    expect(result.isEligible).toBe(true);
    expect(result.yearsOfService).toBeGreaterThan(2.9);
    expect(result.estimatedSeverancePay).toBeGreaterThan(0);
  });

  it("입사일/퇴사일을 포함한 일수를 계산한다", () => {
    const result = calculateSeverancePay({
      hireDate: date("2024-01-01"),
      resignationDate: date("2024-01-02"),
      threeMonthWages: 9_000_000,
      threeMonthDays: 92,
    });

    expect(result.continuousEmploymentDays).toBe(2);
  });

  it("퇴사일이 입사일보다 앞서면 오류를 던진다", () => {
    expect(() =>
      calculateSeverancePay({
        hireDate: date("2023-01-01"),
        resignationDate: date("2022-01-01"),
        threeMonthWages: 9_000_000,
        threeMonthDays: 92,
      })
    ).toThrow();
  });

  it("퇴사일이 입사일과 같으면 오류를 던진다", () => {
    expect(() =>
      calculateSeverancePay({
        hireDate: date("2023-01-01"),
        resignationDate: date("2023-01-01"),
        threeMonthWages: 9_000_000,
        threeMonthDays: 92,
      })
    ).toThrow();
  });

  it("1년 미만 근무는 isEligible이 false이지만 참고 계산값은 제공된다", () => {
    const result = calculateSeverancePay({
      hireDate: date("2024-01-01"),
      resignationDate: date("2024-06-01"),
      threeMonthWages: 9_000_000,
      threeMonthDays: 92,
    });

    expect(result.isEligible).toBe(false);
    expect(result.estimatedSeverancePay).toBeGreaterThan(0);
  });

  it("0원 임금은 오류를 던진다", () => {
    expect(() =>
      calculateSeverancePay({
        hireDate: date("2020-01-01"),
        resignationDate: date("2023-01-01"),
        threeMonthWages: 0,
        threeMonthDays: 92,
      })
    ).toThrow();
  });

  it("윤년(2024년 2월 29일)을 포함하는 기간의 일수를 정확히 계산한다", () => {
    const result = calculateSeverancePay({
      hireDate: date("2024-01-01"),
      resignationDate: date("2024-03-01"),
      threeMonthWages: 9_000_000,
      threeMonthDays: 92,
    });

    // 2024년 1월(31일) + 2월(29일, 윤년) + 3월 1일 포함 = 61일
    expect(result.continuousEmploymentDays).toBe(61);
  });

  it("상여금·연차수당 반영 토글에 따라 평균임금 계산이 달라진다", () => {
    const base = {
      hireDate: date("2020-01-01"),
      resignationDate: date("2023-01-01"),
      threeMonthWages: 9_000_000,
      threeMonthDays: 92,
      annualBonus: 3_600_000,
      unusedAnnualLeaveAllowance: 1_200_000,
    };

    const withoutReflection = calculateSeverancePay({
      ...base,
      includeBonusAndLeaveAllowance: false,
    });
    const withReflection = calculateSeverancePay({
      ...base,
      includeBonusAndLeaveAllowance: true,
    });

    expect(withoutReflection.adjustedThreeMonthWages).toBe(9_000_000);
    expect(withReflection.adjustedThreeMonthWages).toBe(
      9_000_000 + (3_600_000 * 3) / 12 + (1_200_000 * 3) / 12
    );
    expect(withReflection.estimatedSeverancePay).toBeGreaterThan(
      withoutReflection.estimatedSeverancePay
    );
  });
});
