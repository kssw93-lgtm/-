const WON_FORMATTER = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 0,
});

/**
 * 원 단위로 반올림한 뒤 천 단위 구분기호와 "원"을 붙여 표시합니다.
 * 예: 12345678 -> "12,345,678원"
 */
export function formatWon(amount: number): string {
  const rounded = Math.round(amount);
  return `${WON_FORMATTER.format(rounded)}원`;
}

/**
 * 천 단위 구분기호만 붙입니다("원" 없이). 입력 필드 표시용입니다.
 */
export function formatNumberWithComma(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  return WON_FORMATTER.format(Math.round(amount));
}

/**
 * 사용자가 입력한 문자열(콤마 포함 가능)을 숫자로 변환합니다.
 * 숫자가 아닌 문자는 제거하고, 빈 문자열이면 NaN을 반환합니다.
 */
export function parseCurrencyInput(value: string): number {
  const digitsOnly = value.replace(/[^0-9.-]/g, "");
  if (digitsOnly === "") return NaN;
  return Number(digitsOnly);
}
