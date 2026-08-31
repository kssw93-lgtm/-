"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import {
  calculateHomeAcquisitionTax,
  type HomeAcquisitionTaxResult,
} from "@/lib/calculators/homeAcquisitionTax";
import {
  acquisitionTypeOptions,
  homeAcquisitionTaxFormSchema,
  homeCountOptions,
  jointOwnershipOptions,
  propertyTypeOptions,
  reductionStatusOptions,
  type HomeAcquisitionTaxFormValues,
} from "@/lib/validators/homeAcquisitionTax";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { CalculatorInputCard } from "@/components/calculator/CalculatorInputCard";
import { CalculatorResultCard } from "@/components/calculator/CalculatorResultCard";
import { ResultCopyButton } from "@/components/calculator/ResultCopyButton";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { CalculatorMeta } from "@/components/calculator/CalculatorMeta";
import { EmptyResultState } from "@/components/calculator/EmptyResultState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatWon } from "@/lib/utils/currency";
import { formatPercent } from "@/lib/utils/percentage";
import { siteName } from "@/lib/constants/site";

const TAX_DISCLAIMER =
  "이 계산기는 개인의 일반 1주택 유상취득과 감면 미적용 조건을 기준으로 기본 취득세만 " +
  "참고용으로 계산합니다. 지방교육세, 농어촌특별세, 다주택 중과, 법인 취득, 생애최초 등 " +
  "감면, 상속·증여, 공동취득 및 기타 개별 조건은 반영하지 않습니다. 실제 납부세액은 " +
  "위택스, 관할 지방자치단체 또는 세무전문가를 통해 확인하세요.";

const DEFAULT_VALUES: HomeAcquisitionTaxFormValues = {
  priceWon: undefined as unknown as number,
  acquisitionType: "paidIndividual",
  homeCount: "one",
  reductionStatus: "notApplied",
  jointOwnership: "no",
  propertyType: "house",
};

