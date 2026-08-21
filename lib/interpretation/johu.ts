import type { SajuResult } from "@/lib/calc/types";

export type Season = "spring" | "summer" | "autumn" | "winter";
export type JohuBalance = "cold" | "hot" | "balanced";

export interface JohuAnalysis {
  season: Season;
  seasonLabel: string;
  balance: JohuBalance;
  text: string;
}

const SEASON_LABEL: Record<Season, string> = {
  spring: "봄",
  summer: "여름",
  autumn: "가을",
  winter: "겨울",
};

/**
 * 조후(調候) — 명리학에서 사주의 "온도(한난조습)"를 보는 관점. 궁통보감(窮通寶鑑)에 근거한
 * 정교한 일간×월지 조후용신 일람표(120개 조합)는 원전 해석 자체가 유파마다 갈려 이 사이트
 * 에서는 채택하지 않는다 — 사용자 지침의 "충돌하는 정보는 버린다" 원칙에 따라, 여러 자료가
 * 공통으로 동의하는 가장 단순하고 확실한 원리만 반영한다:
 *   겨울생(해자축월)인데 원국에 화(火)가 전혀 없으면 → 사주가 차갑다(한랭)
 *   여름생(사오미월)인데 원국에 수(水)가 전혀 없으면 → 사주가 뜨겁다(조열)
 * saju.monthOrder.season은 실제 절기 계산(월지)을 기반으로 하므로 계절 판정 자체는 정확하다.
 */
export function computeJohu(saju: SajuResult): JohuAnalysis {
  const season = saju.monthOrder.season;
  const seasonLabel = SEASON_LABEL[season];

  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const e of [...saju.elements.stemElements, ...saju.elements.branchElements]) {
    counts[e] += 1;
  }

  if (season === "winter" && counts.fire === 0) {
    return {
      season,
      seasonLabel,
      balance: "cold",
      text: `${seasonLabel}(해자축월)에 태어났는데 원국에 화(火) 기운이 전혀 없어요. 명리학에서는 이런 경우를 사주가 '차다'고 봐요. 따뜻한 색, 사람, 환경을 의식적으로 곁에 두면 균형을 잡는 데 도움이 될 수 있어요.`,
    };
  }

  if (season === "summer" && counts.water === 0) {
    return {
      season,
      seasonLabel,
      balance: "hot",
      text: `${seasonLabel}(사오미월)에 태어났는데 원국에 수(水) 기운이 전혀 없어요. 명리학에서는 이런 경우를 사주가 '뜨겁다'고 봐요. 차분하고 유연한 환경, 휴식을 의식적으로 챙기면 균형을 잡는 데 도움이 될 수 있어요.`,
    };
  }

  return {
    season,
    seasonLabel,
    balance: "balanced",
    text: `${seasonLabel}에 태어난 사주예요. 계절 기운(조후) 자체의 치우침은 크지 않은 편이에요.`,
  };
}
