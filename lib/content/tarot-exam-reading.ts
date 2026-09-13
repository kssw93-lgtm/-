import type { TarotCardGuide } from "./tarot-types";

/**
 * 78장 카드에 시험·합격운 전용 필드를 전부 새로 쓰는 대신, 카드 고유의 summary(각 카드마다
 * 다른 문장)에 시험 맥락의 짧은 코멘트를 이어붙이는 방식을 쓴다. 코멘트는 카드 id로 순환
 * 선택해 같은 정방향/역방향이라도 문장이 획일적으로 반복되지 않게 한다.
 */
const UPRIGHT_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `지금은 '${k1}'의 기운이 강하니, 그동안 쌓아온 노력이 결과로 이어질 가능성이 높아요.`,
  (k1, k2) => `'${k1}·${k2}'의 흐름이 시험장에서 좋은 집중력으로 나타날 수 있어요.`,
  (k1) => `준비한 만큼 자신감 있게 임하면 '${k1}'의 기운이 힘을 실어줄 거예요.`,
  (_k1, k2) => `'${k2}'의 기세를 타고 있으니, 막판까지 페이스를 유지하는 게 중요해요.`,
  (k1) => `지금 이 순간 '${k1}'의 기운이 시험 결과에도 긍정적인 신호로 작용해요.`,
];

const REVERSED_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `'${k1}'의 흐름 때문에 집중이 흐트러지기 쉬우니 마지막 점검을 다시 해보세요.`,
  (_k1, k2) => `'${k2}'의 기운을 조심해야 해요 — 컨디션 관리나 시간 배분에 신경 쓰세요.`,
  (k1) => `'${k1}'의 기운이 결과를 갉아먹지 않도록, 자만보다는 꼼꼼한 재확인이 필요해요.`,
  (_k1, k2) => `'${k2}'의 영향으로 실수가 나올 수 있으니 서두르지 말고 차분히 풀어가세요.`,
  (k1) => `지금은 '${k1}'의 흐름을 경계할 때예요 — 계획보다 늦어지고 있다면 우선순위를 다시 정하세요.`,
];

export function composeExamReading(card: TarotCardGuide, orientation: "upright" | "reversed"): string {
  const keywords = card.keywords[orientation];
  const k1 = keywords[0];
  const k2 = keywords[1] ?? keywords[0];
  const spins = orientation === "upright" ? UPRIGHT_SPINS : REVERSED_SPINS;
  const spin = spins[card.id % spins.length];
  return `${card.summary} ${spin(k1, k2)}`;
}
