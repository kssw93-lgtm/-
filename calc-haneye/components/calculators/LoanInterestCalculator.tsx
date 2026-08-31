"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateLoanInterest, type LoanInterestResult } from "@/lib/calculators/loanInterest";
import {
  loanInterestFormSchema,
  loanRepaymentMethodOptions,
  type LoanInterestFormValues,
} from "@/lib/validators/loanInterest";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorInputCard } from "@/components/calculator/CalculatorInputCard";
import { CalculatorResultCard } from "@/components/calculator/CalculatorResultCard";
import { ResultCopyButton } from "@/components/calculator/ResultCopyButton";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { EmptyResultState } from "@/components/calculator/EmptyResultState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatWon } from "@/lib/utils/currency";
import { siteName } from "@/lib/constants/site";

const REPAYMENT_LABELS: Record<LoanInterestFormValues["repaymentMethod"], string> = {
  equalPayment: "원리금균등상환",
  equalPrincipal: "원금균등상환",
  bulletPayment: "만기일시상환",
};

const REPAYMENT_DESCRIPTIONS: Record<LoanInterestFormValues["repaymentMethod"], string> = {
  equalPayment:
    "매월 동일한 금액(원금+이자)을 상환합니다. 초기에는 이자 비중이 크고, 갈수록 원금 비중이 커집니다.",
  equalPrincipal:
    "매월 동일한 원금을 상환하고, 이자는 남은 원금에 따라 점차 줄어듭니다. 첫 달 납입액이 가장 크고 점차 감소합니다.",
  bulletPayment:
    "만기 전까지는 매월 이자만 납부하고, 만기에 원금을 한 번에 상환합니다.",
};

const LOAN_DISCLAIMER =
  "이 결과는 입력한 원금, 연이율, 상환 기간 및 상환 방식을 기준으로 계산한 참고용 예상값입니다. " +
  "실제 대출 가능 여부, 적용 금리, 우대금리, 상환 조건, 중도상환수수료 및 부대비용은 금융기관과 상품별로 다를 수 있습니다.";

const INITIAL_VISIBLE_MONTHS = 12;

