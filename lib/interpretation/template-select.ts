import type { PatternGroup } from "./feature-extract";
import type { Strength } from "./strength-score";
import loveTemplates from "@/data/interpretation-templates/love.json";
import careerTemplates from "@/data/interpretation-templates/career.json";
import wealthTemplates from "@/data/interpretation-templates/wealth.json";
import reunionTemplates from "@/data/interpretation-templates/reunion.json";
import overallTemplates from "@/data/interpretation-templates/overall.json";
import introTemplates from "@/data/interpretation-templates/intro.json";
import personalityTemplates from "@/data/interpretation-templates/personality.json";
import annualTemplates from "@/data/interpretation-templates/annual.json";
import monthlyTemplates from "@/data/interpretation-templates/monthly.json";
import rhythmTemplates from "@/data/interpretation-templates/rhythm.json";
import daeunFlowTemplates from "@/data/interpretation-templates/daeun-flow.json";

export type Category = "love" | "career" | "wealth" | "reunion" | "overall";

export const CATEGORY_LABEL: Record<Category, string> = {
  love: "연애운",
  career: "직업운",
  wealth: "재물운",
  reunion: "재회운",
  overall: "종합사주",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  love: "💕",
  career: "💼",
  wealth: "💰",
  reunion: "🌙",
  overall: "🔮",
};

export interface Template {
  id: string;
  category?: string;
  pattern?: string;
  version?: number;
  text: string;
}

const TEMPLATES_BY_CATEGORY: Record<Category, Template[]> = {
  love: loveTemplates as Template[],
  career: careerTemplates as Template[],
  wealth: wealthTemplates as Template[],
  reunion: reunionTemplates as Template[],
  overall: overallTemplates as Template[],
};

const INTRO_TEMPLATES = introTemplates as Template[];
const PERSONALITY_TEMPLATES = personalityTemplates as Template[];
const ANNUAL_TEMPLATES = annualTemplates as Template[];
const MONTHLY_TEMPLATES = monthlyTemplates as Template[];

export interface RhythmTemplate {
  id: string;
  category: Category;
  pattern: string;
  label: string;
  tip: string;
}
const RHYTHM_TEMPLATES = rhythmTemplates as RhythmTemplate[];
const DAEUN_FLOW_TEMPLATES = daeunFlowTemplates as Template[];

export function buildPatternId(group: PatternGroup, strength: Strength): string {
  return `${group}.${strength}`;
}

/**
 * 매핑규칙서 04번: seed = hash(생년월일시 + 카테고리), version_index = seed % 버전개수.
 * 같은 사람 + 같은 카테고리는 항상 같은 버전, 사람이 다르면 자연스럽게 분산.
 * (djb2 기반 결정론적 문자열 해시 — 암호학적 강도 불필요, 재현성만 필요)
 */
export function hashSeed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildBirthKey(input: {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number;
  calendarType: string;
}): string {
  return `${input.year}-${input.month}-${input.day}-${input.hour ?? "unknown"}-${input.minute}-${input.calendarType}`;
}

export function selectTemplate(
  category: Category,
  group: PatternGroup,
  strength: Strength,
  birthKey: string
): Template {
  const patternId = buildPatternId(group, strength);
  const candidates = TEMPLATES_BY_CATEGORY[category].filter((t) => t.pattern === patternId);
  if (candidates.length === 0) {
    throw new Error(`템플릿을 찾을 수 없습니다: ${category}.${patternId}`);
  }
  const seed = hashSeed(`${birthKey}|${category}`);
  const index = seed % candidates.length;
  return candidates[index];
}

/** 성향 요약(10패턴, 카테고리 공통)은 버전이 1개뿐이라 해시 선택 없이 패턴으로 바로 조회한다. */
export function selectPersonalityTemplate(group: PatternGroup, strength: Strength): Template {
  const patternId = buildPatternId(group, strength);
  const found = PERSONALITY_TEMPLATES.find((t) => t.pattern === patternId);
  if (!found) {
    throw new Error(`성향 템플릿을 찾을 수 없습니다: ${patternId}`);
  }
  return found;
}

/**
 * 올해/이번달/월별리듬/대운흐름은 카테고리마다 아직 전용 문구가 없을 수 있다(신규 카테고리
 * 단계적 추가 중). 없으면 null을 반환해 해당 섹션을 건너뛰게 하고, 억지로 다른 카테고리
 * 문구를 재활용하지 않는다 — 카테고리별 특색을 지키기 위함.
 */
export function selectAnnualTemplate(category: Category, group: PatternGroup): Template | null {
  return ANNUAL_TEMPLATES.find((t) => t.category === category && t.pattern === group) ?? null;
}

export function selectMonthlyTemplate(category: Category, group: PatternGroup): Template | null {
  return MONTHLY_TEMPLATES.find((t) => t.category === category && t.pattern === group) ?? null;
}

export function selectRhythmTemplate(category: Category, group: PatternGroup): RhythmTemplate | null {
  return RHYTHM_TEMPLATES.find((t) => t.category === category && t.pattern === group) ?? null;
}

/**
 * 대운은 한 사람의 인생에 같은 패턴 그룹이 여러 번(비인접 시기에) 등장할 수 있는데,
 * 그때마다 문구가 완전히 동일하면 반복처럼 느껴진다는 피드백을 반영해 그룹당 버전을 2개
 * 이상 두고, 대운 인덱스까지 섞은 시드로 같은 사람이라도 서로 다른 대운 구간엔 다른
 * 버전이 나오게 한다(같은 사람+같은 대운 구간은 항상 같은 결과 — 결정론 유지).
 */
export function selectDaeunFlowTemplate(
  category: Category,
  group: PatternGroup,
  seedInput: string
): Template | null {
  const candidates = DAEUN_FLOW_TEMPLATES.filter((t) => t.category === category && t.pattern === group);
  if (candidates.length === 0) return null;
  const index = hashSeed(seedInput) % candidates.length;
  return candidates[index];
}

export function selectIntroTemplate(category: Category, birthKey: string): Template {
  const candidates = INTRO_TEMPLATES.filter((t) => t.category === category);
  if (candidates.length === 0) {
    throw new Error(`인트로 템플릿을 찾을 수 없습니다: ${category}`);
  }
  const seed = hashSeed(`${birthKey}|${category}|intro`);
  const index = seed % candidates.length;
  return candidates[index];
}
