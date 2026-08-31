export type LoanRepaymentMethod =
  | "equalPayment"
  | "equalPrincipal"
  | "bulletPayment";

export interface LoanInterestInput {
  /** 대출 원금(원) */
  principal: number;
  /** 연 이자율(%) */
  annualRatePercent: number;
  /** 대출 기간(개월) */
  termMonths: number;
  repaymentMethod: LoanRepaymentMethod;
}

export interface LoanScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
}

export interface LoanInterestResult {
  repaymentMethod: LoanRepaymentMethod;
  schedule: LoanScheduleRow[];
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
}

function assertValidInput(input: LoanInterestInput): void {
  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    throw new RangeError("대출 원금은 0보다 큰 숫자여야 합니다.");
  }
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) {
    throw new RangeError("연 이자율은 0 이상의 숫자여야 합니다.");
  }
  if (
    !Number.isInteger(input.termMonths) ||
    input.termMonths < 1
  ) {
    throw new RangeError("대출 기간은 1개월 이상의 정수여야 합니다.");
  }
}

function buildRow(
  month: number,
  payment: number,
  principal: number,
  interest: number,
  remainingPrincipal: number
): LoanScheduleRow {
  return {
    month,
    payment: Math.round(payment),
    principal: Math.round(principal),
    interest: Math.round(interest),
    remainingPrincipal: Math.round(remainingPrincipal),
  };
}

function calculateEqualPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): { rows: LoanScheduleRow[]; totalPayment: number; totalInterest: number; totalPrincipal: number } {
  const monthlyPayment =
    monthlyRate > 0
      ? (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : principal / termMonths;

  const rows: LoanScheduleRow[] = [];
  let remaining = principal;
  let totalPaymentRaw = 0;
  let totalInterestRaw = 0;
  let totalPrincipalRaw = 0;

  for (let month = 1; month <= termMonths; month += 1) {
    const interest = remaining * monthlyRate;
    let principalPortion = monthlyPayment - interest;
    let payment = monthlyPayment;

    if (month === termMonths) {
      principalPortion = remaining;
      payment = principalPortion + interest;
    }

    remaining -= principalPortion;
    if (month === termMonths) remaining = 0;

    totalPaymentRaw += payment;
    totalInterestRaw += interest;
    totalPrincipalRaw += principalPortion;

    rows.push(buildRow(month, payment, principalPortion, interest, remaining));
  }

  return {
    rows,
    totalPayment: Math.round(totalPaymentRaw),
    totalInterest: Math.round(totalInterestRaw),
    totalPrincipal: Math.round(totalPrincipalRaw),
  };
}

function calculateEqualPrincipal(
  principal: number,
  monthlyRate: number,
  termMonths: number
): { rows: LoanScheduleRow[]; totalPayment: number; totalInterest: number; totalPrincipal: number } {
  const monthlyPrincipal = principal / termMonths;

  const rows: LoanScheduleRow[] = [];
  let remaining = principal;
  let totalPaymentRaw = 0;
  let totalInterestRaw = 0;
  let totalPrincipalRaw = 0;

  for (let month = 1; month <= termMonths; month += 1) {
    const interest = remaining * monthlyRate;
    let principalPortion = monthlyPrincipal;

    if (month === termMonths) {
      principalPortion = remaining;
    }

    const payment = principalPortion + interest;
    remaining -= principalPortion;
    if (month === termMonths) remaining = 0;

    totalPaymentRaw += payment;
    totalInterestRaw += interest;
    totalPrincipalRaw += principalPortion;

    rows.push(buildRow(month, payment, principalPortion, interest, remaining));
  }

  return {
    rows,
    totalPayment: Math.round(totalPaymentRaw),
    totalInterest: Math.round(totalInterestRaw),
    totalPrincipal: Math.round(totalPrincipalRaw),
  };
}

function calculateBulletPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): { rows: LoanScheduleRow[]; totalPayment: number; totalInterest: number; totalPrincipal: number } {
  const rows: LoanScheduleRow[] = [];
  let totalPaymentRaw = 0;
  let totalInterestRaw = 0;

  for (let month = 1; month <= termMonths; month += 1) {
    const interest = principal * monthlyRate;
    const isLastMonth = month === termMonths;
    const principalPortion = isLastMonth ? principal : 0;
    const payment = isLastMonth ? principal + interest : interest;
    const remaining = isLastMonth ? 0 : principal;

    totalPaymentRaw += payment;
    totalInterestRaw += interest;

    rows.push(buildRow(month, payment, principalPortion, interest, remaining));
  }

  return {
    rows,
    totalPayment: Math.round(totalPaymentRaw),
    totalInterest: Math.round(totalInterestRaw),
    totalPrincipal: Math.round(principal),
  };
}

export function calculateLoanInterest(
  input: LoanInterestInput
): LoanInterestResult {
  assertValidInput(input);

  const monthlyRate = input.annualRatePercent / 100 / 12;

  const { rows, totalPayment, totalInterest, totalPrincipal } = (() => {
    switch (input.repaymentMethod) {
      case "equalPayment":
        return calculateEqualPayment(
          input.principal,
          monthlyRate,
          input.termMonths
        );
      case "equalPrincipal":
        return calculateEqualPrincipal(
          input.principal,
          monthlyRate,
          input.termMonths
        );
      case "bulletPayment":
        return calculateBulletPayment(
          input.principal,
          monthlyRate,
          input.termMonths
        );
      default:
        throw new RangeError("지원하지 않는 상환 방식입니다.");
    }
  })();

  return {
    repaymentMethod: input.repaymentMethod,
    schedule: rows,
    totalPayment,
    totalInterest,
    totalPrincipal,
  };
}
