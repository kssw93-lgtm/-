import gyeokgukCareerJson from "@/data/gyeokguk-career.json";
import type { TenGod } from "@/lib/calc/types";

export interface GyeokgukCareerFit {
  fitField: string;
  desc: string;
}

const GYEOKGUK_CAREER = gyeokgukCareerJson as Record<TenGod, GyeokgukCareerFit>;

/**
 * 직업운 전용 — 이미 계산된 격국(월지 본기와 일간의 십신 관계, 10종)을 그대로 재사용해
 * 격국별 직업 적성을 매칭한다. 정관격=관리직, 편재격=영업·사업처럼 전통 명리서에서도
 * 흔히 다루는 격국-직업 대응을 그대로 썼다. 새 계산은 없다.
 */
export function getGyeokgukCareerFit(tenGod: TenGod): GyeokgukCareerFit {
  return GYEOKGUK_CAREER[tenGod];
}