export function HomeAcquisitionTaxCalculator() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<HomeAcquisitionTaxFormValues>({
    resolver: zodResolver(homeAcquisitionTaxFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const [result, setResult] = useState<HomeAcquisitionTaxResult | null>(null);
  const [calculatedValues, setCalculatedValues] =
    useState<HomeAcquisitionTaxFormValues | null>(null);

  const currentValues = watch();
  const isStale =
    result !== null &&
    calculatedValues !== null &&
    JSON.stringify(currentValues) !== JSON.stringify(calculatedValues);

  function onSubmit(data: HomeAcquisitionTaxFormValues) {
    const calcResult = calculateHomeAcquisitionTax({
      priceWon: data.priceWon,
      acquisitionType: data.acquisitionType,
      homeCount: data.homeCount,
      reductionStatus: data.reductionStatus,
      jointOwnership: data.jointOwnership === "yes",
      propertyType: data.propertyType,
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

    if (result.status !== "calculated") {
      return [
        `${siteName} - 주택 취득세 계산기`,
        `- 취득가액: ${formatWon(calculatedValues.priceWon)}`,
        "",
        result.status === "outOfScope"
          ? "[1차 계산 범위 밖]"
          : "[추가 확인 필요]",
        result.reason,
      ].join("\n");
    }

    return [
      `${siteName} - 주택 취득세 계산기`,
      `- 취득가액: ${formatWon(result.priceWon)}`,
      `- 적용 조건: ${result.appliedConditions.join(", ")}`,
      "",
      "[핵심 결과]",
      `- 적용 기본 취득세율: ${formatPercent(result.applicableRate, {
        minFractionDigits: 2,
        maxFractionDigits: 4,
      })}`,
      `- 예상 기본 취득세: ${formatWon(result.estimatedBasicAcquisitionTax)}`,
      `- 기준일: ${result.effectiveDate} (최종 검토일: ${result.lastReviewedAt})`,
      "",
      "지방교육세, 농어촌특별세, 다주택 중과 등은 포함되지 않은 참고용 계산입니다.",
    ].join("\n");
  }

  return (
    <CalculatorShell
      inputSlot={
        <CalculatorInputCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              label="취득가액"
              htmlFor="priceWon"
              required
              error={errors.priceWon?.message}
            >
              <Controller
                name="priceWon"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="priceWon"
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={!!errors.priceWon}
                    placeholder="예: 750,000,000"
                  />
                )}
              />
            </FormField>

            <FormField
              label="취득 형태"
              htmlFor="acquisitionType"
              required
              error={errors.acquisitionType?.message}
            >
              <Select
                id="acquisitionType"
                options={acquisitionTypeOptions}
                invalid={!!errors.acquisitionType}
                {...register("acquisitionType")}
              />
            </FormField>

            <FormField
              label="보유 주택 수"
              htmlFor="homeCount"
              required
              error={errors.homeCount?.message}
            >
              <Select
                id="homeCount"
                options={homeCountOptions}
                invalid={!!errors.homeCount}
                {...register("homeCount")}
              />
            </FormField>

            <FormField
              label="감면 적용 여부"
              htmlFor="reductionStatus"
              required
              error={errors.reductionStatus?.message}
            >
              <Select
                id="reductionStatus"
                options={reductionStatusOptions}
                invalid={!!errors.reductionStatus}
                {...register("reductionStatus")}
              />
            </FormField>

            <FormField
              label="공동·지분 취득 여부"
              htmlFor="jointOwnership"
              required
              error={errors.jointOwnership?.message}
            >
              <Select
                id="jointOwnership"
                options={jointOwnershipOptions}
                invalid={!!errors.jointOwnership}
                {...register("jointOwnership")}
              />
            </FormField>

            <FormField
              label="주택 유형"
              htmlFor="propertyType"
              required
              error={errors.propertyType?.message}
            >
              <Select
                id="propertyType"
                options={propertyTypeOptions}
                invalid={!!errors.propertyType}
                {...register("propertyType")}
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
                {result.status === "calculated" ? (
                  <>
                    <div className="space-y-3">
                      <ResultLine
                        label="예상 기본 취득세"
                        value={formatWon(result.estimatedBasicAcquisitionTax)}
                        emphasis
                      />
                      <ResultLine
                        label="적용 기본 취득세율"
                        value={formatPercent(result.applicableRate, {
                          minFractionDigits: 2,
                          maxFractionDigits: 4,
                        })}
                      />
                      <ResultLine
                        label="취득가액"
                        value={formatWon(result.priceWon)}
                      />
                    </div>

                    <p className="mt-3 text-xs font-medium text-ink-soft">
                      본 계산기는 기본 취득세만 산출하며, 부가세목·감면·중과 등은
                      포함하지 않습니다.
                    </p>

                    <div className="mt-4">
                      <CalculatorMeta
                        effectiveDateLabel={`기준일: ${result.effectiveDate}`}
                        lastReviewedLabel={`최종 검토일: ${result.lastReviewedAt}`}
                      />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-semibold text-ink-soft">
                          적용한 조건
                        </h3>
                        <ul className="mt-1.5 space-y-1 text-xs text-ink-muted">
                          {result.appliedConditions.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-ink-soft">
                          포함하지 않은 항목
                        </h3>
                        <ul className="mt-1.5 space-y-1 text-xs text-ink-muted">
                          {result.excludedItems.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <ResultCopyButton getText={buildCopyText} className="mt-4" />
                  </>
                ) : (
                  <ScopeNotice result={result} />
                )}
              </div>

              <CalculationNotice>{TAX_DISCLAIMER}</CalculationNotice>
            </div>
          )}
        </CalculatorResultCard>
      }
    />
  );
}

function ScopeNotice({
  result,
}: {
  result: Extract<
    HomeAcquisitionTaxResult,
    { status: "outOfScope" | "needsReview" }
  >;
}) {
  const heading =
    result.status === "outOfScope"
      ? "현재 1차 계산 범위 밖입니다"
      : "추가 확인이 필요합니다";

  return (
    <div className="rounded-lg border border-caution/30 bg-caution-light p-4">
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-caution"
        />
        <div>
          <p className="text-sm font-semibold text-caution">{heading}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {result.reason}
          </p>
          {result.itemsToCheck.length > 0 ? (
            <ul className="mt-2.5 space-y-1 text-xs text-ink-muted">
              {result.itemsToCheck.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
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
