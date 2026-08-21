import { useState } from "react";

export type AdWatchState = "idle" | "playing" | "done";

/**
 * 리워드 광고 시청을 시뮬레이션하는 훅. 실제 광고 SDK 연동 전까지 사용하는 자리표시자.
 * (개발 지시서 07번: 실제 광고 네트워크 계정 준비 후 별도 연동 예정)
 */
export function useSimulatedAdWatch(durationMs = 3000) {
  const [state, setState] = useState<AdWatchState>("idle");

  function watch(onComplete: () => void) {
    setState("playing");
    setTimeout(() => {
      setState("done");
      onComplete();
    }, durationMs);
  }

  return { state, watch };
}
