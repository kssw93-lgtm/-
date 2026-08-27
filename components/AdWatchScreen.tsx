"use client";

import { useEffect } from "react";
import { useAdWatch } from "@/lib/ad";
import AdSlot from "@/components/AdSlot";

interface Props {
  onDone: () => void;
}

/**
 * S3.5. 결과 계산 직전 광고 시청 화면.
 * 예전에는 결과 화면 중간에 광고 게이트를 넣었는데, 스크롤을 한참 내려야 나와서
 * 불편하다는 피드백을 반영해 "결과 보기"를 누른 직후 바로 광고부터 보여주고,
 * 그 다음엔 전체 결과를 한 번에 다 보여주는 방식으로 바꿨다.
 * 클릭해서 시청을 시작하는 중간 단계 없이 화면 진입과 동시에 광고를 띄우고,
 * 카운트다운이 끝나면 "결과 확인하기" 버튼이 활성화되는 방식으로 운영한다.
 */
export default function AdWatchScreen({ onDone }: Props) {
  const { state, secondsLeft, watch } = useAdWatch();

  useEffect(() => {
    watch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = state === "done";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs text-white/40">
        {ready ? "광고가 끝났어요" : `광고가 끝나면 결과를 확인할 수 있어요 (${secondsLeft}초)`}
      </p>
      <div className="w-full max-w-xs">
        <AdSlot label="리워드 광고" />
      </div>
      <button
        onClick={onDone}
        disabled={!ready}
        className="w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-40"
      >
        결과 확인하기
      </button>
    </div>
  );
}
