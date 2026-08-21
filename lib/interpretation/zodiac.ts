import starSignsJson from "@/data/star-signs.json";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";
import type { BranchId, SajuResult } from "@/lib/calc/types";

export interface StarSign {
  id: string;
  name: string;
  hanja: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  symbol: string;
  text: string;
}

export interface ZodiacAnimal {
  branch: BranchId;
  animal: string;
  hanja: string;
  text: string;
}

const STAR_SIGNS = starSignsJson as StarSign[];
const ZODIAC_ANIMALS = zodiacAnimalsJson as ZodiacAnimal[];

/**
 * 서양 별자리는 명리학과 무관한 별개 체계(태양의 황도상 위치 기준)이며, 실제 양력 생일로
 * 결정한다. 음력 입력이었어도 saju.solarBirthDate(변환된 양력)를 사용해 정확히 계산한다.
 */
export function getStarSign(month: number, day: number): StarSign {
  // 염소자리(12/22~1/19)처럼 연도를 넘어가는 경우도 동일한 식으로 처리된다:
  // "시작월이면 시작일 이후" 이거나 "종료월이면 종료일 이하"이면 해당 별자리.
  const found = STAR_SIGNS.find(
    (s) => (month === s.startMonth && day >= s.startDay) || (month === s.endMonth && day <= s.endDay)
  );
  if (!found) throw new Error(`별자리를 찾을 수 없습니다: ${month}/${day}`);
  return found;
}

export function getStarSignForSaju(saju: SajuResult): StarSign {
  return getStarSign(saju.solarBirthDate.month, saju.solarBirthDate.day);
}

/**
 * 띠는 년주의 지지(year_pillar.branch)를 그대로 사용한다 — 이미 입춘 절입 기준으로
 * 정확하게 계산된 값이라, 단순히 "양력 1월 1일"로 끊는 일반적인 무료 띠 계산기보다 정확하다.
 */
export function getZodiacAnimalForSaju(saju: SajuResult): ZodiacAnimal {
  const branch = saju.pillars.yearPillar.branch;
  const found = ZODIAC_ANIMALS.find((z) => z.branch === branch);
  if (!found) throw new Error(`띠를 찾을 수 없습니다: ${branch}`);
  return found;
}
