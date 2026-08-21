"use client";

import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

/**
 * S4. 계산 처리(로딩) 화면 (화면 흐름 설계서 05번).
 * 확정 사항: 최소 노출 시간 0.8초 고정.
 */
export default function CalculatingLoader({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-[color:var(--color-gold)]" />
      <p className="text-white/80">사주를 살펴보고 있어요…</p>
    </div>
  );
}
