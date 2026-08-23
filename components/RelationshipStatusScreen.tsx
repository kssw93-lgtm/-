"use client";

import type { RelationshipStatus } from "@/lib/interpretation";

interface Props {
  onSelect: (status: RelationshipStatus) => void;
  onBack: () => void;
}

/**
 * S2.5. 연애운 전용 — 현재 연애 상태를 먼저 물어본다. 솔로면 "인연이 언제·어떻게
 * 올까"에 초점을 맞추고, 연애 중이면 "지금 관계를 어떻게 다뤄야 할지"로 내용을
 * 바꿔서 보여준다(같은 사람도 상태에 따라 실제로 궁금한 게 다르기 때문).
 */
export default function RelationshipStatusScreen({ onSelect, onBack }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <button onClick={onBack} className="absolute left-6 top-8 text-sm text-white/40 hover:text-white/70">
        ← 뒤로
      </button>

      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-white/5 text-3xl">
        💕
      </div>
      <div>
        <p className="text-lg font-bold text-white/90">지금 연애 중이세요?</p>
        <p className="mt-2 text-sm text-white/50">상태에 따라 보여드리는 내용이 달라져요</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={() => onSelect("single")}
          className="w-full rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-white/90 transition hover:bg-white/15 active:scale-95"
        >
          솔로예요 — 다음 인연이 궁금해요
        </button>
        <button
          onClick={() => onSelect("dating")}
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-base font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition hover:brightness-110 active:scale-95"
        >
          연애 중이에요 — 지금 관계가 궁금해요
        </button>
      </div>
    </div>
  );
}
