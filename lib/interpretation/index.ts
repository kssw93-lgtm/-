import { extractDominantTenGodGroup, GROUP_BY_TEN_GOD } from "./feature-extract";
import { computeStrengthScore } from "./strength-score";
import { computeCurrentFlow, computeYearRhythm } from "./current-flow";
import { computeLuckColor } from "./luck-color";
import { getStarSignForSaju, getZodiacAnimalForSaju, type StarSign, type ZodiacAnimal } from "./zodiac";
import { describeRelations } from "./relations-narrative";
import { computeGyeokguk, type Gyeokguk } from "./gyeokguk";
import { computeDailyFortune, type DailyFortune } from "./daily-fortune";
import { computePastLife, type PastLife } from "./past-life";
import { computeLifeGrades, type LifeStageGrade } from "./life-grade";
import { computeJohu, type JohuAnalysis } from "./johu";
import { computeSinsal } from "@/lib/calc/sinsal";
import sinsalJson from "@/data/sinsal.json";
import type { SinsalId } from "@/lib/calc/sinsal";
import {
  buildBirthKey,
  buildPatternId,
  CATEGORY_LABEL,
  selectAnnualTemplate,
  selectDaeunFlowTemplate,
  selectIntroTemplate,
  selectMonthlyTemplate,
  selectPersonalityTemplate,
  selectRhythmTemplate,
  selectTemplate,
  type Category,
} from "./template-select";
import { substituteVariables } from "./variable-substitute";
import { pillarHanja } from "@/lib/calc/data";
import { getTenGod } from "@/lib/calc/ten-gods";
import dayMasterJson from "@/data/day-master.json";
import type { ElementId, LuckPillar, SajuResult, StemId } from "@/lib/calc/types";

const DAY_MASTER_PROFILES = dayMasterJson as Record<StemId, string>;
const SINSAL_INFO = sinsalJson as Record<SinsalId, { name: string; hanja: string; type: string; desc: string }>;

export * from "./feature-extract";
export * from "./strength-score";
export * from "./template-select";
export * from "./variable-substitute";
export * from "./current-flow";
export * from "./luck-color";
export * from "./zodiac";
export * from "./gyeokguk";
export * from "./daily-fortune";
export * from "./past-life";
export * from "./life-grade";
export * from "./tone-style";
export * from "./johu";

export interface MonthRhythmDisplay {
  month: number;
  label: string;
  tip: string;
}

export interface LuckColorDisplay {
  element: ElementId;
  color: string;
  numbers: number[];
  desc: string;
}

export interface DaeunFlowDisplay {
  index: number;
  ageLabel: string;
  pillarHanja: string;
  text: string;
  isCurrent: boolean;
}

export interface SinsalDisplay {
  name: string;
  hanja: string;
  type: string;
  desc: string;
}

export interface InterpretationResult {
  category: Category;
  patternId: string;
  templateId: string;
  /** 화면에 순서대로 렌더링할 문단 블록들. sections[0]은 무료로 공개, 나머지는 광고 게이트 뒤에 표시. */
  sections: { heading: string; text: string }[];
  monthRhythm: MonthRhythmDisplay[];
  daeunFlow: DaeunFlowDisplay[];
  luckColor: LuckColorDisplay;
  starSign: StarSign;
  zodiacAnimal: ZodiacAnimal;
  gyeokguk: Gyeokguk;
  sinsal: SinsalDisplay[];
  dailyFortune: DailyFortune;
  pastLife: PastLife;
  lifeGrades: LifeStageGrade[];
  johu: JohuAnalysis;
  /** PDF 저장/공유용으로 섹션을 하나로 합친 텍스트 */
  resultText: string;
  isHourExcluded: boolean;
}

function findCurrentLuckPillar(majorLuck: LuckPillar[], nowMillis: number): { pillar: LuckPillar; phase: "before" | "current" | "after" } {
  for (const lp of majorLuck) {
    const startMillis = Date.parse(lp.startDate);
    const endMillis = Date.parse(lp.endDate);
    if (nowMillis >= startMillis && nowMillis < endMillis) {
      return { pillar: lp, phase: "current" };
    }
  }
  const first = majorLuck[0];
  if (nowMillis < Date.parse(first.startDate)) {
    return { pillar: first, phase: "before" };
  }
  return { pillar: majorLuck[majorLuck.length - 1], phase: "after" };
}

/**
 * 대운은 "장기적인 흐름"이라는 존재만 서술하고(계산 규칙서 55, 74번 ⑫: 계산과 해석 분리,
 * 단정적 예언 금지), 길흉 판단 문장은 만들지 않는다 — 어느 대운 구간에 있는지만 정확히 알려준다.
 */
function describeCurrentLuck(saju: SajuResult): string {
  const { pillar, phase } = findCurrentLuckPillar(saju.majorLuck, Date.now());
  const hanja = pillarHanja(pillar.pillar.stem, pillar.pillar.branch);

  if (phase === "before") {
    return `아직 첫 대운(${hanja})이 시작되기 전 시기예요. 만 ${pillar.startAgeDisplay}세 무렵부터 ${hanja} 대운의 흐름이 시작돼요.`;
  }
  return `지금은 만 ${pillar.startAgeDisplay}세부터 이어지는 ${hanja} 대운의 흐름 안에 있어요. 원국이 타고난 기본 성향이라면, 대운은 그 위에 시기별로 덧입혀지는 큰 흐름이에요.`;
}

