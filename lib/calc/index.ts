import { validateBirthInput } from "./input-validation";
import { normalizeToSolarDate, UnavailableLunarCalendarSource, type LunarCalendarSource } from "./calendar-convert";
import { normalizeBirthInstant } from "./timezone-normalize";
import { computeYearPillar } from "./year-pillar";
import { computeMonthPillar } from "./month-pillar";
import { computeDayPillar } from "./day-pillar";
import { computeHourPillar } from "./hour-pillar";
import { computeElementsAndYinYang } from "./elements-yinyang";
import { computeHiddenStemsForPillars } from "./hidden-stems";
import { computeStemTenGods, computeHiddenStemTenGods } from "./ten-gods";
import { computeRelations } from "./relations";
import { computeRootedness } from "./rootedness";
import { computeVoidBranches } from "./void-branches";
import { computeTwelveStagesForPillars } from "./twelve-stages";
import { computeLuckDirection, computeMajorLuck } from "./daeun";
import { createDefaultSolarTermSource, SUPPORTED_BIRTH_YEAR_RANGE, type SolarTermSource } from "./solar-terms";
import { branchById, sexagenaryIndexOf } from "./data";
import lunarSampleJson from "@/data/lunar-calendar/sample.json";
import type { LunarToSolarRecord } from "./calendar-convert";
import type { BirthInput, FourPillars, SajuResult } from "./types";

export * from "./types";
export * from "./twelve-stages";
export { SUPPORTED_BIRTH_YEAR_RANGE };

const DEFAULT_LUNAR_SOURCE: LunarCalendarSource = new UnavailableLunarCalendarSource(
  lunarSampleJson as LunarToSolarRecord[]
);

export interface ComputeSajuOptions {
  solarTerms?: SolarTermSource;
  lunarSource?: LunarCalendarSource;
}

/**
 * 계산 규칙서 73번 최종 구조를 그대로 옮긴 계산 엔진 진입점.
 * 결정론적 순수 함수: 동일 입력 → 동일 출력 (74번 16항). LLM/AI 호출 없음.
 */
export function computeSaju(input: BirthInput, options: ComputeSajuOptions = {}): SajuResult {
  validateBirthInput(input);

  const solarTerms = options.solarTerms ?? createDefaultSolarTermSource();
  const lunarSource = options.lunarSource ?? DEFAULT_LUNAR_SOURCE;

  // 1. 양력/음력 → 표준 양력 날짜
  const solarDate = normalizeToSolarDate(input, lunarSource);

  if (
    solarDate.year < SUPPORTED_BIRTH_YEAR_RANGE.min ||
    solarDate.year > SUPPORTED_BIRTH_YEAR_RANGE.max
  ) {
    throw new Error(
      `현재 서비스는 ${SUPPORTED_BIRTH_YEAR_RANGE.min}~${SUPPORTED_BIRTH_YEAR_RANGE.max}년 출생자만 지원합니다. ` +
        `(무료 KASI 개발계정 절기 데이터 제공 범위 — 데이터 확장 시 코드 수정 없이 지원 범위가 넓어집니다)`
    );
  }

  // 2. 시간대 정규화 (표준시 이력 82번 반영)
  const normalized = normalizeBirthInstant({
    year: solarDate.year,
    month: solarDate.month,
    day: solarDate.day,
    hour: input.hour,
    minute: input.minute,
  });

  // 년/월주 경계 비교용 시각: 시간 미상이면 로컬 정오를 중립값으로 사용(year-pillar.ts 참조)
  const comparisonUtcMillis =
    normalized.utcMillis ??
    Date.UTC(solarDate.year, solarDate.month - 1, solarDate.day, 12, 0) - 9 * 60 * 60 * 1000;

  // 3. 년주
  const { pillar: yearPillar } = computeYearPillar(
    solarDate.year,
    solarDate.month,
    solarDate.day,
    normalized.utcMillis,
    solarTerms
  );

  // 4. 월주
  const monthPillar = computeMonthPillar(solarDate.year, comparisonUtcMillis, yearPillar.stem, solarTerms);

  // 5. 일주
  const dayPillar = computeDayPillar(solarDate);

  // 6. 시주 (시간 미상이면 null)
  let localHourForHourPillar: number | null = null;
  if (input.hour !== null && normalized.utcMillis !== null) {
    const kstMillis = normalized.utcMillis + 9 * 60 * 60 * 1000;
    localHourForHourPillar = new Date(kstMillis).getUTCHours();
  }
  const hourPillar = computeHourPillar(dayPillar.stem, localHourForHourPillar);

  const pillars: FourPillars = { yearPillar, monthPillar, dayPillar, hourPillar };

  // 7. 오행/음양, 지장간
  const elementsRaw = computeElementsAndYinYang(pillars);
  const hiddenStems = computeHiddenStemsForPillars(pillars);

  // 8. 십신 (지장간 포함)
  const tenGods = {
    stems: computeStemTenGods(pillars),
    hiddenStems: computeHiddenStemTenGods(pillars),
  };

  // 9. 합충형파해원진
  const relations = computeRelations(pillars);

  // 10. 통근
  const rootedness = computeRootedness(pillars);

  // 11. 월령
  const monthBranchData = branchById(monthPillar.branch);
  const monthOrder = { branch: monthPillar.branch, season: monthBranchData.season };

  // 12. 공망
  const dayPillarIndex = sexagenaryIndexOf(dayPillar.stem, dayPillar.branch);
  const voidBranches = computeVoidBranches(dayPillarIndex);

  // 12-1. 십이운성 (일간 기준 년/월/일/시지)
  const twelveStages = computeTwelveStagesForPillars(pillars);

  // 13. 대운
  const luckDirection = computeLuckDirection(yearPillar.stem, input.gender);
  const majorLuck = computeMajorLuck({
    localYear: solarDate.year,
    birthUtcMillis: comparisonUtcMillis,
    monthPillar,
    luckDirection,
    solarTerms,
  });

  return {
    input,
    solarBirthDate: solarDate,
    pillars,
    elements: { stemElements: elementsRaw.stemElements, branchElements: elementsRaw.branchElements },
    yinYang: { stemYinYang: elementsRaw.stemYinYang, branchYinYang: elementsRaw.branchYinYang },
    hiddenStems,
    tenGods,
    relations,
    rootedness,
    monthOrder,
    voidBranches,
    twelveStages,
    luckDirection,
    majorLuck,
    usingMockData: false,
  };
}
