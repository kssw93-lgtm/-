import toneStylesJson from "@/data/tone-styles.json";
import { hashSeed } from "./template-select";
import type { InterpretationResult } from "./index";
import type { Category } from "./template-select";

export type ToneStyleId = "standard" | "mz" | "joseon";

interface ToneStyleMeta {
  id: ToneStyleId;
  label: string;
  emoji: string;
  tagline: string;
  preview: string;
  headings: Record<"dayMaster" | "personality" | "relations" | "daeunFlow", string>;
  openers: string[];
  closers: string[];
}

const TONE_STYLES = toneStylesJson as Record<ToneStyleId, ToneStyleMeta>;

export const TONE_STYLE_LIST: ToneStyleMeta[] = [
  TONE_STYLES.standard,
  TONE_STYLES.mz,
  TONE_STYLES.joseon,
];

export function getToneStyleMeta(style: ToneStyleId): ToneStyleMeta {
  return TONE_STYLES[style];
}

const HEADING_KEY_MAP: Record<string, keyof ToneStyleMeta["headings"]> = {
  "일간 총평 (나의 뿌리)": "dayMaster",
  "기본 성향": "personality",
  "원국 속 특별한 관계": "relations",
  "지금의 대운 흐름": "daeunFlow",
};

/**
 * 명리 계산·해석의 핵심 텍스트(sections)는 그대로 두고, 헤딩 표현과 문장의 앞뒤
 * 말투만 스타일별로 바꿔 입힌다. "큰틀은 똑같고 특색만 넣는다"는 요구를 따른 것 —
 * 카테고리별 전용 문구를 스타일 수만큼 중복 작성하지 않고도 체감되는 톤 차이를 준다.
 * 같은 사람 + 같은 카테고리 + 같은 스타일이면 항상 같은 오프너/클로저가 선택된다(결정론적).
 */
export function applyToneStyle(
  interpretation: InterpretationResult,
  style: ToneStyleId,
  birthKey: string,
  category: Category
): InterpretationResult {
  if (style === "standard") return interpretation;
  const meta = TONE_STYLES[style];

  const sections = interpretation.sections.map((s, i) => {
    const headingKey = HEADING_KEY_MAP[s.heading];
    const heading = headingKey ? meta.headings[headingKey] : s.heading;
    const seed = hashSeed(`${birthKey}|${category}|${style}|${i}`);
    const opener = meta.openers[seed % meta.openers.length];
    const closer = meta.closers[seed % meta.closers.length];
    return { heading, text: `${opener}${s.text}${closer}` };
  });

  return {
    ...interpretation,
    sections,
    resultText: sections.map((s) => `[${s.heading}]\n${s.text}`).join("\n\n"),
  };
}
