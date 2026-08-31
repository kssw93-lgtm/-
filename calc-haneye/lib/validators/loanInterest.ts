import { z } from "zod";

export const loanRepaymentMethodOptions = [
  { value: "equalPayment", label: "원리금균등상환" },
  { value: "equalPrincipal", label: "원금균등상환" },
  { value: "bulletPayment", label: "만기일시상환" },
] as const;

export const loanInterestFormSchema = z.object({
  principal: z.coerce
    .number({ invalid_type_error: "숫자를 입력해 주세요." })
    .positive("대출 원금은 0보다 큰 숫자를 입력해 주세요."),
  annualRatePercent: z.coerce
    .number({ invalid_type_error: "숫자를 입력해 주세요." })
    .min(0, "연 이자율은 0 이상의 숫자를 입력해 주세요."),
  termMonths: z.coerce
    .number({ invalid_type_error: "숫자를 입력해 주세요." })
    .int("대출 기간은 개월 수(정수)로 입력해 주세요.")
    .min(1, "대출 기간은 1개월 이상이어야 합니다."),
  repaymentMethod: z.enum(["equalPayment", "equalPrincipal", "bulletPayment"], {
    errorMap: () => ({ message: "상환 방식을 선택해 주세요." }),
  }),
});

export type LoanInterestFormValues = z.infer<typeof loanInterestFormSchema>;
