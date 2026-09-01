export interface TarotSymbol {
  name: string;
  description: string;
}

export interface TarotReading {
  title: string;
  upright: string;
  reversed: string;
  /** love=상대방 속마음, money=실천 팁, career=이직/실행 추천 시기 */
  note: string;
}

export interface TarotCardGuide {
  id: number;
  slug: string;
  nameKo: string;
  nameEn: string;
  number: string;
  element: "불(火)" | "물(水)" | "공기(風)" | "흙(土)";
  summary: string;
  keywords: {
    upright: string[];
    reversed: string[];
  };
  symbols: TarotSymbol[];
  readings: {
    love: TarotReading;
    money: TarotReading;
    career: TarotReading;
    health: TarotReading;
  };
  baekhoAdvice: string;
  actionItem: string;
}
