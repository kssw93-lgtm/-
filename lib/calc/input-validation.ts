import type { BirthInput } from "./types";

export class InputValidationError extends Error {}

/**
 * 계산 규칙서 03, 04번: 필수 입력 검증.
 * 시간 미상(hour === null)은 오류가 아니라 정상 케이스로 유지한다(시주 미확정).
 */
export function validateBirthInput(input: BirthInput): void {
  if (!Number.isInteger(input.year) || input.year < 1800 || input.year > 2300) {
    throw new InputValidationError("지원 범위(1800~2300년) 밖의 연도입니다.");
  }
  if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) {
    throw new InputValidationError("잘못된 월입니다.");
  }
  if (!Number.isInteger(input.day) || input.day < 1 || input.day > 31) {
    throw new InputValidationError("잘못된 일입니다.");
  }

  if (input.calendarType === "solar") {
    const daysInMonth = new Date(Date.UTC(input.year, input.month, 0)).getUTCDate();
    if (input.day > daysInMonth) {
      throw new InputValidationError("존재하지 않는 양력 날짜입니다.");
    }
  }

  if (input.hour !== null) {
    if (!Number.isInteger(input.hour) || input.hour < 0 || input.hour > 23) {
      throw new InputValidationError("잘못된 시간입니다.");
    }
    if (!Number.isInteger(input.minute) || input.minute < 0 || input.minute > 59) {
      throw new InputValidationError("잘못된 분입니다.");
    }
  }

  if (input.calendarType !== "lunar" && input.isLeapMonth) {
    throw new InputValidationError("양력 입력에는 윤달 여부를 사용할 수 없습니다.");
  }

  if (input.gender !== "male" && input.gender !== "female") {
    throw new InputValidationError("성별 값이 올바르지 않습니다.");
  }
}