export function LoanInterestCalculator() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<LoanInterestFormValues>({
    resolver: zodResolver(loanInterestFormSchema),
    defaultValues: {
      principal: undefined,
      annualRatePercent: undefined,
      termMonths: undefined,
      repaymentMethod: "equalPayment",
    },
  });

  const [result, setResult] = useState<LoanInterestResult | null>(null);
  const [calculatedValues, setCalculatedValues] =
    useState<LoanInterestFormValues | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const currentValues = watch();
  const isStale =
    result !== null &&
    calculatedValues !== null &&
    JSON.stringify(currentValues) !== JSON.stringify(calculatedValues);

  function onSubmit(data: LoanInterestFormValues) {
    const calcResult = calculateLoanInterest(data);
    setResult(calcResult);
    setCalculatedValues(data);
    setShowFullSchedule(false);
  }

  function handleReset() {
    reset({
      principal: undefined,
      annualRatePercent: undefined,
      termMonths: undefined,
      repaymentMethod: "equalPayment",
    });
    setResult(null);
    setCalculatedValues(null);
    setShowFullSchedule(false);
  }

  function buildCopyText(): string {
    if (!result || !calculatedValues) return "";
    const firstRow = result.schedule[0];
    const lastRow = result.schedule[result.schedule.length - 1];

    const lines = [
      `${siteName} - 대출 이자 계산기`,
      `- 대출 원금: ${formatWon(calculatedValues.principal)}`,
      `- 연 이자율: ${calculatedValues.annualRatePercent}%`,
      `- 대출 기간: ${calculatedValues.termMonths}개월`,
      `- 상환 방식: ${REPAYMENT_LABELS[calculatedValues.repaymentMethod]}`,
      "",
      "[핵심 결과]",
    ];

    if (calculatedValues.repaymentMethod === "equalPayment" && firstRow) {
      lines.push(`- 월 예상 납입액: ${formatWon(firstRow.payment)}`);
    } else if (
      calculatedValues.repaymentMethod === "equalPrincipal" &&
      firstRow &&
      lastRow
    ) {
      lines.push(`- 첫 달 납입액: ${formatWon(firstRow.payment)}`);
      lines.push(`- 마지막 달 납입액: ${formatWon(lastRow.payment)}`);
    } else if (
      calculatedValues.repaymentMethod === "bulletPayment" &&
      firstRow &&
      lastRow
    ) {
      lines.push(`- 월 이자: ${formatWon(firstRow.payment)}`);
      lines.push(`- 만기 상환액: ${formatWon(lastRow.payment)}`);
    }

    lines.push(`- 총 상환액: ${formatWon(result.totalPayment)}`);
    lines.push(`- 총 이자액: ${formatWon(result.totalInterest)}`);
    lines.push("");
    lines.push(
      "이 결과는 참고용 예상 계산이며, 실제 대출 조건 및 금융기관 안내와 다를 수 있습니다."
    );

    return lines.join("\n");
  }

  const visibleSchedule = showFullSchedule
    ? result?.schedule ?? []
    : result?.schedule.slice(0, INITIAL_VISIBLE_MONTHS) ?? [];

  return (
    <CalculatorShell
      inputSlot={
        <CalculatorInputCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              label="대출 원금"
              htmlFor="principal"
              required
              error={errors.principal?.message}
            >
              <Controller
                name="principal"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="principal"
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={!!errors.principal}
                    placeholder="예: 100,000,000"
                  />
                )}
              />
            </FormField>

            <FormField
              label="연 이자율"
              htmlFor="annualRatePercent"
              required
              error={errors.annualRatePercent?.message}
              hint="실제 상품금리가 아닌, 확인하고 싶은 가정 금리를 입력하세요."
            >
              <div className="relative">
                <Input
                  id="annualRatePercent"
                  type="text"
                  inputMode="decimal"
                  className="pr-9"
                  invalid={!!errors.annualRatePercent}
                  placeholder="예: 4.5"
                  {...register("annualRatePercent")}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted"
                >
                  %
                </span>
              </div>
            </FormField>

            <FormField
              label="대출 기간(개월)"
              htmlFor="termMonths"
              required
              error={errors.termMonths?.message}
            >
              <Input
                id="termMonths"
                type="text"
                inputMode="numeric"
                invalid={!!errors.termMonths}
                placeholder="예: 36"
                {...register("termMonths")}
              />
            </FormField>

            <FormField
              label="상환 방식"
              htmlFor="repaymentMethod"
              required
              error={errors.repaymentMethod?.message}
            >
              <Select
                id="repaymentMethod"
                options={loanRepaymentMethodOptions}
                invalid={!!errors.repaymentMethod}
                {...register("repaymentMethod")}
              />
            </FormField>

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
                <div className="space-y-3">
                  {calculatedValues.repaymentMethod === "equalPayment" ? (
                    <ResultLine
                      label="월 예상 납입액"
                      value={formatWon(result.schedule[0]?.payment ?? 0)}
                      emphasis
                    />
                  ) : calculatedValues.repaymentMethod === "equalPrincipal" ? (
                    <>
                      <ResultLine
                        label="첫 달 납입액"
                        value={formatWon(result.schedule[0]?.payment ?? 0)}
                        emphasis
                      />
                      <ResultLine
                        label="마지막 달 납입액"
                        value={formatWon(
                          result.schedule[result.schedule.length - 1]?.payment ?? 0
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <ResultLine
                        label="월 이자"
                        value={formatWon(result.schedule[0]?.payment ?? 0)}
                        emphasis
                      />
                      <ResultLine
                        label="만기 상환액"
                        value={formatWon(
                          result.schedule[result.schedule.length - 1]?.payment ?? 0
                        )}
                      />
                    </>
                  )}
                  <ResultLine label="총 상환액" value={formatWon(result.totalPayment)} />
                  <ResultLine label="총 이자액" value={formatWon(result.totalInterest)} />
                </div>

                <p className="mt-3 text-sm text-ink-soft">
                  {REPAYMENT_DESCRIPTIONS[calculatedValues.repaymentMethod]}
                </p>

                <p className="mt-3 text-xs text-ink-muted">
                  표시 금액은 원 단위로 반올림한 예상값입니다.
                </p>

                <ResultCopyButton getText={buildCopyText} className="mt-4" />

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-ink">월별 상환 스케줄</h3>
                  <div className="mt-2 overflow-x-auto rounded-lg border border-hairline">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <caption className="sr-only">
                        회차별 납입금, 원금, 이자, 잔여 원금 스케줄
                      </caption>
                      <thead className="bg-surface-subtle text-xs text-ink-muted">
                        <tr>
                          <th scope="col" className="px-3 py-2 font-medium">
                            회차
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            납입금
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            원금
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            이자
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            잔여 원금
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {visibleSchedule.map((row) => (
                          <tr key={row.month}>
                            <td className="px-3 py-2">{row.month}</td>
                            <td className="px-3 py-2">{formatWon(row.payment)}</td>
                            <td className="px-3 py-2">{formatWon(row.principal)}</td>
                            <td className="px-3 py-2">{formatWon(row.interest)}</td>
                            <td className="px-3 py-2">
                              {formatWon(row.remainingPrincipal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.schedule.length > INITIAL_VISIBLE_MONTHS ? (
                    <button
                      type="button"
                      onClick={() => setShowFullSchedule((v) => !v)}
                      className="mt-3 text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                    >
                      {showFullSchedule
                        ? "접기"
                        : `전체 ${result.schedule.length}개월 보기`}
                    </button>
                  ) : null}
                </div>
              </div>

              <CalculationNotice>{LOAN_DISCLAIMER}</CalculationNotice>
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
