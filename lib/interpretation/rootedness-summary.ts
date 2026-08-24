import { branchHanja } from "@/lib/calc/data";
import type { SajuResult } from "@/lib/calc/types";

export interface RootednessPillarDisplay {
  pillarLabel: string;
  branchHanja: string;
  rooted: boolean;
}

export interface RootednessSummary {
  pillars: RootednessPillarDisplay[];
  rootedCount: number;
  totalCount: number;
  text: string;
}

const PILLAR_LABELS = ["년지", "월지", "일지", "시지"];

/**
 * 통근(通根): 일간과 같은 오행의 지장간이 그 지지에 있으면 "뿌리를 내렸다"고 본다.
 * 계산 자체는 이미 lib/calc/rootedness.ts에서 산출돼 saju.rootedness에 담겨 있지만
 * 지금까지 어디에서도 화면에 보여주지 않던 값이다(신강신약 점수 계산은 별도 로직을 씀).
 * 뿌리 개수가 많을수록 일간이 외부 변화(대운·세운, 충극)에 덜 흔들린다고 보는
 * 통근에 대한 해석은 명리학에서 이견이 없는 기초 개념이라 그대로 서술한다.
 */
export function computeRootednessSummary(saju: SajuResult): RootednessSummary {
  const pillars: RootednessPillarDisplay[] = saju.rootedness.map((r, i) => ({
    pillarLabel: PILLAR_LABELS[i],
    branchHanja: branchHanja(r.branch),
    rooted: r.rooted,
  }));

  const rootedCount = pillars.filter((p) => p.rooted).length;
  const totalCount = pillars.length;

  let text: string;
  if (rootedCount === 0) {
    text =
      "일간이 원국 어디에도 뿌리를 내리지 못했어요. 기세가 가볍게 흘러가는 편이라, 대운이나 주변 환경의 영향을 비교적 크게 받는 구조예요.";
  } else if (rootedCount === 1) {
    text =
      "일간이 한 곳에 뿌리를 내렸어요. 완전히 흔들리는 구조는 아니지만, 큰 충격이 오면 다소 휘청일 수 있어요.";
  } else if (rootedCount === totalCount) {
    text =
      "일간이 원국 전체에 뿌리를 단단히 내렸어요. 기반이 튼튼해서 어지간한 충극이 와도 크게 흔들리지 않는 안정적인 구조예요.";
  } else {
    text =
      "일간이 여러 곳에 뿌리를 내렸어요. 어느 정도 안정된 기반이 있어서, 웬만한 변화에는 쉽게 흔들리지 않는 편이에요.";
  }

  return { pillars, rootedCount, totalCount, text };
}
