"use client";

import AdSlot from "./AdSlot";
import { useSimulatedAdWatch } from "@/lib/ad";

interface Props {
  resultText: string;
  initiallyUnlocked: boolean;
  onUnlocked: () => void;
  onBack: () => void;
}

/**
 * S6. 부가 기능 잠금 화면 (화면 흐름 설계서 07번).
 * 결과 화면(S5)에서 이미 광고를 보고 나머지 해석을 펼쳤다면(initiallyUnlocked) 여기서
 * 또 광고를 보게 하지 않고 바로 PDF/공유를 제공한다.
 * 실제 리워드 광고 SDK는 광고 네트워크 계정 준비 후 별도 연동 예정(개발 지시서 07번).
 * 지금은 "끝까지 시청 완료" 조건을 시뮬레이션하고, 해제 후 PDF는 브라우저 인쇄(무료),
 * 공유는 Web Share API(지원 시) 또는 텍스트 복사로 대체한다 — 추가 비용 없음.
 */
export default function UnlockScreen({ resultText, initiallyUnlocked, onUnlocked, onBack }: Props) {
  const { state, watch } = useSimulatedAdWatch();
  const unlocked = initiallyUnlocked || state === "done";

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "천기누설", text: resultText });
        return;
      } catch {
        // 사용자가 공유를 취소한 경우 등 — 아래 복사 폴백으로 진행
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(resultText);
      alert("결과 텍스트를 클립보드에 복사했어요.");
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      {!unlocked && (
        <>
          <p className="text-white/80">
            광고를 끝까지 보면
            <br />
            PDF 저장 / 공유가 열려요
          </p>
          <button
            onClick={() => watch(onUnlocked)}
            disabled={state === "playing"}
            className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-60"
          >
            {state === "playing" ? "광고 재생 중…" : "광고 보기"}
          </button>
          <button onClick={onBack} className="text-sm text-white/50 underline">
            돌아가기
          </button>
        </>
      )}

      {unlocked && (
        <>
          <p className="text-white/80">잠금이 해제됐어요!</p>
          <button
            onClick={() => window.print()}
            className="w-full rounded-full bg-white/10 px-8 py-4 text-base font-semibold transition hover:bg-white/20 active:scale-95"
          >
            PDF로 저장
          </button>
          <button
            onClick={handleShare}
            className="w-full rounded-full bg-white/10 px-8 py-4 text-base font-semibold transition hover:bg-white/20 active:scale-95"
          >
            공유하기
          </button>
          <AdSlot />
          <button onClick={onBack} className="text-sm text-white/50 underline">
            결과로 돌아가기
          </button>
        </>
      )}
    </div>
  );
}
