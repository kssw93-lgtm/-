import { useState } from "react";

export type AdWatchState = "idle" | "playing" | "done";

/**
 * 리워드 광고 시청 훅. "playing" 동안 실제 애드센스 광고 단위(AdSlot)를 노출하고,
 * 지정된 시간(기본 5초)이 지나면 자동으로 완료 처리한다. 별도의 리워드 광고
 * 포맷이 없는 일반 애드센스 계정 특성상, 실제 디스플레이 광고를 최소 시간 동안
 * 노출시키는 방식으로 대체한다.
 */
export function useAdWatch(durationMs = 5000) {
  const [state, setState] = useState<AdWatchState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);

  function watch(onComplete: () => void) {
    setState("playing");
    setSecondsLeft(Math.ceil(durationMs / 1000));

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const remainingMs = durationMs - (Date.now() - startedAt);
      setSecondsLeft(Math.max(0, Math.ceil(remainingMs / 1000)));
      if (remainingMs <= 0) {
        clearInterval(interval);
        setState("done");
        onComplete();
      }
    }, 200);
  }

  return { state, secondsLeft, watch };
}
