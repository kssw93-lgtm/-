export type SafetyLevel = "치명적" | "위험" | "주의" | "안전";
export type Species = "dog" | "cat";

export interface DoseBySize {
  small: string;
  medium: string;
  large: string;
}

export interface SpeciesSafetyInfo {
  safety: SafetyLevel;
  toxic_component: string | null;
  symptoms: string;
  emergency: string;
  safe_amount: string | null;
  notes: string;
  /** 안전(safety === "안전") 등급 음식의 영양·건강 효능. 그 외 등급에는 없음(null). */
  benefits: string | null;
  /** 체중 구간별 위험 섭취량 참고 기준. 수의학 문헌에 근거한 항목에만 존재(개에 한정). */
  dose_by_size?: DoseBySize;
}

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  dog: SpeciesSafetyInfo;
  cat: SpeciesSafetyInfo;
}
