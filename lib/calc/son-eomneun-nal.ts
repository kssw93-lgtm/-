import lunarCalendarJson from "@/data/lunar-calendar/full-1950-2028.json";
import { SUPPORTED_BIRTH_YEAR_RANGE } from "./solar-terms";
import type { LunarToSolarRecord } from "./calendar-convert";

const LUNAR_RECORDS = lunarCalendarJson as LunarToSolarRecord[];

/** solarDate(YYYY-MM-DD) → 그날의 음력 일(day). 윤달이어도 "몇 번째 날"의 의미는
 * 같아 손없는날 판정에는 윤달 여부를 구분하지 않는다. */
const LUNAR_DAY_BY_SOLAR_DATE = new Map<string, number>(
  LUNAR_RECORDS.map((r) => [r.solarDate, r.lunarDay])
);

/**
 * 민속 신앙에서 "손(損)"은 날짜에 따라 동서남북을 옮겨 다니며 사람을 해코지한다는
 * 잡귀를 뜻하고, 음력 끝자리가 9 또는 0인 날(9·10·19·20·29·30일)은 손이 하늘로
 * 올라가 머무르지 않는다고 여겨 "손없는날"이라 부른다. 이사·결혼·개업처럼 손 타는
 * 걸 꺼리는 일을 잡을 때 전통적으로 선호되는 날짜다 — 과학적 근거가 아니라 민속
 * 신앙에 기반한 개념임을 페이지에 함께 명시한다.
 */
const SON_EOMNEUN_LUNAR_DAYS = new Set([9, 10, 19, 20, 29, 30]);

export function isSonEomneunNal(solarDate: { year: number; month: number; day: number }): boolean | null {
  const key = `${solarDate.year}-${String(solarDate.month).padStart(2, "0")}-${String(solarDate.day).padStart(2, "0")}`;
  const lunarDay = LUNAR_DAY_BY_SOLAR_DATE.get(key);
  if (lunarDay === undefined) return null; // 지원 범위 밖(1950~2028) — 판정 불가
  return SON_EOMNEUN_LUNAR_DAYS.has(lunarDay);
}

export interface SonEomneunNalEntry {
  solarDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  lunarDay: number;
}

const DAY_OF_WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 주어진 (연,월)의 손없는날 목록을 날짜순으로 반환한다. 지원 범위(1950~2028) 밖의
 * 달을 요청하면 빈 배열을 반환한다.
 */
export function getSonEomneunNalOfMonth(year: number, month: number): SonEomneunNalEntry[] {
  if (year < SUPPORTED_BIRTH_YEAR_RANGE.min || year > SUPPORTED_BIRTH_YEAR_RANGE.max) return [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const entries: SonEomneunNalEntry[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const lunarDay = LUNAR_DAY_BY_SOLAR_DATE.get(key);
    if (lunarDay !== undefined && SON_EOMNEUN_LUNAR_DAYS.has(lunarDay)) {
      const dow = DAY_OF_WEEK_KO[new Date(year, month - 1, day).getDay()];
      entries.push({ solarDate: key, dayOfWeek: dow, lunarDay });
    }
  }
  return entries;
}
