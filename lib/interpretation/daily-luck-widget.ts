import dailyLuckyItemJson from "@/data/daily-lucky-item.json";
import { computeDayPillar } from "@/lib/calc/day-pillar";
import { stemById } from "@/lib/calc/data";
import { buildBirthKey, hashSeed } from "./template-select";
import type { ElementId, SajuResult } from "@/lib/calc/types";

const DAILY_LUCK_ITEM = dailyLuckyItemJson as Record<ElementId, { color: string; direction: string }>;

export interface TodayLuckWidget {
  element: ElementId;
  color: string;
  direction: string;
  /** 1~45. 명리학적 근거가 있는 값이 아니라 재미로 보는 항목이라 사람+날짜별 결정론적 해시로 뽑는다. */
  number: number;
  dateLabel: string;
}

/**
 * "오늘의 행운 컬러·숫자·방향" — luck-color.ts(computeLuckColor)의 "원국에서 가장 부족한
 * 오행을 보완하는 색"과는 다른 개념이다. 그건 원국 자체가 평생 안 바뀌니 사람마다 영구히
 * 고정되는 게 정상이고, 여기서 다루는 건 "오늘 시점의 기운"이라 날짜가 바뀌면 함께 바뀌어야
 * 한다. cheongi-mini의 computeDailyLuckyItem과 동일한 방식(daily-fortune.ts가 오늘의 십신을
 * 뽑을 때 쓰는 것과 같은 "오늘 일진")을 재사용한다 — 새 계산 규칙이 아니다.
 *
 * 색·방향은 오늘 일진(day pillar)의 오행에 전해지는 전통 오행-방위 배속(daily-lucky-item.json:
 * 목=동/초록, 화=남/빨강, 토=중앙/노랑, 금=서/흰색, 수=북/검정)을 그대로 쓴다 — 같은 사람이라도
 * 날짜가 바뀌면 오늘 일진이 바뀌니 색/방향이 함께 바뀌고, 같은 날엔 항상 같은 값이 나온다.
 * 숫자는 사람 고유값(birthKey)+오늘 날짜를 해시해 1~45 사이에서 결정론적으로 뽑는다.
 */
export function computeTodayLuckWidget(saju: SajuResult, now: Date = new Date()): TodayLuckWidget {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  const todayPillar = computeDayPillar({ year: y, month: m, day: d });
  const element = stemById(todayPillar.stem).element;
  const { color, direction } = DAILY_LUCK_ITEM[element];

  const birthKey = buildBirthKey({
    year: saju.input.year,
    month: saju.input.month,
    day: saju.input.day,
    hour: saju.input.hour,
    minute: saju.input.minute,
    calendarType: saju.input.calendarType,
  });
  const number = (hashSeed(`${birthKey}|${y}-${m}-${d}|todayLuckyNumber`) % 45) + 1;

  return { element, color, direction, number, dateLabel: `${m}월 ${d}일` };
}
