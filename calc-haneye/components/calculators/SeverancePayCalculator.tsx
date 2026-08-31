"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateSeverancePay,
  type SeverancePayResult,
} from "@/lib/calculators/severancePay";
import {
  DEFAULT_THREE_MONTH_DAYS,
  severancePayFormSchema,
  type SeverancePayFormValues,
} from "@/lib/validators/severancePay";
import { parseDateOnly, formatCalendarDuration } from "@/lib/utils/date";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorInputCard } from "@/components/calculator/CalculatorInputCard";
import { CalculatorResultCard } from "@/components/calculator/CalculatorResultCard";
import { ResultCopyButton } from "@/components/calculator/ResultCopyButton";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { EmptyResultState } from "@/components/calculator/EmptyResultState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Badge } from "@/components/ui/Badge";
import { formatWon } from "@/lib/utils/currency";
import { siteName } from "@/lib/constants/site";

const SEVERANCE_DISCLAIMER =
  "이 결과는 사용자가 입력한 날짜와 임금 정보를 바탕으로 한 단순 참고용 예상 계산입니다. " +
  "실제 퇴직금은 평균임금·통상임금 판단, 휴직·결근, 상여금·연차수당, 중간정산, 퇴직연금, " +
  "근로계약 및 취업규칙 등에 따라 달라질 수 있습니다.";

const DEFAULT_VALUES: SeverancePayFormValues = {
  hireDate: "",
  resignationDate: "",
  threeMonthWages: undefined as unknown as number,
  threeMonthDays: DEFAULT_THREE_MONTH_DAYS,
  annualBonus: 0,
  unusedAnnualLeaveAllowance: 0,
  includeBonusAndLeaveAllowance: false,
};

