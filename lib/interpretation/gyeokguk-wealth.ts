import gyeokgukWealthJson from "@/data/gyeokguk-wealth.json";
import type { TenGod } from "@/lib/calc/types";

export interface GyeokgukWealthStyle {
  style: string;
  desc: string;
}

const GYEOKGUK_WEALTH = gyeokgukWealthJson as Record<TenGod, GyeokgukWealthStyle>;

/**
 * 재물운 전용 — 이미 계산된 격국(월지 본기와 일간의 십신 관계, 10종)을 그대로 재사용해
 * 격국별 재물 스타일을 매칭한다. 정재격=착실한 저축형, 편재격=기회 포착형처럼 전통
 * 명리서에서도 흔히 다루는 격국-재물 대응을 그대로 썼다. 새 계산은 없다.
 */
export function getGyeokgukWealthStyle(tenGod: TenGod): GyeokgukWealthStyle {
  return GYEOKGUK_WEALTH[tenGod];
}
