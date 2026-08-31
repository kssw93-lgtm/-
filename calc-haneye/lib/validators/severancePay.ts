import { z } from "zod";
import { parseDateOnly } from "@/lib/utils/date";

export const DEFAULT_THREE_MONTH_DAYS = 92;

export const severancePayFormSchema = z
  .object({
    hireDate: z
      .string()
      .min(1, "입사일을 입력해 주세요.")
      .refine((value) => parseDateOnly(value) !== null, {
        message: "올바른 날짜 형식이 아닙니다.",
      }),
    resignationDate: z
      .string()
      .min(1, "퇴사일을 입력해 주세요.")
      .refine((value) => parseDateOnly(value) !== null, {
        message: "올바른 날짜 형식이 아닙니다.",
      }),
    threeMonthWages: z.coerce
      .number({ invalid_type_error: "숫자를 입력해 주세요." })
      .positive("퇴직 전 3개월 임금 합계는 0보다 큰 숫자를 입력해 주세요."),
    threeMonthDays: z.coerce
      .number({ invalid_type_error: "숫자를 입력해 주세요." })
      .int("일수는 정수로 입력해 주세요.")
      .min(1, "퇴직 전 3개월 일수는 1 이상이어야 합니다."),
    annualBonus: z.coerce
      .number({ invalid_type_error: "숫자를 입력해 주세요." })
      .min(0, "연간 상여금은 0 이상의 숫자를 입력해 주세요."),
    unusedAnnualLeaveAllowance: z.coerce
      .number({ invalid_type_error: "숫자를 입력해 주세요." })
      .min(0, "미사용 연차수당은 0 이상의 숫자를 입력해 주세요."),
    includeBonusAndLeaveAllowance: z.boolean(),
  })
  .refine(
    (data) => {
      const hire = parseDateOnly(data.hireDate);
      const resignation = parseDateOnly(data.resignationDate);
      if (!hire || !resignation) return true;
      return resignation.getTime() > hire.getTime();
    },
    {
      message: "퇴사일은 입사일보다 뒤여야 합니다.",
      path: ["resignationDate"],
    }
  );

export type SeverancePayFormValues = z.infer<typeof severancePayFormSchema>;
