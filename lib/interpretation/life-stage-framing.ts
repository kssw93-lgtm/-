import lifeStageFramingJson from "@/data/life-stage-framing.json";

interface LifeStageFraming {
  id: string;
  maxAge: number | null;
  text: string;
}

const LIFE_STAGE_FRAMING = lifeStageFramingJson as LifeStageFraming[];

/**
 * 대운 해석에 나이대별 생애주기(Life Cycle) 맥락을 덧붙이기 위한 프레이밍 문장을 고른다.
 * 10대/20~30대/40~50대/60대 이상 네 구간으로 나누고, 각 대운의 시작 나이로 구간을 정한다
 * (카테고리와 무관하게 공통 적용 — 생애주기 화두 자체는 어느 카테고리를 보든 같다).
 */
export function getLifeStageFraming(startAge: number): string {
  const bracket = LIFE_STAGE_FRAMING.find((b) => b.maxAge === null || startAge <= b.maxAge);
  return (bracket ?? LIFE_STAGE_FRAMING[LIFE_STAGE_FRAMING.length - 1]).text;
}
