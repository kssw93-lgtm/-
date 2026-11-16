import type { TarotCardGuide } from "./tarot-types";
import { localizeEnglishText } from "@/lib/i18n/english-content";

type Locale = "ko" | "en";

const UPRIGHT_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `이번 카드의 '${k1}'를 현재 준비에 대입해 보세요. 지금까지 이어온 점검을 차분히 계속하는 데 도움이 될 수 있어요.`,
  (k1, k2) => `'${k1}·${k2}'를 답안이나 면접에서 어떻게 보여줄지 미리 정리해 보세요.`,
  (k1) => `준비한 내용을 차분히 전달하는 연습에 '${k1}'를 활용해 보세요.`,
  (_k1, k2) => `'${k2}'와 관련된 강점을 살릴 수 있도록 남은 범위와 시간을 현실적으로 나눠 보세요.`,
  (k1) => `'${k1}'를 결과 예측이 아니라 현재 준비를 점검할 단서로 사용해 보세요.`,
];

const REVERSED_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `'${k1}'와 관련해 마지막 점검 목록에서 빠진 항목이 있는지 살펴보세요.`,
  (_k1, k2) => `'${k2}'와 관련해 컨디션이나 시간 배분을 다시 확인해 보세요.`,
  (k1) => `'${k1}'의 약점을 탓하기보다 답안·서류·준비물 중 확인할 부분을 찾아보세요.`,
  (_k1, k2) => `'${k2}'를 의식해 서두르지 말고, 문제를 한 단계씩 검토해 보세요.`,
  (k1) => `계획이 예상과 다르다면 '${k1}'를 기준으로 우선순위를 다시 정해 보세요.`,
];

const EN_UPRIGHT_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `Use “${k1}” as a prompt to review your current preparation. It may help you continue the checks you have already started.`,
  (k1, k2) => `Plan how you could demonstrate “${k1}” and “${k2}” in an answer or interview.`,
  (k1) => `Use “${k1}” as a cue to practice presenting what you have prepared calmly.`,
  (_k1, k2) => `Make a realistic plan for the remaining material and time, drawing on the strength represented by “${k2}.”`,
  (k1) => `Treat “${k1}” as a prompt to review your preparation, not as a prediction of the result.`,
];

const EN_REVERSED_SPINS: Array<(k1: string, k2: string) => string> = [
  (k1) => `Use “${k1}” as a cue to check whether anything is missing from your final review list.`,
  (_k1, k2) => `Review your condition and time plan in light of “${k2}.”`,
  (k1) => `Rather than blaming yourself for a weakness linked to “${k1},” check your answers, documents, or materials for anything that needs attention.`,
  (_k1, k2) => `Keep “${k2}” in mind, take your time, and work through each question one step at a time.`,
  (k1) => `If your plan changes, use “${k1}” as a prompt to revisit your priorities.`,
];

/** Build a card-specific study prompt without predicting pass/fail outcomes. */
export function composeExamReading(card: TarotCardGuide, orientation: "upright" | "reversed", locale: Locale = "ko"): string {
  const keywords = card.keywords[orientation];
  const rawK1 = keywords[0];
  const rawK2 = keywords[1] ?? rawK1;
  const k1 = locale === "en" ? localizeEnglishText(rawK1) : rawK1;
  const k2 = locale === "en" ? localizeEnglishText(rawK2) : rawK2;
  const spins = orientation === "upright"
    ? (locale === "en" ? EN_UPRIGHT_SPINS : UPRIGHT_SPINS)
    : (locale === "en" ? EN_REVERSED_SPINS : REVERSED_SPINS);
  const spin = spins[card.id % spins.length];
  const summary = locale === "en" ? localizeEnglishText(card.summary) : card.summary;
  return `${summary} ${spin(k1, k2)}`;
}