/**
 * S4 로딩 단계 내부 처리(화면 흐름 설계서 05번 1~5)를 확장: 원국 → 특징값 → pattern ID →
 * 성향 + 카테고리별 + 올해/이번달/월별리듬 + 대운 흐름 + 행운의 컬러·숫자를 조합한다.
 * 여전히 실시간 AI 호출 없이, 실제 계산값(세운·월운·오행분포)에 미리 작성된 텍스트를 매칭할 뿐이다.
 */
export function interpretSaju(saju: SajuResult, category: Category): InterpretationResult {
  const group = extractDominantTenGodGroup(saju);
  const { strength } = computeStrengthScore(saju);
  const patternId = buildPatternId(group, strength);

  const birthKey = buildBirthKey({
    year: saju.input.year,
    month: saju.input.month,
    day: saju.input.day,
    hour: saju.input.hour,
    minute: saju.input.minute,
    calendarType: saju.input.calendarType,
  });

  const personality = selectPersonalityTemplate(group, strength);
  const categoryTemplate = selectTemplate(category, group, strength, birthKey);

  const vars = { name: saju.input.name, dayStem: saju.pillars.dayPillar.stem };
  const categoryLabel = `${CATEGORY_LABEL[category]} 핵심 특징`;

  const sections = [
    { heading: "일간 총평 (나의 뿌리)", text: DAY_MASTER_PROFILES[saju.pillars.dayPillar.stem] },
    { heading: "기본 성향", text: substituteVariables(personality.text, vars) },
    { heading: "원국 속 특별한 관계", text: describeRelations(saju) },
    { heading: categoryLabel, text: substituteVariables(categoryTemplate.text, vars) },
  ];

  const currentFlow = computeCurrentFlow(saju);
  if (currentFlow) {
    const annual = selectAnnualTemplate(category, currentFlow.annualGroup);
    const monthly = selectMonthlyTemplate(category, currentFlow.monthlyGroup);
    if (annual) sections.push({ heading: `올해 ${CATEGORY_LABEL[category]}`, text: substituteVariables(annual.text, vars) });
    if (monthly) sections.push({ heading: `이번달 ${CATEGORY_LABEL[category]}`, text: substituteVariables(monthly.text, vars) });
  }

  sections.push({ heading: "지금의 대운 흐름", text: describeCurrentLuck(saju) });

  const starSign = getStarSignForSaju(saju);
  const zodiacAnimal = getZodiacAnimalForSaju(saju);
  sections.push(
    { heading: `${zodiacAnimal.animal} 성격`, text: zodiacAnimal.text },
    { heading: `${starSign.name} 성격`, text: starSign.text }
  );

  const monthRhythm: MonthRhythmDisplay[] = computeYearRhythm(saju).flatMap((r) => {
    const t = selectRhythmTemplate(category, r.group);
    return t ? [{ month: r.month, label: t.label, tip: t.tip }] : [];
  });

  const nowMillis = Date.now();
  const dayStem = saju.pillars.dayPillar.stem;
  const daeunFlow: DaeunFlowDisplay[] = saju.majorLuck.flatMap((lp) => {
    const tenGod = getTenGod(dayStem, lp.pillar.stem);
    const groupTemplate = selectDaeunFlowTemplate(category, GROUP_BY_TEN_GOD[tenGod]);
    if (!groupTemplate) return [];
    return [
      {
        index: lp.index,
        ageLabel: `${lp.startAgeDisplay}세~${lp.startAgeDisplay + 9}세`,
        pillarHanja: pillarHanja(lp.pillar.stem, lp.pillar.branch),
        text: groupTemplate.text,
        isCurrent: nowMillis >= Date.parse(lp.startDate) && nowMillis < Date.parse(lp.endDate),
      },
    ];
  });

  const luckColor = computeLuckColor(saju);
  const gyeokguk = computeGyeokguk(saju);
  const sinsal: SinsalDisplay[] = computeSinsal(saju.pillars).map((hit) => SINSAL_INFO[hit.id]);
  const dailyFortune = computeDailyFortune(saju);
  const pastLife = computePastLife(saju);
  const lifeGrades = computeLifeGrades(saju);
  const johu = computeJohu(saju);

  return {
    category,
    patternId,
    templateId: categoryTemplate.id,
    sections,
    monthRhythm,
    daeunFlow,
    luckColor,
    starSign,
    zodiacAnimal,
    gyeokguk,
    sinsal,
    dailyFortune,
    pastLife,
    lifeGrades,
    johu,
    resultText: sections.map((s) => `[${s.heading}]\n${s.text}`).join("\n\n"),
    isHourExcluded: saju.pillars.hourPillar === null,
  };
}

export function introFor(category: Category, saju: SajuResult): string {
  const birthKey = buildBirthKey({
    year: saju.input.year,
    month: saju.input.month,
    day: saju.input.day,
    hour: saju.input.hour,
    minute: saju.input.minute,
    calendarType: saju.input.calendarType,
  });
  const template = selectIntroTemplate(category, birthKey);
  return substituteVariables(template.text, { name: saju.input.name });
}
