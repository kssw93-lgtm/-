import sinsalCategoryJson from "@/data/sinsal-category.json";
import type { SinsalId } from "@/lib/calc/sinsal";
import type { Category } from "./template-select";

type SinsalFlavor = "relationship" | "career" | "wealth";

const SINSAL_CATEGORY = sinsalCategoryJson as Record<SinsalId, Record<SinsalFlavor, string>>;

const CATEGORY_TO_FLAVOR: Partial<Record<Category, SinsalFlavor>> = {
  love: "relationship",
  reunion: "relationship",
  career: "career",
  wealth: "wealth",
};

/**
 * 신살(神殺) 설명이 카테고리(연애운/직업운/재물운)와 무관하게 항상 똑같은 문장이라
 * "붙여넣기 채우기"처럼 느껴진다는 피드백을 반영한다. 신살의 원래 의미(data/sinsal.json의
 * desc)는 바꾸지 않고, 그 의미를 연애·직업·재물이라는 구체적인 맥락에 맞게 풀어쓴 문구를
 * 추가로 매칭한다. 종합사주(overall)는 특정 주제로 치우치면 안 되므로 기존 범용 설명을
 * 그대로 쓴다(fallback).
 */
export function getSinsalDescForCategory(id: SinsalId, category: Category, fallback: string): string {
  const flavor = CATEGORY_TO_FLAVOR[category];
  if (!flavor) return fallback;
  return SINSAL_CATEGORY[id]?.[flavor] ?? fallback;
}
