export interface TarotSpreadPosition {
  label: string;
  /** "core"=뽑힌 카드의 정방향/역방향 본문, "note"=readings.love/money/career의 note 필드
   * (love=상대방 속마음, money=실천 팁, career=이직·실행 추천 시기 — lib/content/tarot-types.ts 참조) */
  field: "core" | "note";
}

export interface TarotTopic {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  positions: [TarotSpreadPosition, TarotSpreadPosition, TarotSpreadPosition];
  /** 있으면 카드의 기존 readings[key]를 그대로 쓰고, 없으면 주제 전용 해석 함수를 쓴다(예: 시험). */
  readingKey?: "love" | "money" | "career" | "health";
}

export const TAROT_TOPICS: TarotTopic[] = [
  {
    slug: "love",
    label: "연애운",
    emoji: "💕",
    description: "지금 내 연애의 흐름과 상대의 마음, 앞으로의 관계가 궁금할 때",
    positions: [
      { label: "나의 마음", field: "core" },
      { label: "상대의 마음", field: "note" },
      { label: "관계의 흐름", field: "core" },
    ],
    readingKey: "love",
  },
  {
    slug: "compat",
    label: "궁합",
    emoji: "💑",
    description: "썸이나 연인, 혹은 마음에 둔 그 사람과 나의 궁합이 궁금할 때",
    positions: [
      { label: "나", field: "core" },
      { label: "상대", field: "note" },
      { label: "우리의 궁합", field: "core" },
    ],
    readingKey: "love",
  },
  {
    slug: "exam",
    label: "시험·합격운",
    emoji: "📚",
    description: "시험, 면접, 자격증, 공모전 등 결과가 걸린 도전이 앞에 있을 때",
    positions: [
      { label: "지금의 준비 상태", field: "core" },
      { label: "방해 요소", field: "core" },
      { label: "결과와 조언", field: "core" },
    ],
  },
  {
    slug: "career",
    label: "취업·이직운",
    emoji: "💼",
    description: "취업 준비, 이직, 창업처럼 커리어의 다음 발걸음이 궁금할 때",
    positions: [
      { label: "지금의 흐름", field: "core" },
      { label: "실행 추천 시기", field: "note" },
      { label: "주의할 점", field: "core" },
    ],
    readingKey: "career",
  },
  {
    slug: "money",
    label: "금전운",
    emoji: "💰",
    description: "수입, 지출, 투자 등 돈의 흐름이 궁금할 때",
    positions: [
      { label: "지금의 재물 기운", field: "core" },
      { label: "실천 팁", field: "note" },
      { label: "앞으로의 흐름", field: "core" },
    ],
    readingKey: "money",
  },
];

export function getTarotTopic(slug: string): TarotTopic | undefined {
  return TAROT_TOPICS.find((t) => t.slug === slug);
}