export function SeverancePayCalculator() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SeverancePayFormValues>({
    resolver: zodResolver(severancePayFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const [result, setResult] = useState<SeverancePayResult | null>(null);
  const [calculatedValues, setCalculatedValues] =
    useState<SeverancePayFormValues | null>(null);

  const currentValues = watch();
  const isStale =
    result !== null &&
    calculatedValues !== null &&
    JSON.stringify(currentValues) !== JSON.stringify(calculatedValues);

  function onSubmit(data: SeverancePayFormValues) {
    const hireDate = parseDateOnly(data.hireDate);
    const resignationDate = parseDateOnly(data.resignationDate);
    if (!hireDate || !resignationDate) return;

    const calcResult = calculateSeverancePay({
      hireDate,
      resignationDate,
      threeMonthWages: data.threeMonthWages,
      threeMonthDays: data.threeMonthDays,
      annualBonus: data.annualBonus,
      unusedAnnualLeaveAllowance: data.unusedAnnualLeaveAllowance,
      includeBonusAndLeaveAllowance: data.includeBonusAndLeaveAllowance,
    });
    setResult(calcResult);
    setCalculatedValues(data);
  }

  function handleReset() {
    reset(DEFAULT_VALUES);
    setResult(null);
    setCalculatedValues(null);
  }

  function buildCopyText(): string {
    if (!result || !calculatedValues) return "";
    const lines = [
      `${siteName} - 퇴직금 계산기`,
      `- 입사일: ${calculatedValues.hireDate}`,
      `- 퇴사일: ${calculatedValues.resignationDate}`,
      `- 퇴직 전 3개월 임금 합계: ${formatWon(calculatedValues.threeMonthWages)}`,
      `- 상여금·연차수당 반영: ${
        calculatedValues.includeBonusAndLeaveAllowance ? "반영함" : "반영 안 함"
      }`,
      "",
      "[핵심 결과]",
      `- 재직기간: ${formatCalendarDuration(result.duration)} (총 ${result.continuousEmploymentDays}일)`,
      `- 1일 평균임금: ${formatWon(result.averageDailyWage)}`,
      `- 예상 퇴직금: ${formatWon(result.estimatedSeverancePay)}`,
    ];

    if (!result.isEligible) {
      lines.push("- 참고: 계속근로 1년 미만으로 법정 퇴직금 수급 요건을 충족하지 않을 수 있습니다.");
    }

    lines.push("");
    lines.push(
      "이 결과는 참고용 예상 계산이며, 실제 퇴직금과 다를 수 있습니다."
    );

    return lines.join("\n");
  }

  return (
    <CalculatorShell
      inputSlot={
        <CalculatorInputCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              label="입사일"
              htmlFor="hireDate"
              required
              error={errors.hireDate?.message}
            >
              <Input
                id="hireDate"
                type="date"
                invalid={!!errors.hireDate}
                {...register("hireDate")}
              />
            </FormField>

            <FormField
              label="퇴사일"
              htmlFor="resignationDate"
              required
              error={errors.resignationDate?.message}
            >
              <Input
                id="resignationDate"
                type="date"
                invalid={!!errors.resignationDate}
                {...register("resignationDate")}
              />
            </FormField>

            <FormField
              label="퇴직 전 3개월 임금 합계"
              htmlFor="threeMonthWages"
              required
              error={errors.threeMonthWages?.message}
              hint="기본급, 수당 등 평균임금 산정에 반영되는 금액을 합산해 입력하세요."
            >
              <Controller
                name="threeMonthWages"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="threeMonthWages"
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={!!errors.threeMonthWages}
                    placeholder="예: 9,000,000"
                  />
                )}
              />
            </FormField>

            <FormField
              label="퇴직 전 3개월 일수"
              htmlFor="threeMonthDays"
              required
              error={errors.threeMonthDays?.message}
              hint="정확한 평균임금 계산을 위해 퇴직 전 3개월의 실제 역일수를 확인해 입력하세요."
            >
              <Input
                id="threeMonthDays"
                type="text"
                inputMode="numeric"
                invalid={!!errors.threeMonthDays}
                {...register("threeMonthDays")}
              />
            </FormField>

            <div className="rounded-lg border border-hairline p-4">
              <label className="flex items-start gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  {...register("includeBonusAndLeaveAllowance")}
                />
                <span>
                  연간 상여금과 미사용 연차수당을 평균임금 계산에 단순 환산해 반영
                </span>
              </label>
              <p className="mt-1 pl-6 text-xs text-ink-muted">
                반영 시 3개월 환산액을 더해 계산합니다. 실제 법정 산정 방식과 차이가
                날 수 있는 단순화된 참고 계산입니다.
              </p>

              <div className="mt-4 space-y-4 pl-6">
                <FormField
                  label="연간 상여금"
                  htmlFor="annualBonus"
                  error={errors.annualBonus?.message}
                >
                  <Controller
                    name="annualBonus"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="annualBonus"
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        invalid={!!errors.annualBonus}
                        placeholder="예: 0"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="미사용 연차수당"
                  htmlFor="unusedAnnualLeaveAllowance"
                  error={errors.unusedAnnualLeaveAllowance?.message}
                >
                  <Controller
                    name="unusedAnnualLeaveAllowance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="unusedAnnualLeaveAllowance"
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        invalid={!!errors.unusedAnnualLeaveAllowance}
                        placeholder="예: 0"
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button type="submit" size="lg" fullWidth>
                계산하기
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleReset}
              >
                초기화
              </Button>
            </div>
          </form>
        </CalculatorInputCard>
      }
      resultSlot={
        <CalculatorResultCard>
          {!result || !calculatedValues ? (
            <EmptyResultState />
          ) : (
            <div className="space-y-5">
              {isStale ? (
                <div className="rounded-lg border border-caution/30 bg-caution-light px-4 py-3 text-sm text-caution">
                  입력값이 변경되었습니다. 다시 계산해 주세요.
                </div>
              ) : null}

              <div className={isStale ? "opacity-50" : undefined}>
                {!result.isEligible ? (
                  <Badge tone="caution" className="mb-3">
                    계속근로 1년 미만 · 법정 퇴직금 수급 요건 미충족 가능
                  </Badge>
                ) : null}

                <div className="space-y-3">
                  <ResultLine
                    label="예상 퇴직금"
                    value={formatWon(result.estimatedSeverancePay)}
                    emphasis
                  />
                  <ResultLine
                    label="재직기간"
                    value={formatCalendarDuration(result.duration)}
                  />
                  <ResultLine
                    label="재직일수"
                    value={`${result.continuousEmploymentDays}일`}
                  />
                  <ResultLine
                    label="재직연수 환산값"
                    value={`${result.yearsOfService.toFixed(2)}년`}
                  />
                  <ResultLine
                    label="1일 평균임금"
                    value={formatWon(result.averageDailyWage)}
                  />
                </div>

                <p className="mt-3 text-sm text-ink-soft">
                  계산식: 1일 평균임금 × 30일 × 계속근로일수 ÷ 365
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {result.includedBonusAndLeaveAllowance
                    ? "연간 상여금·미사용 연차수당의 3개월 환산액을 평균임금 계산에 반영했습니다."
                    : "연간 상여금·미사용 연차수당은 반영하지 않았습니다."}
                </p>

                <ResultCopyButton getText={buildCopyText} className="mt-4" />
              </div>

              <CalculationNotice>{SEVERANCE_DISCLAIMER}</CalculationNotice>
            </div>
          )}
        </CalculatorResultCard>
      }
    />
  );
}

function ResultLine({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-ink-soft">{label}</span>
      <span
        className={
          emphasis
            ? "text-2xl font-bold text-brand"
            : "text-base font-semibold text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}
