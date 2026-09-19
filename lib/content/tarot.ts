import tarotCardsJson from "@/data/tarot-cards.json";
import type { TarotCardGuide } from "./tarot-types";

export type { TarotCardGuide, TarotSymbol, TarotReading } from "./tarot-types";

export const TAROT_CARDS = tarotCardsJson as TarotCardGuide[];

export function getTarotCard(slug: string): TarotCardGuide | undefined {
  return TAROT_CARDS.find((c) => c.slug === slug);
}

/**
 * 검색 유입 분석에서 "행맨 카드", "여사제 카드"처럼 공식 한글 번역명과 다른 이름으로
 * 카드를 찾는 검색어가 확인돼서, 국내 타로 자료에서 흔히 쓰이는 다른 이름을 함께 기록한다.
 * (메이저 아르카나 id 0~21 기준)
 */
const MAJOR_ALIASES: Record<number, string[]> = {
  0: ["더 풀", "광대"],
  1: ["매지션", "마술사"],
  2: ["하이프리스티스", "여교황"],
  3: ["엠프레스", "여제"],
  4: ["엠퍼러"],
  5: ["히에로판트", "하이에로판트"],
  6: ["러버스"],
  7: ["채리엇"],
  8: ["스트렝스"],
  9: ["허밋", "은자"],
  10: ["휠 오브 포춘", "운명의 바퀴"],
  11: ["저스티스"],
  12: ["행맨", "매달린 남자"],
  13: ["데스"],
  14: ["템퍼런스"],
  15: ["데블"],
  16: ["타워"],
  17: ["더 스타", "스타"],
  18: ["더 문"],
  19: ["더 선"],
  20: ["저지먼트"],
  21: ["더 월드"],
};

const MINOR_SUIT_ALIASES: Record<string, string> = {
  완드: "지팡이",
  컵: "성배",
  소드: "검",
  펜타클: "동전",
};

/** 공식 표기와 다른, 실제로 검색에 쓰일 만한 이 카드의 다른 이름들. */
export function getTarotAliases(card: TarotCardGuide): string[] {
  if (card.id <= 21) return MAJOR_ALIASES[card.id] ?? [];
  const [suit, ...rest] = card.nameKo.split(" ");
  const alias = MINOR_SUIT_ALIASES[suit];
  return alias ? [`${alias} ${rest.join(" ")}`] : [];
}
