import { z } from "zod";

export const acquisitionTypeOptions = [
  { value: "paidIndividual", label: "개인·유상취득" },
  { value: "inheritance", label: "상속" },
  { value: "gift", label: "증여" },
  { value: "corporate", label: "법인 취득" },
  { value: "other", label: "기타" },
] as const;

export const homeCountOptions = [
  { value: "one", label: "1주택" },
  { value: "two", label: "2주택" },
  { value: "threeOrMore", label: "3주택 이상" },
  { value: "unknown", label: "잘 모르겠어요" },
] as const;

export const reductionStatusOptions = [
  { value: "notApplied", label: "감면 미적용" },
  { value: "possibleFirstTime", label: "생애최초 등 감면 가능성 있음" },
  { value: "unknown", label: "잘 모르겠어요" },
] as const;

export const propertyTypeOptions = [
  { value: "house", label: "주택" },
  { value: "officetel", label: "오피스텔" },
  { value: "land", label: "토지" },
  { value: "commercial", label: "상가" },
  { value: "other", label: "기타" },
] as const;

export const jointOwnershipOptions = [
  { value: "no", label: "아니오" },
  { value: "yes", label: "예" },
] as const;

export const homeAcquisitionTaxFormSchema = z.object({
  priceWon: z.coerce
    .number({ invalid_type_error: "숫자를 입력해 주세요." })
    .positive("취득가액은 0보다 큰 숫자를 입력해 주세요."),
  acquisitionType: z.enum(
    ["paidIndividual", "inheritance", "gift", "corporate", "other"],
    { errorMap: () => ({ message: "취득 형태를 선택해 주세요." }) }
  ),
  homeCount: z.enum(["one", "two", "threeOrMore", "unknown"], {
    errorMap: () => ({ message: "보유 주택 수를 선택해 주세요." }),
  }),
  reductionStatus: z.enum(["notApplied", "possibleFirstTime", "unknown"], {
    errorMap: () => ({ message: "감면 적용 여부를 선택해 주세요." }),
  }),
  jointOwnership: z.enum(["no", "yes"], {
    errorMap: () => ({ message: "공동·지분 취득 여부를 선택해 주세요." }),
  }),
  propertyType: z.enum(["house", "officetel", "land", "commercial", "other"], {
    errorMap: () => ({ message: "주택 유형을 선택해 주세요." }),
  }),
});

export type HomeAcquisitionTaxFormValues = z.infer<
  typeof homeAcquisitionTaxFormSchema
>;
