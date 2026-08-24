import elementCareerJson from "@/data/element-career.json";
import starElementCareerJson from "@/data/star-element-career.json";
import { branchById } from "@/lib/calc/data";
import type { BranchId, ElementId } from "@/lib/calc/types";
import { STAR_SIGN_ELEMENT, type StarElementId } from "./zodiac-compat";

export interface CareerFit {
  fields: string;
  desc: string;
}

const ELEMENT_CAREER = elementCareerJson as Record<ElementId, CareerFit>;
const STAR_ELEMENT_CAREER = starElementCareerJson as Record<StarElementId, CareerFit>;

export interface ZodiacCareerFit {
  animal: CareerFit;
  star: CareerFit;
}

/**
 * 띠·별자리로 보는 직업 적성 — 띠는 그 지지가 속한 오행(이미 saju.elements 계산에 쓰이는
 * branchById(branch).element)을, 별자리는 서양 점성술의 4원소 배속을 그대로 재사용해
 * 직업군을 매칭한다. 오행별 성향(목=성장, 화=표현, 토=안정, 금=원칙, 수=유연)은 이미
 * data/five-element-luck.json(행운의 컬러) 등 사이트 전반에서 쓰는 것과 동일한 배속이라
 * 카테고리마다 다른 이야기를 하지 않는다.
 */
export function getZodiacCareerFit(branch: BranchId, starSignId: string): ZodiacCareerFit {
  const element = branchById(branch).element;
  const starElement = STAR_SIGN_ELEMENT[starSignId];
  return {
    animal: ELEMENT_CAREER[element],
    star: STAR_ELEMENT_CAREER[starElement],
  };
}
