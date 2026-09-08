export type SafetyLevel = "치명적" | "위험" | "주의" | "안전";
export type Species = "dog" | "cat";

export interface SpeciesSafetyInfo {
  safety: SafetyLevel;
  toxic_component: string | null;
  symptoms: string;
  emergency: string;
  safe_amount: string | null;
  notes: string;
}

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  dog: SpeciesSafetyInfo;
  cat: SpeciesSafetyInfo;
}
