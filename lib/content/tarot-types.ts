export interface TarotSymbol {
  name: string;
  description: string;
}

export interface TarotReading {
  title: string;
  upright: string;
  reversed: string;
  /** love=관계를 돌아보는 관점, money=실천 팁, career=행동 전 점검 사항 */
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
