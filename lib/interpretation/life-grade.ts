import tiersJson from "@/data/life-grade-tiers.json";
import { getTenGod } from "@/lib/calc/ten-gods";
import { pillarHanja } from "@/lib/calc/data";
import { GROUP_BY_TEN_GOD, type PatternGroup } from "./feature-extract";
import { hashSeed } from "./template-select";
import type { SajuResult } from "@/lib/calc/types";

interface Tier {
  min: number;
  grade: string;
  title: string;
  desc: string;
}

const TIERS = tiersJson as Tier[];

/** 그룹별 4개 축(재물/연애/직업/건강) 기본 점수 — 재미 요소이므로 십신의 일반적 통변 성향을 단순화해 반영 */
const AXIS_BASE: Record<PatternGroup, { wealth: number; love: number; career: number; health: number }> = {
  bigeob: { wealth: 70, love: 65, career: 85, health: 75 },
  siksang: { wealth: 75, love: 85, career: 70, health: 70 },
  jaeseong: { wealth: 90, love: 75, career: 65, health: 65 },
  gwanseong: { wealth: 65, love: 70, career: 90, health: 70 },
  inseong: { wealth: 60, love: 60, career: 70, health: 90 },
};

function gradeFor(score: number): Tier {
  return TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];
}

export interface LifeStageGrade {
  index: number;
  ageLabel: string;
  pillarHanja: string;
  group: PatternGroup;
  overallScore: number;
  overallGrade: string;
  title: string;
  titleDesc: string;
  axes: { label: string; grade: string; score: number }[];
  isCurrent: boolean;
}

/**
 * 재미 콘텐츠(인생 등급): 이미 계산된 대운(majorLuck)과 일간-대운 간지의 십신 관계(group)를
 * 그대로 재사용한다. 새 계산 규칙을 만들지 않고, 그 위에 점수/등급 매핑만 얹는다.
 * 점수에는 결정론적 지터(사람+대운 index 해시)를 소폭 더해 매 대운이 똑같은 점수로
 * 반복되지 않게 한다(±5점, 사람마다 항상 같은 값 — 랜덤 아님).
 */
export function computeLifeGrades(saju: SajuResult): LifeStageGrade[] {
  const dayStem = saju.pillars.dayPillar.stem;
  const nowMillis = Date.now();

  return saju.majorLuck.map((lp) => {
    const tenGod = getTenGod(dayStem, lp.pillar.stem);
    const group = GROUP_BY_TEN_GOD[tenGod];
    const base = AXIS_BASE[group];

    const jitterSeed = hashSeed(`${saju.pillars.dayPillar.stem}${saju.pillars.dayPillar.branch}|lifegrade|${lp.index}`);

    function withJitter(value: number, salt: number): number {
      const j = (hashSeed(`${jitterSeed}|${salt}`) % 11) - 5; // -5 ~ +5
      return Math.max(30, Math.min(99, value + j));
    }

    const wealth = withJitter(base.wealth, 1);
    const love = withJitter(base.love, 2);
    const career = withJitter(base.career, 3);
    const health = withJitter(base.health, 4);
    const overallScore = Math.round((wealth + love + career + health) / 4);
    const tier = gradeFor(overallScore);

    return {
      index: lp.index,
      ageLabel: `${lp.startAgeDisplay}세`,
      pillarHanja: pillarHanja(lp.pillar.stem, lp.pillar.branch),
      group,
      overallScore,
      overallGrade: tier.grade,
      title: tier.title,
      titleDesc: tier.desc,
      axes: [
        { label: "재물운", score: wealth, grade: gradeFor(wealth).grade },
        { label: "연애운", score: love, grade: gradeFor(love).grade },
        { label: "직업운", score: career, grade: gradeFor(career).grade },
        { label: "건강운", score: health, grade: gradeFor(health).grade },
      ],
      isCurrent: nowMillis >= Date.parse(lp.startDate) && nowMillis < Date.parse(lp.endDate),
    };
  });
}
