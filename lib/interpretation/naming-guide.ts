import namingExampleNamesJson from "@/data/naming-example-names.json";
import { computeFiveElementsBalance } from "./five-elements-balance";
import type { ElementId, Gender, SajuResult } from "@/lib/calc/types";

interface ElementNameExamples {
  chosung: string[];
  male: string[];
  female: string[];
}

const EXAMPLE_NAMES = namingExampleNamesJson as Record<ElementId, ElementNameExamples>;

const ELEMENT_LABEL: Record<ElementId, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const ELEMENT_ORDER: ElementId[] = ["wood", "fire", "earth", "metal", "water"];

export interface NamingGuideRecommendation {
  element: ElementId;
  label: string;
  count: number;
  chosung: string[];
  exampleNames: string[];
}

export interface NamingGuideResult {
  counts: Record<ElementId, number>;
  recommendations: NamingGuideRecommendation[];
}

/**
 * "음오행 작명" — 이름 첫 글자의 초성이 어느 오행에 속하는지로 사주에 부족한 기운을
 * 보완하는 전통 작명 방식 중 하나다(훈민정음 해례본 제자해의 아설순치후 오행 배속
 * 기준: 아음 ㄱㅋ=목, 설음 ㄴㄷㄹㅌ=화, 순음 ㅁㅂㅍ=토, 치음 ㅅㅈㅊ=금, 후음 ㅇㅎ=수).
 * 획수 성명학(81수리)이나 자원오행(한자 뜻)까지 종합하는 작명소도 많아, 이 결과는
 * 여러 작명 방식 중 하나의 참고 자료로만 활용하도록 안내한다.
 *
 * 원국 8글자(또는 시주 미상 시 6글자) 안에서 오행 개수가 가장 적은 것부터 최대
 * 2개까지 "보완하면 좋은 기운"으로 추천한다 — 이미 있는 계산(computeFiveElementsBalance)을
 * 재사용할 뿐 새로운 사주 계산은 하지 않는다.
 */
export function computeNamingGuide(saju: SajuResult, gender: Gender): NamingGuideResult {
  const { counts } = computeFiveElementsBalance(saju);
  const minCount = Math.min(...ELEMENT_ORDER.map((e) => counts[e]));
  const weakest = ELEMENT_ORDER.filter((e) => counts[e] === minCount).slice(0, 2);

  const recommendations: NamingGuideRecommendation[] = weakest.map((element) => {
    const examples = EXAMPLE_NAMES[element];
    return {
      element,
      label: ELEMENT_LABEL[element],
      count: counts[element],
      chosung: examples.chosung,
      exampleNames: examples[gender],
    };
  });

  return { counts, recommendations };
}
