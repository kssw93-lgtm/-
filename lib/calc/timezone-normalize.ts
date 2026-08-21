import { KST_HISTORY } from "./data";
import type { NormalizedCalendarDate } from "./calendar-convert";

/**
 * 계산 규칙서 09, 10번 + 데이터 테이블 82번(대한민국 표준시 변경 이력).
 *
 * 사용자가 입력한 "그 시절의 대한민국 표준시(+서머타임)" 기준 시각을
 * 현재 기준 UTC로 정규화한 뒤, 다시 UTC+09:00(Asia/Seoul, 현재 기준)
 * 표기로 환산한 epoch millis를 반환한다.
 *
 * 진태양시(true_solar_time)는 v2.1 기준 기본값 false(적용 안 함)이므로
 * 본 모듈에서는 다루지 않는다(계산 규칙서 10번).
 */
export interface NormalizeTimeInput extends NormalizedCalendarDate {
  hour: number | null;
  minute: number;
}

export interface NormalizedInstant {
  /** 절기 비교 등에 사용할 UTC epoch millis. hour가 null이면 null. */
  utcMillis: number | null;
}

function findMeridianOffsetMinutes(dateStr: string): number {
  const period = KST_HISTORY.meridianPeriods.find((p) => {
    const afterStart = dateStr >= p.periodStart;
    const beforeEnd = p.periodEnd === null || dateStr <= p.periodEnd;
    return afterStart && beforeEnd;
  });
  if (!period) {
    throw new Error(`표준시 이력 데이터에 ${dateStr}에 해당하는 구간이 없습니다.`);
  }
  return period.utcOffsetMinutes;
}

/**
 * 서머타임 적용 여부를 로컬(naive) 시각과 82-2 데이터의 KST(UTC+9) 기준 로컬시각을 비교해 판정한다.
 * 1948~1960년대 구간은 원 데이터가 UTC+08:30 기준(당시 표준시)으로 표기되어 있으므로,
 * 82-3 절차대로 먼저 UTC+09:00 절대시각으로 환산한 뒤 비교한다.
 */
function isWithinDst(utcMillisAtAssumedOffset: number, year: number): { active: boolean; offsetMinutes: number } {
  const dst = KST_HISTORY.daylightSavingPeriods.find((d) => d.year === year);
  if (!dst) return { active: false, offsetMinutes: 0 };
  const startMs = Date.parse(dst.startLocal);
  const endMs = Date.parse(dst.endLocal);
  const active = utcMillisAtAssumedOffset >= startMs && utcMillisAtAssumedOffset < endMs;
  return { active, offsetMinutes: active ? dst.offsetMinutes : 0 };
}

/**
 * 출생 시각을 정규화한다. hour가 null이면(출생시간 모름) 날짜만 정규화 대상이며 utcMillis는 null.
 */
export function normalizeBirthInstant(input: NormalizeTimeInput): NormalizedInstant {
  if (input.hour === null) {
    return { utcMillis: null };
  }

  const dateStr = `${String(input.year).padStart(4, "0")}-${String(input.month).padStart(2, "0")}-${String(input.day).padStart(2, "0")}`;
  const baseOffsetMinutes = findMeridianOffsetMinutes(dateStr);

  // 1차: 당시 기준 경선 오프셋으로 가정하고 UTC 절대시각 산출
  const naiveUtcMillis = Date.UTC(
    input.year,
    input.month - 1,
    input.day,
    input.hour,
    input.minute
  ) - baseOffsetMinutes * 60_000;

  // 2차: 해당 연도가 서머타임 구간이면 -1시간 역보정(82-3)
  const { active, offsetMinutes: dstOffsetMinutes } = isWithinDst(naiveUtcMillis + baseOffsetMinutes * 60_000, input.year);
  const correctedUtcMillis = active ? naiveUtcMillis - dstOffsetMinutes * 60_000 : naiveUtcMillis;

  return { utcMillis: correctedUtcMillis };
}

/** 현재 기준 KST(UTC+9)로 표기 변환 시 사용하는 상수 */
export const CURRENT_KST_OFFSET_MINUTES = 540;
