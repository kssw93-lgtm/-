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
import { computeLifeStages, type LifeStageDisplay } from "./life-stage";
import { computeMeetingTiming, type MeetingTiming } from "./meeting-timing";
import { computeCoreSummary, type CoreSummary } from "./core-summary";
import { getIncomeSource, type IncomeSource } from "./income-source";
import { getMeetingChannel, type MeetingChannel } from "./meeting-channel";
import { getWorkStyle, type WorkStyle } from "./work-style";
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
import type { ElementId, SajuResult, StemId } from "@/lib/calc/types";

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
export * from "./life-stage";
export * from "./meeting-timing";
export * from "./core-summary";
export * from "./income-source";
export * from "./meeting-channel";
export * from "./work-style";

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
  luckColor: LuckColorDisplay | null;
  starSign: StarSign;
  zodiacAnimal: ZodiacAnimal;
  gyeokguk: Gyeokguk;
  sinsal: SinsalDisplay[];
  dailyFortune: DailyFortune;
  pastLife: PastLife | null;
  lifeGrades: LifeStageGrade[];
  johu: JohuAnalysis | null;
  /** 초년/중년/말년운 — 종합사주에서만 채워진다 */
  lifeStages: LifeStageDisplay[];
  /** 인연 만나기 좋은 날·장소 — 연애운/재회운/종합사주에서만 채워진다 */
  meetingTiming: MeetingTiming | null;
  /** 결과 화면 맨 위 압축 요약(강점/주의/키워드) — 모든 카테고리 공통 */
  coreSummary: CoreSummary;
  /** 나에게 유리한 수입 구조 — 재물운/종합사주에서만 채워진다 */
  incomeSource: IncomeSource | null;
  /** 인연이 들어오는 경로 — 연애운/재회운/종합사주에서만 채워진다 */
  meetingChannel: MeetingChannel | null;
  /** 업무 스타일·잘 맞는 환경 — 직업운/종합사주에서만 채워진다 */
  workStyle: WorkStyle | null;
  /** PDF 저장/공유용으로 섹션을 하나로 합친 텍스트 */
  resultText: string;
  isHourExcluded: boolean;
}

/**
 * 카테고리마다 결과 화면에 드러나는 "부가 섹션" 구성을 다르게 가져간다 — 원국 자체의 성질
 * (일간총평/기본성향/원국관계/오늘의운세)은 어떤 카테고리를 보든 항상 같지만(같은 사람의 같은
 * 사주니까 당연하다), 그 아래 곁들이는 콘텐츠는 카테고리 주제에 맞춰 다르게 골라 보여준다.
 * 종합사주만 전부 다 포함하고(그래서 "종합"), 나머지 카테고리는 주제와 맞닿은 항목 위주로만
 * 보여줘서 카테고리를 바꿔가며 볼 때 실제로 다른 결과처럼 느껴지게 한다.
 */
interface CategoryFeatures {
  /** 일간총평/기본성향/원국관계/지금의대운흐름 — 원국 자체를 통째로 훑는 블록들. 종합사주만 보여준다. */
  coreProfile: boolean;
  zodiacPersonality: boolean; // 띠/별자리 성격
  sinsal: boolean; // 신살
  johu: boolean; // 조후
  luckColor: boolean; // 행운의 컬러&숫자
  lifeGrades: boolean; // 인생 등급(대운별)
  pastLife: boolean; // 전생 보기
  lifeStages: boolean; // 초년/중년/말년운
  meetingTiming: boolean; // 인연 만나기 좋은 날·장소
  incomeSource: boolean; // 나에게 유리한 수입 구조 (재물운 전용)
  meetingChannel: boolean; // 인연이 들어오는 경로 (연애운/재회운 전용)
  workStyle: boolean; // 업무 스타일·잘 맞는 환경 (직업운 전용)
}

