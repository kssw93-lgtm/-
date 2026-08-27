"use client";

import { useAdWatch } from "@/lib/ad";
import AdSlot from "@/components/AdSlot";

interface Props {
  partnerLabel: string;
  teaser: string;
}

/**
 * 재미 콘텐츠: 광고를 보면 상대방의 "속마음"을 살짝 엿보는 컨셉으로 문구를 보여준다.
 * 실제로는 상대방의 실제 생년월일로 계산된 groupBtoA(십신 관계)를 그대로 재사용한
 * 것이라 지어낸 내용은 아니다 — 다만 "마음을 읽는다"는 확정적 표현이 아니라
 * 재미로 보는 콘텐츠임을 분명히 한다.
 */
export default function SecretMindCard({ partnerLabel, teaser }: Props) {
  const { state, secondsLeft, watch } = useAdWatch();

  if (state === "playing") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <p className="text-xs text-white/50">광고가 끝나면 자동으로 열려요 ({secondsLeft}초)</p>
        <AdSlot label="리워드 광고" />
      </div>
    );
  }

  if (state !== "done") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <span className="text-3xl">🔮</span>
        <p className="font-brand text-base font-bold text-[color:var(--color-gold-light)]">
          {partnerLabel}의 속마음 살짝 엿보기
        </p>
        <p className="text-xs text-white/50">짧은 광고를 보면 확인할 수 있어요</p>
        <button
          onClick={() => watch(() => {})}
          className="mt-1 w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3 text-sm font-bold text-[#241a08] transition hover:brightness-110 active:scale-95"
        >
          광고 보고 확인하기
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/40 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6">
      <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
        🔮 {partnerLabel}의 속마음, 살짝 엿보면
      </p>
      <p className="text-base leading-relaxed">{teaser}</p>
      <p className="mt-3 text-xs text-white/40">
        {partnerLabel}의 사주로 계산된 십신 관계를 재미있게 풀어본 내용이에요. 가볍게 즐겨주세요 :)
      </p>
    </div>
  );
}
