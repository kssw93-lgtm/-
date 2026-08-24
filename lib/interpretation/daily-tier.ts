import dailyTierJson from "@/data/daily-tier.json";
import type { TenGod } from "@/lib/calc/types";
import type { Category } from "./template-select";

const DAILY_TIER = dailyTierJson as Partial<Record<Category, Record<TenGod, string>>>;

/**
 * 카테고리별 "오늘의 OO운" — 오늘 일진과 일간의 십신 관계(computeDailyFortune의
 * tenGod)를 그대로 재사용해, 카테고리 주제에 맞는 문장으로 다시 풀어쓴다. 종합사주는
 * 이미 상단에 카테고리 무관 "오늘의 운세" 카드가 있으므로 여기서는 다루지 않는다.
 */
export function getDailyTierText(category: Category, tenGod: TenGod): string | null {
  return DAILY_TIER[category]?.[tenGod] ?? null;
}
