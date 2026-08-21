import type { SajuResult, TenGod } from "@/lib/calc/types";

export type PatternGroup = "bigeob" | "siksang" | "jaeseong" | "gwanseong" | "inseong";

export const GROUP_BY_TEN_GOD: Record<TenGod, PatternGroup> = {
  bigyeon: "bigeob",
  geopjae: "bigeob",
  siksin: "siksang",
  sanggwan: "siksang",
  jeongjae: "jaeseong",
  pyeonjae: "jaeseong",
  jeonggwan: "gwanseong",
  pyeongwan: "gwanseong",
  jeongin: "inseong",
  pyeonin: "inseong",
};

/** 동률 시 우선순위 (매핑규칙서 01번) */
const TIE_BREAK_ORDER: PatternGroup[] = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];

/**
 * 매핑규칙서 01, 01-1번: 십신 강세 유형(5종) 추출.
 * hour_pillar가 null이면 시주/시지 지장간은 SajuResult 계산 단계에서 이미 제외되어 있으므로
 * (lib/calc/ten-gods.ts는 hourPillar가 없으면 관련 항목을 생성하지 않음) 별도 분기 없이 그대로 집계한다.
 */
export function extractDominantTenGodGroup(saju: SajuResult): PatternGroup {
  const counts: Record<PatternGroup, number> = {
    bigeob: 0,
    siksang: 0,
    jaeseong: 0,
    gwanseong: 0,
    inseong: 0,
  };

  for (const tg of saju.tenGods.stems) {
    if (tg) counts[GROUP_BY_TEN_GOD[tg]] += 1;
  }
  for (const hiddenList of Object.values(saju.tenGods.hiddenStems)) {
    for (const h of hiddenList) {
      counts[GROUP_BY_TEN_GOD[h.tenGod]] += 1;
    }
  }

  let best: PatternGroup = TIE_BREAK_ORDER[0];
  let bestCount = -1;
  for (const group of TIE_BREAK_ORDER) {
    if (counts[group] > bestCount) {
      bestCount = counts[group];
      best = group;
    }
  }
  return best;
}
