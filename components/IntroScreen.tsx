"use client";

import SajuDial from "./SajuDial";

interface Props {
  onStart: () => void;
  /** 저장된 생년월일 정보가 있을 때만 이름(또는 null)을 전달 — 있으면 "오늘의 운세" 빠른 진입 버튼을 보여준다. */
  savedName?: string | null;
  onQuickDaily?: () => void;
}

/** S1. 인트로 화면 (화면 흐름 설계서 02번) */
export default function IntroScreen({ onStart, savedName, onQuickDaily }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-70">
        <SajuDial className="h-full w-full animate-[spin_120s_linear_infinite]" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.2em] text-[color:var(--color-gold-light)]">
          四柱命理 · 무료
        </span>

        <h1 className="font-brand text-4xl font-black leading-tight text-[color:var(--color-gold-light)] drop-shadow-[0_0_20px_rgba(201,163,92,0.35)]">
          천기누설
        </h1>

        <p className="text-lg leading-relaxed text-white/85">
          태어난 순간에 새겨진 사주,
          <br />
          오늘 당신의 운세가 궁금한가요?
        </p>

        {typeof savedName === "string" && onQuickDaily && (
          <button
            onClick={onQuickDaily}
            className="w-64 rounded-full border border-[color:var(--color-gold)]/50 bg-black/30 px-8 py-3.5 text-base font-bold text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/10 active:scale-95"
          >
            ☀️ {savedName.trim() ? `${savedName.trim()}님, ` : ""}오늘의 운세 보기
          </button>
        )}

        <button
          onClick={onStart}
          className="w-64 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition hover:brightness-110 active:scale-95"
        >
          {typeof savedName === "string" ? "다른 운세 보기" : "무료로 사주 보기"}
        </button>

        <p className="text-xs text-white/40">로그인 없이 1분이면 확인할 수 있어요</p>
      </div>
    </div>
  );
}
