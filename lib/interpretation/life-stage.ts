import lifeStageJson from "@/data/interpretation-templates/life-stage.json";
import { getTenGod } from "@/lib/calc/ten-gods";
import { pillarHanja } from "@/lib/calc/data";
import { GROUP_BY_TEN_GOD, type PatternGroup } from "./feature-extract";
import type { MaybePillar, SajuResult } from "@/lib/calc/types";

type Stage = "early" | "mid" | "late";

const STAGE_LABEL: Record<Stage, string> = { early: "초년운", mid: "중년운", late: "말년운" };
const STAGE_TEMPLATES = lifeStageJson as { id: string; stage: Stage; pattern: PatternGroup; text: string }[];

export interface LifeStageDisplay {
  stage: Stage;
  label: string;
  pillarHanja: string;
  text: string;
}

/**
 * 초년/중년/말년운 — 사주 명리학의 전통적 관법(년주=초년, 월주=중년, 시주=말년)을 그대로 따른다.
 * 새 계산을 만들지 않고, 이미 계산된 각 기둥의 천간과 일간 사이의 십신 관계(group)만 재사용한다.
 * 종합사주에서만 제공한다 — 개별 대운 흐름과 달리 '평생의 큰 단락'을 조망하는 성격이라
 * 특정 주제(연애/재물 등)보다 종합적인 관점에 더 잘 맞기 때문이다.
 */
export function computeLifeStages(saju: SajuResult): LifeStageDisplay[] {
  const dayStem = saju.pillars.dayPillar.stem;

  const stagesInput: { stage: Stage; pillar: MaybePillar }[] = [
    { stage: "early", pillar: saju.pillars.yearPillar },
    { stage: "mid", pillar: saju.pillars.monthPillar },
    { stage: "late", pillar: saju.pillars.hourPillar },
  ];

  return stagesInput.flatMap(({ stage, pillar }) => {
    if (!pillar) return [];
    const tenGod = getTenGod(dayStem, pillar.stem);
    const group = GROUP_BY_TEN_GOD[tenGod];
    const template = STAGE_TEMPLATES.find((t) => t.stage === stage && t.pattern === group);
    if (!template) return [];
    return [
      {
        stage,
        label: STAGE_LABEL[stage],
        pillarHanja: pillarHanja(pillar.stem, pillar.branch),
        text: template.text,
      },
    ];
  });
}
