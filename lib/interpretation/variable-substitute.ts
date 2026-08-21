import { stemById } from "@/lib/calc/data";
import type { StemId } from "@/lib/calc/types";

/**
 * 매핑규칙서 05번: {이름} 등 치환. 이름 미입력 시 "당신"으로 대체.
 */
export function substituteVariables(
  text: string,
  vars: { name?: string; dayStem?: StemId }
): string {
  const name = vars.name?.trim() || "당신";
  let result = text.replaceAll("{이름}", name);

  if (vars.dayStem) {
    const stem = stemById(vars.dayStem);
    result = result.replaceAll("{일간_한자}", stem.hanja);
    result = result.replaceAll("{일간_한글}", `${stem.reading}${elementReading(stem.element)}`);
  }

  return result;
}

function elementReading(element: string): string {
  const map: Record<string, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
  return map[element] ?? "";
}
