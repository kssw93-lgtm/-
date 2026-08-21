"use client";

import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import SajuDial from "./SajuDial";
import type { Category } from "@/lib/session";

interface Props {
  onSelect: (category: Category) => void;
  onSelectCompatibility: () => void;
}

const OVERALL_CATEGORY = { id: "overall" as Category, emoji: "🔮", label: "종합사주", desc: "인생 전체를 관통하는 흐름", accent: "#c9a35c" };

const CATEGORIES: { id: Category; emoji: string; label: string; desc: string; accent: string }[] = [
  { id: "love", emoji: "💕", label: "연애운", desc: "지금 내 마음과 인연의 흐름", accent: "#ff6fb1" },
  { id: "reunion", emoji: "🌙", label: "재회운", desc: "다시 이어질 인연인지", accent: "#7c93ff" },
  { id: "career", emoji: "💼", label: "직업운", desc: "나에게 맞는 일의 방향", accent: "#ffb454" },
  { id: "wealth", emoji: "💰", label: "재물운", desc: "돈이 흐르는 방향과 시기", accent: "#34d399" },
];

/** S2. 카테고리 선택 화면 (화면 흐름 설계서 03번) */
export default function CategorySelect({ onSelect, onSelectCompatibility }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center gap-8 overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/3 opacity-25">
        <SajuDial className="h-full w-full" />
      </div>

      <div className="relative z-10 text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          運勢 선택
        </span>
        <p className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          어떤 운세가 궁금하세요?
        </p>
        <p className="mt-2 text-sm text-white/50">하나를 고르면 사주를 기반으로 바로 풀이해드려요</p>
      </div>

      <div className="relative z-10 grid w-full grid-cols-2 gap-3">
        <button
          onClick={() => onSelect(OVERALL_CATEGORY.id)}
          className="group flex flex-col items-center gap-2.5 rounded-2xl border bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-4 py-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition active:scale-[0.97]"
          style={{ borderColor: `${OVERALL_CATEGORY.accent}30` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${OVERALL_CATEGORY.accent}b0`;
            e.currentTarget.style.boxShadow = `0 4px 26px ${OVERALL_CATEGORY.accent}35`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${OVERALL_CATEGORY.accent}30`;
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
          }}
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl transition"
            style={{
              background: `radial-gradient(circle, ${OVERALL_CATEGORY.accent}33 0%, rgba(0,0,0,0.3) 75%)`,
              border: `1px solid ${OVERALL_CATEGORY.accent}55`,
            }}
          >
            {OVERALL_CATEGORY.emoji}
          </span>
          <span className="text-base font-bold">{OVERALL_CATEGORY.label}</span>
          <span className="text-xs leading-snug text-white/50">{OVERALL_CATEGORY.desc}</span>
        </button>

        <button
          onClick={onSelectCompatibility}
          className="group flex flex-col items-center gap-2.5 rounded-2xl border border-[color:var(--color-gold)]/40 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/[0.02] px-4 py-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition hover:border-[color:var(--color-gold)]/80 active:scale-[0.97]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 text-2xl">
            💞
          </span>
          <span className="text-base font-bold">궁합</span>
          <span className="text-xs leading-snug text-white/50">둘의 사주를 함께 풀어봐요</span>
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="group flex flex-col items-center gap-2 rounded-2xl border bg-gradient-to-b from-white/[0.05] to-white/[0.01] px-3 py-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition active:scale-[0.97]"
            style={{ borderColor: `${c.accent}25` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${c.accent}b0`;
              e.currentTarget.style.boxShadow = `0 4px 20px ${c.accent}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${c.accent}25`;
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
            }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition"
              style={{ background: `radial-gradient(circle, ${c.accent}33 0%, rgba(0,0,0,0.3) 75%)`, border: `1px solid ${c.accent}55` }}
            >
              {c.emoji}
            </span>
            <span className="text-sm font-bold">{c.label}</span>
            <span className="text-[10.5px] leading-tight text-white/45">{c.desc}</span>
          </button>
        ))}
      </div>

      <div className="relative z-10 mt-auto flex w-full flex-col gap-3">
        <p className="text-center text-[11px] text-white/30">
          모든 결과는 실제 사주 계산(만세력)을 기반으로 만들어져요
        </p>
        <AdSlot />
        <FreeAdsNotice />
      </div>
    </div>
  );
}
