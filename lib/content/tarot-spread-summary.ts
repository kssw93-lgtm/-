import type { TarotCardGuide } from "./tarot-types";
import type { TarotTopic } from "./tarot-topics";

export type TarotOrientation = "upright" | "reversed";
export type TarotSummaryLocale = "ko" | "en";

export interface TarotSpreadCard {
  card: TarotCardGuide;
  orientation: TarotOrientation;
}

export interface TarotSpreadSummary {
  patterns: string[];
  reflectionQuestion: string;
  limitation: string;
}

type Suit = "wands" | "cups" | "swords" | "pentacles";

const SUIT_THEME: Record<Suit, { ko: string; en: string }> = {
  wands: {
    ko: "완드가 반복돼요. 의욕, 창의적인 시도, 실제 행동이 이번 조합의 두드러진 주제예요.",
    en: "Wands repeat in this spread. Initiative, creative effort, and taking action stand out as themes.",
  },
  cups: {
    ko: "컵이 반복돼요. 감정, 관계, 공감과 표현을 중심으로 카드의 자리를 함께 살펴보세요.",
    en: "Cups repeat in this spread. Consider how feelings, relationships, empathy, and expression connect across the positions.",
  },
  swords: {
    ko: "소드가 반복돼요. 생각, 대화, 판단과 경계 설정이 이번 조합에서 중요한 주제로 보여요.",
    en: "Swords repeat in this spread. Thought, communication, decisions, and boundaries are prominent themes.",
  },
  pentacles: {
    ko: "펜타클이 반복돼요. 시간·돈·기술처럼 현실에서 다룰 수 있는 자원과 꾸준한 실행을 살펴보세요.",
    en: "Pentacles repeat in this spread. Look at practical resources—such as time, money, and skills—and the value of steady effort.",
  },
};

const TOPIC_QUESTION: Record<TarotTopic["slug"], { ko: string; en: string }> = {
  love: {
    ko: "내 마음과 상대에 대한 추측을 구분하고, 대화로 확인할 수 있는 것은 무엇일까요?",
    en: "What can you separate from your assumptions about the other person and clarify through an honest conversation?",
  },
  compat: {
    ko: "두 사람의 차이 중 조율할 수 있는 부분과 서로 존중해야 할 부분은 무엇일까요?",
    en: "Which differences can you work through together, and which ones call for mutual respect?",
  },
  exam: {
    ko: "준비 상태와 방해 요소를 살펴본 뒤, 오늘 실천할 수 있는 한 가지는 무엇일까요?",
    en: "After considering your preparation and possible distractions, what is one useful step you can take today?",
  },
  career: {
    ko: "움직이기 전에 확인할 현실 조건과 지금 시작할 수 있는 작은 단계는 무엇일까요?",
    en: "What practical conditions should you check, and what small step could you begin now?",
  },
  money: {
    ko: "돈과 관련해 사실로 확인할 항목, 그리고 부담 없이 시작할 수 있는 정리 한 가지는 무엇일까요?",
    en: "What financial details can you verify, and what is one manageable step you can take to get organized?",
  },
};

const SUIT_BY_ID: Record<number, Suit> = {};
for (let id = 22; id <= 35; id += 1) SUIT_BY_ID[id] = "wands";
for (let id = 36; id <= 49; id += 1) SUIT_BY_ID[id] = "cups";
for (let id = 50; id <= 63; id += 1) SUIT_BY_ID[id] = "swords";
for (let id = 64; id <= 77; id += 1) SUIT_BY_ID[id] = "pentacles";

export function composeTarotSpreadSummary(
  topic: TarotTopic["slug"],
  picks: TarotSpreadCard[],
  locale: TarotSummaryLocale,
): TarotSpreadSummary {
  const majorCount = picks.filter(({ card }) => card.id <= 21).length;
  const reversedCount = picks.filter(({ orientation }) => orientation === "reversed").length;
  const suitCounts = new Map<Suit, number>();

  for (const { card } of picks) {
    const suit = SUIT_BY_ID[card.id];
    if (suit) suitCounts.set(suit, (suitCounts.get(suit) ?? 0) + 1);
  }

  const patterns: string[] = [];
  if (majorCount >= 2) {
    patterns.push(locale === "ko"
      ? `메이저 아르카나가 ${majorCount}장 나왔어요. 한 가지 사건의 결과보다, 이번 질문이 건드리는 큰 주제나 선택의 맥락을 천천히 살펴볼 수 있어요.`
      : `${majorCount} Major Arcana appear here. You might reflect on the broader theme or choice behind the question rather than treating the spread as a prediction about one event.`);
  } else if (majorCount === 0) {
    patterns.push(locale === "ko"
      ? "이번 조합은 마이너 아르카나 중심이에요. 일상의 대화, 습관, 자원처럼 구체적으로 살펴볼 수 있는 부분에 초점을 둘 수 있어요."
      : "This spread is made up of Minor Arcana. You may find it useful to focus on concrete parts of everyday life, such as conversations, habits, and resources.");
  } else {
    patterns.push(locale === "ko"
      ? "메이저 아르카나 한 장이 큰 주제를 비추고, 나머지 카드는 그 주제가 일상에서 드러나는 모습을 살펴보게 해요."
      : "One Major Arcana card highlights a broader theme, while the other cards can help you reflect on how it shows up in everyday life.");
  }

  const strongestSuit = [...suitCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (strongestSuit && strongestSuit[1] >= 2) {
    patterns.push(SUIT_THEME[strongestSuit[0]][locale]);
  } else if (suitCounts.size > 1) {
    patterns.push(locale === "ko"
      ? "마이너 카드의 수트가 나뉘어 있어요. 한 가지 방식으로 밀어붙이기보다 감정·생각·행동·현실 조건을 함께 살펴보세요."
      : "The Minor Arcana suits are varied. Consider feelings, thoughts, actions, and practical conditions together instead of relying on just one approach.");
  }

  if (reversedCount === 0) {
    patterns.push(locale === "ko"
      ? "역방향 카드는 없어요. 그래도 정방향을 무조건 좋은 결과로 볼 필요는 없고, 카드의 조언을 현재 상황에 맞게 적용해 보세요."
      : "No cards are reversed. Upright cards do not guarantee a favorable outcome; consider how their themes apply to your present situation.");
  } else if (reversedCount === 1) {
    patterns.push(locale === "ko"
      ? "역방향 카드 한 장은 해당 자리의 주제를 한 번 더 점검해 보라는 관점으로 읽을 수 있어요. 역방향이 나쁜 결과를 뜻하는 것은 아니에요."
      : "The single reversed card can invite a closer look at the theme in its position. A reversal does not mean a bad outcome.");
  } else {
    patterns.push(locale === "ko"
      ? `역방향 카드가 ${reversedCount}장 있어요. 전통적인 일부 해석에서는 막힘·과잉·내면화처럼 여러 방식으로 살피지만, 나쁨의 점수로 단정하지 마세요.`
      : `${reversedCount} cards are reversed. Some traditions read reversals as blocked, excessive, or more inward expressions; they are not a score of how bad things will be.`);
  }

  return {
    patterns,
    reflectionQuestion: TOPIC_QUESTION[topic][locale],
    limitation: locale === "ko"
      ? "이 총평은 카드의 반복 패턴을 묶은 참고 해석이에요. 카드 배열이 사실이나 미래를 증명하지 않으며, 실제 상황과 대화를 함께 살펴보세요."
      : "This summary groups recurring card patterns as a reflection aid. A spread cannot establish facts or prove what will happen; consider it alongside real-world information and conversations.",
  };
}
