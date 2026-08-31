/**
 * timezone 영향 없이 "YYYY-MM-DD" 문자열을 날짜(UTC 자정 기준)로 파싱합니다.
 */
export function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 시작일과 종료일을 모두 포함한 일수를 반환합니다.
 */
export function inclusiveDaysBetween(start: Date, end: Date): number {
  const diff = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  return diff + 1;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export interface CalendarDuration {
  years: number;
  months: number;
  days: number;
}

/**
 * 두 날짜 사이의 기간을 "N년 N개월 N일" 형태로 계산합니다(달력 기준 차이).
 */
export function calendarDuration(start: Date, end: Date): CalendarDuration {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDate = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)
    );
    days += daysInMonth(
      prevMonthDate.getUTCFullYear(),
      prevMonthDate.getUTCMonth()
    );
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function formatCalendarDuration(duration: CalendarDuration): string {
  return `${duration.years}년 ${duration.months}개월 ${duration.days}일`;
}
