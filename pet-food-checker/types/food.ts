export type SafetyLevel = "치명적" | "위험" | "주의" | "안전";

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  safety: SafetyLevel;
  toxic_component: string | null;
  symptoms: string;
  emergency: string;
  safe_amount: string | null;
  notes: string;
}
