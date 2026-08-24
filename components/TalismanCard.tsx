"use client";

import { useSimulatedAdWatch } from "@/lib/ad";
import type { CoreSummary, Gyeokguk, LuckColorDisplay } from "@/lib/interpretation";

interface Props {
  displayName: string;
  luckColor: LuckColorDisplay | null;
  coreSummary: CoreSummary;
  gyeokguk: Gyeokguk;
}

/**
 * 재미 콘텐츠: 광고를 보면 이미 계산된 값(행운의 컬러·숫자, 핵심 키워드, 격국)을
 * 부적 느낌으로 재구성해 보여준다. 새 계산 없음 — 전부 이미 화면 다른 곳에도 나오는
 * 값을 다시 조합해 "재미로 보는" 카드로 꾸민 것뿐이라 없는 사실을 지어내지 않는다.
 */
export default function TalismanCard({ displayName, luckColor, coreSummary, gyeokguk }: Props) {
  const { state, watch } = useSimulatedAdWatch();

  if (state !== "done") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <span className="text-3xl">🧿</span>
        <p className="font-brand text-base font-bold text-[color:var(--color-gold-light)]">나만의 개운 부적 받기</p>
        <p className="text-xs text-white/50">짧은 광고를 보면 나만의 부적이 만들어져요</p>
        <button
          onClick={() => watch(() => {})}
          disabled={state === "playing"}
          className="mt-1 w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3 text-sm font-bold text-[#241a08] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-60"
        >
          {state === "playing" ? "부적 만드는 중…" : "광고 보고 부적 받기"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[color:var(--color-gold)]/50 bg-gradient-to-b from-[color:var(--color-gold)]/15 via-transparent to-[color:var(--color-gold)]/10 p-6 text-center">
      <p className="text-[10px] tracking-[0.3em] text-[color:var(--color-gold-light)]/70">開 運 符</p>
      <div className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[color:var(--color-gold)]/60 bg-black/20">
        <span className="font-brand text-lg font-bold text-[color:var(--color-gold-light)]">{gyeokguk.name}</span>
      </div>
      <p className="font-brand mt-4 text-base font-bold text-[color:var(--color-gold-light)]">
        {displayName}님을 위한 개운 부적
      </p>
      {luckColor && (
        <p className="mt-2 text-sm text-white/80">
          행운의 컬러 <span className="font-semibold text-[color:var(--color-gold-light)]">{luckColor.color}</span> · 행운의 숫자{" "}
          <span className="font-semibold text-[color:var(--color-gold-light)]">{luckColor.numbers.join(", ")}</span>
        </p>
      )}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {coreSummary.keywords.map((k) => (
          <span key={k} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            #{k}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/40">
        이 색과 숫자를 오늘 하루 곁에 두어보세요. 재미로 보는 개운 아이템이에요 :)
      </p>
    </div>
  );
}
