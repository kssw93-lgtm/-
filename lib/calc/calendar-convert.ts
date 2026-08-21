import { InputValidationError } from "./input-validation";
import type { BirthInput } from "./types";

export interface LunarToSolarRecord {
  solarDate: string; // YYYY-MM-DD
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

/**
 * 계산 규칙서 06, 07번: 음력은 임의 산술 공식으로 변환하지 않고
 * 검증된 음양력 데이터 조회로만 변환한다.
 *
 * 아직 전체 연도 범위의 KASI 음양력 데이터가 수집되지 않았으므로,
 * 이 소스는 /data/lunar-calendar/sample.json 에 존재하는 날짜만 변환할 수 있다.
 * 없는 날짜는 임의로 계산하지 않고 명시적으로 오류를 던진다(69번 "외부 데이터 직접 의존 금지" +
 * 76번 DATA-002 "목 데이터를 Production으로 착각해 배포 금지" 원칙에 따름).
 */
export interface LunarCalendarSource {
  lunarToSolar(year: number, month: number, day: number, isLeapMonth: boolean): { year: number; month: number; day: number };
}

export class UnavailableLunarCalendarSource implements LunarCalendarSource {
  private byKey: Map<string, LunarToSolarRecord>;

  constructor(records: LunarToSolarRecord[]) {
    this.byKey = new Map(
      records.map((r) => [`${r.lunarYear}-${r.lunarMonth}-${r.lunarDay}-${r.isLeapMonth}`, r])
    );
  }

  lunarToSolar(year: number, month: number, day: number, isLeapMonth: boolean) {
    const key = `${year}-${month}-${day}-${isLeapMonth}`;
    const rec = this.byKey.get(key);
    if (!rec) {
      throw new InputValidationError(
        "이 음력 날짜에 대한 검증된 역법 데이터가 아직 준비되지 않았습니다. 양력으로 입력해 주세요."
      );
    }
    const [y, m, d] = rec.solarDate.split("-").map(Number);
    return { year: y, month: m, day: d };
  }
}

export interface NormalizedCalendarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * 양력/음력 입력을 표준 양력 날짜로 정규화한다 (계산 규칙서 06번).
 */
export function normalizeToSolarDate(
  input: BirthInput,
  lunarSource: LunarCalendarSource
): NormalizedCalendarDate {
  if (input.calendarType === "solar") {
    return { year: input.year, month: input.month, day: input.day };
  }
  return lunarSource.lunarToSolar(input.year, input.month, input.day, input.isLeapMonth);
}
