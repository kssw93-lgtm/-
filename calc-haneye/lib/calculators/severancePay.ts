import {
  calendarDuration,
  inclusiveDaysBetween,
  type CalendarDuration,
} from "@/lib/utils/date";

export interface SeverancePayInput {
  hireDate: Date;
  resignationDate: Date;
  /** 퇴직 전 3개월 임금 합계(원) */
  threeMonthWages: number;
  /** 퇴직 전 3개월 실제 역일수 */
  threeMonthDays: number;
  /** 연간 상여금(원), 기본값 0 */
  annualBonus?: number;
  /** 미사용 연차수당(원), 기본값 0 */
  unusedAnnualLeaveAllowance?: number;
  /** 연간 상여금·연차수당을 평균임금 계산에 반영할지 여부 */
  includeBonusAndLeaveAllowance?: boolean;
}

export interface SeverancePayResult {
  continuousEmploymentDays: number;
  duration: CalendarDuration;
  yearsOfService: number;
  adjustedThreeMonthWages: number;
  averageDailyWage: number;
  estimatedSeverancePay: number;
  isEligible: boolean;
  includedBonusAndLeaveAllowance: boolean;
}

const DAYS_PER_YEAR = 365;
const SEVERANCE_DAYS_PER_YEAR = 30;

function assertValidInput(input: SeverancePayInput): void {
  if (
    !(input.hireDate instanceof Date) ||
    Number.isNaN(input.hireDate.getTime())
  ) {
    throw new RangeError("입사일이 올바르지 않습니다.");
  }
  if (
    !(input.resignationDate instanceof Date) ||
    Number.isNaN(input.resignationDate.getTime())
  ) {
    throw new RangeError("퇴사일이 올바르지 않습니다.");
  }
  if (input.resignationDate.getTime() <= input.hireDate.getTime()) {
    throw new RangeError("퇴사일은 입사일보다 뒤여야 합니다.");
  }
  if (!Number.isFinite(input.threeMonthWages) || input.threeMonthWages <= 0) {
    throw new RangeError("퇴직 전 3개월 임금 합계는 0보다 큰 숫자여야 합니다.");
  }
  if (
    !Number.isInteger(input.threeMonthDays) ||
    input.threeMonthDays < 1
  ) {
    throw new RangeError("퇴직 전 3개월 일수는 1 이상의 정수여야 합니다.");
  }
  if (
    input.annualBonus !== undefined &&
    (!Number.isFinite(input.annualBonus) || input.annualBonus < 0)
  ) {
    throw new RangeError("연간 상여금은 0 이상의 숫자여야 합니다.");
  }
  if (
    input.unusedAnnualLeaveAllowance !== undefined &&
    (!Number.isFinite(input.unusedAnnualLeaveAllowance) ||
      input.unusedAnnualLeaveAllowance < 0)
  ) {
    throw new RangeError("미사용 연차수당은 0 이상의 숫자여야 합니다.");
  }
}

export function calculateSeverancePay(
  input: SeverancePayInput
): SeverancePayResult {
  assertValidInput(input);

  const annualBonus = input.annualBonus ?? 0;
  const unusedAnnualLeaveAllowance = input.unusedAnnualLeaveAllowance ?? 0;
  const includeBonusAndLeaveAllowance =
    input.includeBonusAndLeaveAllowance ?? false;

  const continuousEmploymentDays = inclusiveDaysBetween(
    input.hireDate,
    input.resignationDate
  );

  const adjustedThreeMonthWages = includeBonusAndLeaveAllowance
    ? input.threeMonthWages +
      (annualBonus * 3) / 12 +
      (unusedAnnualLeaveAllowance * 3) / 12
    : input.threeMonthWages;

  const averageDailyWage = adjustedThreeMonthWages / input.threeMonthDays;
  const yearsOfService = continuousEmploymentDays / DAYS_PER_YEAR;
  const estimatedSeverancePay =
    averageDailyWage * SEVERANCE_DAYS_PER_YEAR * yearsOfService;

  return {
    continuousEmploymentDays,
    duration: calendarDuration(input.hireDate, input.resignationDate),
    yearsOfService: Math.round(yearsOfService * 100) / 100,
    adjustedThreeMonthWages: Math.round(adjustedThreeMonthWages),
    averageDailyWage: Math.round(averageDailyWage),
    estimatedSeverancePay: Math.round(estimatedSeverancePay),
    isEligible: continuousEmploymentDays >= DAYS_PER_YEAR,
    includedBonusAndLeaveAllowance: includeBonusAndLeaveAllowance,
  };
}
