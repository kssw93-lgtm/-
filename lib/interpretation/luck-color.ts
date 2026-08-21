import fiveElementLuck from "@/data/five-element-luck.json";
import type { ElementId, SajuResult } from "@/lib/calc/types";

const LUCK_TABLE = fiveElementLuck as Record<ElementId, { color: string; numbers: number[]; desc: string }>;

/** 오행 5개 중 하나가 비어 있을 때(0개) 우선 채택할 순서 — 동률 처리를 결정론적으로 고정 */
const TIE_BREAK_ORDER: ElementId[] = ["water", "wood", "fire", "metal", "earth"];

/**
 * 재미 요소인 행운의 컬러/숫자: 정식 명리학 용어(용신)는 아니지만, 원국에서 가장 부족한
 * 오행을 보완해주는 색/숫자를 안내한다는 점에서 "부족한 기운을 보완한다"는 명리학적 사고와
 * 맥을 같이 한다. 오행 숫자는 하도(河圖) 전통 배속(水1·6 火2·7 木3·8 金4·9 土5·10)을 사용한다.
 */
export function computeLuckColor(saju: SajuResult): { element: ElementId; color: string; numbers: number[]; desc: string } {
  const counts: Record<ElementId, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const e of [...saju.elements.stemElements, ...saju.elements.branchElements]) {
    counts[e] += 1;
  }

  let weakest: ElementId = TIE_BREAK_ORDER[0];
  let weakestCount = Infinity;
  for (const el of TIE_BREAK_ORDER) {
    if (counts[el] < weakestCount) {
      weakestCount = counts[el];
      weakest = el;
    }
  }

  return { element: weakest, ...LUCK_TABLE[weakest] };
}
