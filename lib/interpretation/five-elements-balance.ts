import fiveElementsBalanceJson from "@/data/five-elements-balance.json";
import type { ElementId, SajuResult } from "@/lib/calc/types";

const BALANCE = fiveElementsBalanceJson as Record<ElementId, { excess: string; deficient: string }>;
const ELEMENT_LABEL: Record<ElementId, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};
const ELEMENT_ORDER: ElementId[] = ["wood", "fire", "earth", "metal", "water"];

export interface FiveElementsBalance {
  counts: Record<ElementId, number>;
  excessElements: ElementId[];
  deficientElements: ElementId[];
  /** 과다·결핍 오행이 하나도 없으면 null — 균형 잡힌 원국이라 억지로 지어내지 않는다. */
  narrative: string | null;
}

/**
 * 원국 8글자(시주 미상 시 6글자) 안에서 오행이 3개 이상 쏠려 있거나(과다) 아예
 * 하나도 없는(결핍) 경우, 그게 성격·감정 기복·대인관계·컨디션 관리에 실제로 어떻게
 * 드러나는지 짚어준다. 이미 계산된 오행 배열(stemElements/branchElements)을 세기만
 * 할 뿐 새로운 계산은 없고, 건강 문항은 특정 질병을 예측하지 않고 생활 습관 조언
 * 수준으로만 서술한다.
 */
export function computeFiveElementsBalance(saju: SajuResult): FiveElementsBalance {
  const counts: Record<ElementId, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const e of [...saju.elements.stemElements, ...saju.elements.branchElements]) counts[e] += 1;

  const excessElements = ELEMENT_ORDER.filter((e) => counts[e] >= 3);
  const deficientElements = ELEMENT_ORDER.filter((e) => counts[e] === 0);

  if (excessElements.length === 0 && deficientElements.length === 0) {
    return { counts, excessElements, deficientElements, narrative: null };
  }

  const parts: string[] = [];
  for (const e of excessElements) {
    parts.push(`${ELEMENT_LABEL[e]} 기운이 원국에 ${counts[e]}개로 많은 편이에요. ${BALANCE[e].excess}`);
  }
  for (const e of deficientElements) {
    parts.push(`${ELEMENT_LABEL[e]} 기운은 원국에 하나도 없어요. ${BALANCE[e].deficient}`);
  }

  return { counts, excessElements, deficientElements, narrative: parts.join(" ") };
}
