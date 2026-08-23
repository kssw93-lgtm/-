import channelJson from "@/data/meeting-channel.json";
import type { PatternGroup } from "./feature-extract";

export interface MeetingChannel {
  type: string;
  desc: string;
  matchType: string;
}

const MEETING_CHANNEL = channelJson as Record<PatternGroup, MeetingChannel>;

/**
 * 연애운/재회운 전용 — "인연이 들어오는 경로"도 새 계산이 아니라 이미 계산된
 * PatternGroup(십신 강세 그룹)을 그대로 재사용한다: 비겁=동료·친구, 식상=취미·창작,
 * 재성=일·현실 활동, 관성=직장·소개, 인성=배움·인맥. income-source.ts와 동일한 방식.
 */
export function getMeetingChannel(group: PatternGroup): MeetingChannel {
  return MEETING_CHANNEL[group];
}
