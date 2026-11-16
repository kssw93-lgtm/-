export interface TarotSpreadPosition {
  label: string;
  /** "core"=뽑힌 카드의 정방향/역방향 본문, "note"=관계 성찰·실천 팁·행동 전 점검 사항 */
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
    description: "지금 내 연애 태도와 두 사람 사이의 흐름을 돌아보고 싶을 때",
    positions: [
      { label: "나의 마음", field: "core" },
      { label: "관계에서 상대와의 교류", field: "note" },
      { label: "관계의 흐름", field: "core" },
    ],
    guide: {
      intro:
        "연애 타로는 지금 내 마음, 관계에서 상대와 주고받는 모습, 두 사람 사이의 흐름을 카드 세 장으로 돌아보는 방식이에요. 상대의 실제 속마음을 알아내는 용도가 아니라, 내 태도와 대화에서 확인할 점을 생각하는 데 활용해요.",
      positionNotes: [
        "지금 내가 이 관계(또는 연애 자체)에 갖고 있는 감정과 태도예요.",
        "상대의 속마음을 단정하지 않고, 관계에서 확인하고 싶은 점이나 대화의 실마리를 돌아보는 자리예요.",
        "현재 관계에서 반복되는 흐름과 함께 바라는 방향을 생각해 보는 자리예요.",
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
        "궁합 타로는 나와 상대의 관계, 그리고 두 사람이 함께 만들 수 있는 상호작용을 카드 세 장으로 돌아봐요. 썸을 타는 사이, 연인, 마음에 둔 사람과의 관계를 가볍게 점검할 때 어울려요. 상대의 속마음을 확인하는 방법은 아니며, 생년월일로 계산하는 사주 궁합과 달리 카드 상징을 활용해요.",
      positionNotes: [
        "지금 관계에서 나의 모습과 태도예요.",
        "상대의 입장을 상상해 단정하기보다, 관계에서 직접 확인하고 싶은 점을 돌아보는 자리예요.",
        "두 사람이 함께할 때 편안한 점과 조율할 부분을 생각해 보는 자리예요.",
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
    label: "시험·목표 점검",
    emoji: "📚",
    description: "시험, 면접, 자격증, 공모전 등 결과가 걸린 도전이 앞에 있을 때",
    positions: [
      { label: "지금의 준비 상태", field: "core" },
      { label: "방해 요소", field: "core" },
      { label: "다음 준비 단계", field: "core" },
    ],
    guide: {
      intro:
        "시험·목표 타로는 시험, 면접, 자격증, 공모전처럼 도전을 앞두고 준비 상태와 방해 요소, 다음 행동을 카드 세 장으로 살펴봐요. 결과를 예측하는 용도가 아니라 남은 시간 동안 점검하거나 실천할 일을 정리하는 데 활용해요.",
      positionNotes: [
        "지금까지의 준비와 현재 상황을 돌아보는 자리예요.",
        "준비 과정에서 점검할 습관이나 방해 요소를 살펴보는 자리예요.",
        "결과가 아니라, 다음에 실천할 준비 단계를 정리하는 자리예요.",
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
      { label: "움직이기 전 점검할 기준", field: "note" },
      { label: "주의할 점", field: "core" },
    ],
    guide: {
      intro:
        "취업·이직운 타로는 커리어의 현재 상황, 움직이기 전 확인할 조건, 주의할 점을 카드 세 장으로 돌아봐요. 정해진 시기를 맞히기보다 취업 준비, 이직 고민, 창업 검토에 필요한 생각을 정리하는 용도로 쓸 수 있어요.",
      positionNotes: [
        "지금 내 커리어가 어떤 흐름에 있는지 보여줘요.",
        "이직이나 창업을 결정하기 전에 확인할 준비 상태와 현실 조건을 살펴보는 자리예요. 특정 시점을 예측하지 않아요.",
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
        "앞으로의 재정에 영향을 줄 수 있는 현실 조건을 점검해 보는 자리예요.",
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
