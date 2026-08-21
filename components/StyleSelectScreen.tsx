"use client";

import SajuDial from "./SajuDial";
import ToneMascot from "./ToneMascot";
import { TONE_STYLE_LIST } from "@/lib/interpretation/tone-style";
import type { ToneStyleId } from "@/lib/session";

interface Props {
  toneStyle: ToneStyleId;
  onSelectToneStyle: (style: ToneStyleId) => void;
  onNext: () => void;
}

const STYLE_ACCENT: Record<ToneStyleId, string> = {
  standard: "#c9a35c",
  mz: "#ff6fb1",
  joseon: "#e0776a",
};

/** S1.5. 말투 스타일 선택 화면 — 인트로 다음, 카테고리 선택 이전에 오는 고정 단계. */
export default function StyleSelectScreen({ toneStyle, onSelectToneStyle, onNext }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/3 opacity-20">
        <SajuDial className="h-full w-full" />
      </div>

      <div className="relative z-10 text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          말투 선택
        </span>
        <p className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          어떤 말투로 풀어드릴까요?
        </p>
        <p className="mt-2 text-sm text-white/50">고르신 말투로 앞으로의 모든 결과가 나와요</p>
      </div>

      <div className="relative z-10 grid w-full grid-cols-3 gap-3">
        {TONE_STYLE_LIST.map((s, i) => {
          const selected = toneStyle === s.id;
          const accent = STYLE_ACCENT[s.id];
          return (
            <button
              key={s.id}
              onClick={() => onSelectToneStyle(s.id)}
              className="group relative flex flex-col items-center gap-2.5 rounded-2xl border px-2 py-5 pt-10 text-center transition active:scale-95"
              style={{
                borderColor: selected ? accent : "rgba(255,255,255,0.12)",
                background: selected
                  ? `linear-gradient(180deg, ${accent}26 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.03)",
                boxShadow: selected ? `0 0 26px ${accent}45` : "none",
              }}
            >
              {/* 말풍선 대사 */}
              <span
                key={`${s.id}-${selected}`}
                className="bubble-pop pointer-events-none absolute -top-2 left-1/2 z-10 w-max max-w-[112px] -translate-x-1/2 rounded-lg border border-white/15 bg-[#181229] px-2 py-1.5 text-[10px] leading-tight text-white/85 shadow-lg"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {s.preview}
                <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-white/15 bg-[#181229]" />
              </span>

              <div className="relative h-16 w-16">
                <div className="mascot-float absolute inset-0 rounded-full" style={{ animationDelay: `${i * 0.25}s` }}>
                  <ToneMascot style={s.id} className="h-full w-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />
                </div>
              </div>

              <span className="text-sm font-bold" style={{ color: selected ? accent : "rgba(255,255,255,0.85)" }}>
                {s.emoji} {s.label}
              </span>
              <span className="text-[10.5px] leading-tight text-white/40">{s.tagline}</span>

              {selected && (
                <span
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-[#241a08]"
                  style={{ background: accent }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="relative z-10 mt-2 w-64 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition hover:brightness-110 active:scale-95"
      >
        이 말투로 볼래요
      </button>
      <p className="relative z-10 text-xs text-white/40">나중에 언제든 바꿀 수 있어요</p>
    </div>
  );
}
