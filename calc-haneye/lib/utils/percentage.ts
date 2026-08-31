interface FormatPercentOptions {
  minFractionDigits?: number;
  maxFractionDigits?: number;
}

/**
 * decimal rate를 사람이 읽기 쉬운 퍼센트 문자열로 변환합니다.
 * 예: 0.02 -> "2.00%"
 */
export function formatPercent(
  rateDecimal: number,
  options: FormatPercentOptions = {}
): string {
  const { minFractionDigits = 2, maxFractionDigits = 2 } = options;
  const percentValue = rateDecimal * 100;
  const formatted = percentValue.toLocaleString("ko-KR", {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: Math.max(minFractionDigits, maxFractionDigits),
  });
  return `${formatted}%`;
}