const CATEGORY_FEATURES: Record<Category, CategoryFeatures> = {
  love: { coreProfile: false, zodiacPersonality: true, sinsal: true, johu: false, luckColor: true, lifeGrades: false, pastLife: false, lifeStages: false, meetingTiming: true, incomeSource: false, meetingChannel: true, workStyle: false },
  reunion: { coreProfile: false, zodiacPersonality: false, sinsal: true, johu: false, luckColor: true, lifeGrades: false, pastLife: false, lifeStages: false, meetingTiming: true, incomeSource: false, meetingChannel: true, workStyle: false },
  career: { coreProfile: false, zodiacPersonality: false, sinsal: false, johu: false, luckColor: true, lifeGrades: true, pastLife: false, lifeStages: false, meetingTiming: false, incomeSource: false, meetingChannel: false, workStyle: true },
  wealth: { coreProfile: false, zodiacPersonality: false, sinsal: false, johu: false, luckColor: true, lifeGrades: true, pastLife: false, lifeStages: false, meetingTiming: false, incomeSource: true, meetingChannel: false, workStyle: false },
  overall: { coreProfile: true, zodiacPersonality: true, sinsal: true, johu: true, luckColor: true, lifeGrades: true, pastLife: true, lifeStages: true, meetingTiming: true, incomeSource: true, meetingChannel: true, workStyle: true },
};

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

  const features = CATEGORY_FEATURES[category];
  const personality = selectPersonalityTemplate(group, strength);
  const categoryTemplate = selectTemplate(category, group, strength, birthKey);

  const vars = { name: saju.input.name, dayStem: saju.pillars.dayPillar.stem };
  const categoryLabel = `${CATEGORY_LABEL[category]} 핵심 특징`;
  const coreSummary = computeCoreSummary(group);

  // 종합사주만 원국 전체를 훑는 공통 블록(일간총평/기본성향/원국관계)으로 시작하고,
  // 나머지 카테고리는 곧바로 그 주제만의 핵심 콘텐츠로 시작한다 — 카테고리를 바꿔가며
  // 볼 때 매번 똑같은 문단이 반복된다는 피드백을 반영해, 겹치는 블록 자체를 없앴다.
  const sections = features.coreProfile
    ? [
        { heading: "일간 총평 (나의 뿌리)", text: DAY_MASTER_PROFILES[saju.pillars.dayPillar.stem] },
        { heading: "기본 성향", text: substituteVariables(personality.text, vars) },
        { heading: "원국 속 특별한 관계", text: describeRelations(saju) },
        { heading: categoryLabel, text: substituteVariables(categoryTemplate.text, vars) },
      ]
    : [{ heading: categoryLabel, text: substituteVariables(categoryTemplate.text, vars) }];

  const currentFlow = computeCurrentFlow(saju);
  if (currentFlow) {
    const annual = selectAnnualTemplate(category, currentFlow.annualGroup);
    const monthly = selectMonthlyTemplate(category, currentFlow.monthlyGroup);
    if (annual) sections.push({ heading: `올해 ${CATEGORY_LABEL[category]}`, text: substituteVariables(annual.text, vars) });
    if (monthly) sections.push({ heading: `이번달 ${CATEGORY_LABEL[category]}`, text: substituteVariables(monthly.text, vars) });
  }

  const starSign = getStarSignForSaju(saju);
  const zodiacAnimal = getZodiacAnimalForSaju(saju);
  if (features.zodiacPersonality) {
    sections.push(
      { heading: `${zodiacAnimal.animal} 성격`, text: zodiacAnimal.text },
      { heading: `${starSign.name} 성격`, text: starSign.text }
    );
  }

  const lifeStages: LifeStageDisplay[] = features.lifeStages ? computeLifeStages(saju) : [];

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

  const luckColor = features.luckColor ? computeLuckColor(saju) : null;
  const gyeokguk = computeGyeokguk(saju);
  const sinsal: SinsalDisplay[] = features.sinsal ? computeSinsal(saju.pillars).map((hit) => SINSAL_INFO[hit.id]) : [];
  const dailyFortune = computeDailyFortune(saju);
  const pastLife = features.pastLife ? computePastLife(saju) : null;
  const lifeGrades = features.lifeGrades ? computeLifeGrades(saju) : [];
  const johu = features.johu ? computeJohu(saju) : null;

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
    lifeStages,
    meetingTiming: features.meetingTiming ? computeMeetingTiming(saju) : null,
    coreSummary,
    incomeSource: features.incomeSource ? getIncomeSource(group) : null,
    meetingChannel: features.meetingChannel ? getMeetingChannel(group) : null,
    workStyle: features.workStyle ? getWorkStyle(group) : null,
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
