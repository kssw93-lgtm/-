import workStyleJson from "@/data/work-style.json";
import type { PatternGroup } from "./feature-extract";

export interface WorkStyle {
  style: string;
  goodEnv: string;
  badEnv: string;
}

const WORK_STYLE = workStyleJson as Record<PatternGroup, WorkStyle>;

/** 직업운 전용 — 업무 스타일과 잘 맞는/안 맞는 환경도 이미 계산된 PatternGroup을 그대로 재사용한다. */
export function getWorkStyle(group: PatternGroup): WorkStyle {
  return WORK_STYLE[group];
}
