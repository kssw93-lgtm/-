import { computeLuckColor } from "./luck-color";
import type { ElementId, SajuResult } from "@/lib/calc/types";

export interface MeetingTiming {
  dayOfWeek: string;
  dayReason: string;
  place: string;
  placeReason: string;
}

/**
 * 한국어 요일 이름(화·수·목·금·토)은 화성·수성·목성·금성·토성, 즉 오행(화수목금토)에서
 * 그대로 유래했다 — 오행별 요일 대응은 새로 지어낸 게 아니라 요일 이름 자체의 어원이다.
 * 원국에서 가장 부족한 오행(행운의 컬러와 같은 기준)을 보완해주는 요일을 추천한다.
 */
const DAY_BY_ELEMENT: Record<ElementId, { day: string; reason: string }> = {
  wood: { day: "목요일", reason: "목(木) 기운을 보완해주는 요일이에요. 새로운 사람을 만나거나 관계를 한 걸음 넓혀보기 좋은 날이에요." },
  fire: { day: "화요일", reason: "화(火) 기운을 보완해주는 요일이에요. 밝고 적극적인 에너지가 필요할 때 좋은 날이에요." },
  earth: { day: "토요일", reason: "토(土) 기운을 보완해주는 요일이에요. 안정적이고 편안한 분위기 속에서 관계를 다지기 좋은 날이에요." },
  metal: { day: "금요일", reason: "금(金) 기운을 보완해주는 요일이에요. 마음을 정리하고 결정을 내리기 좋은 날이에요." },
  water: { day: "수요일", reason: "수(水) 기운을 보완해주는 요일이에요. 차분하게 진심을 전하기 좋은 날이에요." },
};

const PLACE_BY_ELEMENT: Record<ElementId, { place: string; reason: string }> = {
  wood: { place: "공원·숲·캠퍼스처럼 초록빛이 있는 곳", reason: "목(木) 기운을 보완해주는 장소예요. 편안하게 걸으며 대화하기 좋은 분위기가 관계를 부드럽게 열어줘요." },
  fire: { place: "라이브 공연장·페스티벌·트렌디한 카페처럼 활기찬 곳", reason: "화(火) 기운을 보완해주는 장소예요. 밝은 에너지가 있는 곳에서 매력이 더 잘 드러나요." },
  earth: { place: "전통찻집·소규모 모임·익숙한 동네처럼 아늑한 곳", reason: "토(土) 기운을 보완해주는 장소예요. 편안하고 안정적인 분위기가 진솔한 대화를 이끌어내요." },
  metal: { place: "갤러리·전시회·서점처럼 정돈되고 세련된 곳", reason: "금(金) 기운을 보완해주는 장소예요. 차분하고 감각적인 공간이 좋은 인상을 남겨요." },
  water: { place: "강변·바닷가·조용한 재즈바처럼 물이 보이는 곳", reason: "수(水) 기운을 보완해주는 장소예요. 차분한 분위기가 마음을 여는 데 도움이 돼요." },
};

export function computeMeetingTiming(saju: SajuResult): MeetingTiming {
  const { element } = computeLuckColor(saju);
  const d = DAY_BY_ELEMENT[element];
  const p = PLACE_BY_ELEMENT[element];
  return { dayOfWeek: d.day, dayReason: d.reason, place: p.place, placeReason: p.reason };
}
