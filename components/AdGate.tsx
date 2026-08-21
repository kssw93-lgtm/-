"use client";

import { useSimulatedAdWatch } from "@/lib/ad";

interface Props {
  unlocked: boolean;
  onUnlocked: () => void;
  children: React.ReactNode;
}

/** 결과 화면 일부를 블러 처리하고, 광고 시청 후 전체 내용을 펼쳐 보여준다. */
export default function AdGate({ unlocked, onUnlocked, children }: Props) {
  const { state, watch } = useSimulatedAdWatch();

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 rounded-2xl bg-gradient-to-b from-transparent via-[#1a1733]/70 to-[#1a1733] px-6 pb-6 pt-16">
        <p className="text-center text-sm text-white/80">
          짧은 광고를 보면
          <br />
          나머지 해석을 바로 볼 수 있어요
        </p>
        <button
          onClick={() => watch(onUnlocked)}
          disabled={state === "playing"}
          className="w-full max-w-xs rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[#241a08] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-60"
        >
          {state === "playing" ? "광고 재생 중…" : "광고 보고 더 보기 ▾"}
        </button>
      </div>
    </div>
  );
}
