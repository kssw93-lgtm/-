"use client";

import { useSimulatedAdWatch } from "@/lib/ad";

interface Props {
  onDone: () => void;
}

/**
 * S3.5. 결과 계산 직전 광고 시청 화면.
 * 예전에는 결과 화면 중간에 광고 게이트를 넣었는데, 스크롤을 한참 내려야 나와서
 * 불편하다는 피드백을 반영해 "결과 보기"를 누른 직후 바로 광고부터 보여주고,
 * 그 다음엔 전체 결과를 한 번에 다 보여주는 방식으로 바꿨다.
 */
export default function AdWatchScreen({ onDone }: Props) {
  const { state, watch } = useSimulatedAdWatch();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-white/5 text-3xl">
        📺
      </div>
      <p className="text-lg font-bold text-white/90">
        짧은 광고를 보면
        <br />
        전체 결과를 바로 확인할 수 있어요
      </p>
      <p className="text-xs text-white/40">무료 서비스는 광고 수익으로 운영돼요</p>
      <button
        onClick={() => watch(onDone)}
        disabled={state === "playing"}
        className="w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-60"
      >
        {state === "playing" ? "광고 재생 중…" : "광고 보고 결과 확인하기"}
      </button>
    </div>
  );
}
