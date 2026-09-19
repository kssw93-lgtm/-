export interface TarotSpreadPosition {
  label: string;
  /** "core"=뽑힌 카드의 정방향/역방향 본문, "note"=readings.love/money/career의 note 필드
   * (love=상대방 속마음, money=실천 팁, career=이직·실행 추천 시기 — lib/content/tarot-types.ts 참조) */
  field: "core" | "note";
}

/** 카드를 뽑기 전에도 페이지에 읽을 거리가 있도록 보여주는 정적 안내문. */
export interface TarotTopicGuide {
  intro: string;
  /** positions와 같은 순서로, 각 자리가 무엇을 보여주는지 한 줄 설명. */
  positionNotes: [string, string, string];
  tips: string[];
}

export interface TarotTopic {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  positions: [TarotSpreadPosition, TarotSpreadPosition, TarotSpreadPosition];
  guide: TarotTopicGuide;
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
    guide: {
      intro:
        "연애 타로는 지금 내 마음, 상대의 마음, 그리고 두 사람 사이의 흐름을 카드 세 장으로 나눠 살펴보는 방식이에요. 만나는 상대가 있을 때는 물론, 아직 인연이 없는 상태에서 내 연애 태도를 돌아볼 때도 쓸 수 있어요.",
      positionNotes: [
        "지금 내가 이 관계(또는 연애 자체)에 갖고 있는 감정과 태도예요.",
        "상대가 나를 어떻게 느끼고 있는지에 대한 힌트예요. 이 자리는 카드가 뒤집혔는지와 관계없이 상대의 속마음을 한 줄로 풀이해요.",
        "두 사람의 관계가 앞으로 어떤 방향으로 흘러갈지를 보여줘요.",
      ],
      tips: [
        "'그 사람이 나를 좋아할까?'보다 '지금 이 관계에서 내가 할 수 있는 건 뭘까?'처럼 내가 움직일 수 있는 쪽으로 질문을 잡으면 해석을 활용하기 좋아요.",
        "카드는 지금의 분위기를 보여줄 뿐이에요. 마음에 들지 않는 결과가 나와도 같은 질문으로 계속 다시 뽑기보다, 나온 조언을 현실에서 어떻게 쓸지 생각해 보세요.",
      ],
    },
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
    guide: {
      intro:
        "궁합 타로는 나와 상대, 그리고 두 사람이 만들어내는 조합을 카드 세 장으로 살펴봐요. 썸을 타는 사이, 연인, 마음에 둔 사람과의 관계를 가볍게 점검할 때 어울려요. 생년월일로 계산하는 사주 궁합과 달리, 카드가 가진 상징에 기대는 풀이예요.",
      positionNotes: [
        "지금 관계에서 나의 모습과 태도예요.",
        "상대가 이 관계를 어떻게 느끼는지에 대한 힌트예요. 카드 방향과 관계없이 상대의 마음을 한 줄로 풀이해요.",
        "두 사람이 함께 있을 때 만들어지는 분위기와 맞물림을 보여줘요.",
      ],
      tips: [
        "궁합은 '좋다/나쁘다'로 가르기보다 어떤 부분이 잘 맞고 어떤 부분에서 조율이 필요한지를 보는 용도로 쓰는 게 좋아요.",
        "생년월일을 기준으로 한 궁합이 궁금하다면 홈 화면의 사주 궁합도 함께 이용해 보세요.",
      ],
    },
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
    guide: {
      intro:
        "시험·합격운 타로는 시험, 면접, 자격증, 공모전처럼 결과가 걸린 도전을 앞두고 지금의 준비 상태와 방해 요소, 결과에 대한 조언을 카드 세 장으로 살펴봐요. 합격 여부를 맞히는 용도라기보다, 남은 시간 동안 무엇에 힘을 실을지 정리하는 데 쓰기 좋아요.",
      positionNotes: [
        "지금까지의 준비와 컨디션이 어떤 상태인지 보여줘요.",
        "결과에 걸림돌이 될 수 있는 습관이나 마음가짐을 짚어줘요.",
        "남은 기간에 취하면 좋은 태도와 조언이에요.",
      ],
      tips: [
        "카드가 좋게 나와도 준비를 대신해 주지는 않아요. 마지막 점검을 위한 응원 정도로 받아들이세요.",
        "불안이 클 때는 결과를 걱정하기보다 '오늘 할 수 있는 일 하나'를 정하는 데 카드를 활용해 보세요.",
      ],
    },
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
    guide: {
      intro:
        "취업·이직운 타로는 커리어의 현재 흐름, 움직이기 좋은 시기, 조심할 점을 카드 세 장으로 살펴봐요. 취업 준비, 이직 고민, 창업 검토처럼 방향을 정해야 할 때 생각을 정리하는 용도로 쓸 수 있어요.",
      positionNotes: [
        "지금 내 커리어가 어떤 흐름에 있는지 보여줘요.",
        "이직이나 실행에 옮기기 좋은 시기에 대한 힌트예요. 카드 방향과 관계없이 한 줄로 풀이돼요.",
        "움직이기 전에 조심하거나 점검해야 할 부분이에요.",
      ],
      tips: [
        "'이 회사에 붙을까?'처럼 결과를 묻기보다 '지금 내가 준비해야 할 건 뭘까?'처럼 물으면 해석이 훨씬 실용적이에요.",
        "큰 결정은 카드 한 장에 기대지 말고, 연봉·근무 조건 같은 현실적인 기준과 함께 판단하세요.",
      ],
    },
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
    guide: {
      intro:
        "금전운 타로는 지금의 재물 기운, 실천해 볼 만한 팁, 앞으로의 흐름을 카드 세 장으로 살펴봐요. 수입과 지출을 점검하거나 새로운 소비·투자를 고민할 때 마음을 정리하는 참고로 쓸 수 있어요.",
      positionNotes: [
        "지금의 돈 흐름과 씀씀이의 기운이에요.",
        "당장 실천해 볼 수 있는 행동 팁이에요. 카드 방향과 관계없이 한 줄로 풀이돼요.",
        "앞으로 재물운이 어떤 방향으로 이어질지를 보여줘요.",
      ],
      tips: [
        "타로는 투자 종목이나 수익을 알려주지 않아요. 큰돈이 오가는 결정은 반드시 실제 수치와 전문가 조언을 기준으로 하세요.",
        "카드를 지출 습관을 돌아보는 계기로 삼을 때 가장 실속 있게 쓸 수 있어요.",
      ],
    },
    readingKey: "money",
  },
];

export function getTarotTopic(slug: string): TarotTopic | undefined {
  return TAROT_TOPICS.find((t) => t.slug === slug);
}
