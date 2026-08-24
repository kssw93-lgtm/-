import categorySummaryJson from "@/data/category-summary.json";
import type { PatternGroup } from "./feature-extract";
import type { Category } from "./template-select";

const CATEGORY_SUMMARY = categorySummaryJson as Record<Category, Record<PatternGroup, string>>;

/**
 * 리포트 맨 끝에 붙는 "총평" — 이미 위에서 다룬 내용(일간/월간/연간, 격국, 신살 등)을
 * 새로 계산하지 않고, 같은 PatternGroup이 그 카테고리에서 무엇을 의미하는지 한 문단으로
 * 묶어 마무리한다. 모든 카테고리(종합사주 포함)에서 항상 채워진다.
 */
export function getCategorySummary(category: Category, group: PatternGroup): string {
  return CATEGORY_SUMMARY[category][group];
}
