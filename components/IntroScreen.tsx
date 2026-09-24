"use client";

import Link from "next/link";
import SajuDial from "./SajuDial";
import type { Category } from "@/lib/session";

interface Props {
  onStart: () => void;
  onSelectCategory: (category: Category) => void;
  onSelectCompatibility: () => void;
  /** 저장된 생년월일 정보가 있을 때만 이름(또는 null)을 전달 — 있으면 오늘의 운세 바로가기를 보여준다. */
  savedName?: string | null;
  onQuickDaily?: () => void;
}

const QUICK_CATEGORIES: {
  id: Category;
  symbol: string;
  label: string;
  description: string;
  accent: string;
}[] = [
  { id: "love", symbol: "♡", label: "연애운", description: "마음과 인연의 흐름", accent: "#f08aaa" },
  { id: "wealth", symbol: "₩", label: "재물운", description: "돈이 흐르는 방향과 시기", accent: "#d6b875" },
  { id: "career", symbol: "↗", label: "직업운", description: "나에게 맞는 일의 방향", accent: "#86bba9" },
  { id: "reunion", symbol: "☾", label: "재회운", description: "다시 이어질 인연의 흐름", accent: "#9ca9e9" },
  { id: "overall", symbol: "✦", label: "종합사주", description: "원국 전반과 삶의 흐름", accent: "#d6b875" },
];

/** 첫 화면 — 사주달력의 계산 방식과 주요 운세를 바로 발견할 수 있는 시작점. */
export default function IntroScreen({
  onStart,
  onSelectCategory,
  onSelectCompatibility,
  savedName,
  onQuickDaily,
}: Props) {
  return (
    <div className="relative flex flex-1 flex-col gap-6 overflow-hidden px-5 pb-10 pt-5 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-8 h-[390px] w-[390px] opacity-[0.12]">
        <SajuDial className="h-full w-full" />
      </div>

      <section className="relative z-10 overflow-hidden rounded-[28px] border border-[color:var(--color-gold)]/20 bg-gradient-to-br from-[#211d30] via-[#111321] to-[#0a0c16] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-12 h-52 w-52 opacity-30">
          <SajuDial className="h-full w-full" />
        </div>
        <div className="relative z-10 max-w-[19rem]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-black/20 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-[color:var(--color-gold-light)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold-light)]" />
            SAJU DALYEOK · 사주 원국 풀이
          </span>

          <h1 className="font-brand mt-4 text-[30px] font-black leading-[1.35] text-[color:var(--color-ink)]">
            태어난 순간의 기운을
            <br />
            오늘의 흐름으로
          </h1>
          <p className="mt-2.5 text-sm leading-6 text-white/65">
            생년월일시로 사주 원국을 계산하고, 연애·재물·일·관계의 흐름을 주제별로 읽어드려요.
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
            {typeof savedName === "string" && onQuickDaily && (
              <button
                onClick={onQuickDaily}
                className="w-full rounded-2xl border border-[color:var(--color-gold)]/40 bg-black/20 px-5 py-3.5 text-sm font-bold text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/10 active:scale-[0.98]"
              >
                ☀️ {savedName.trim() ? `${savedName.trim()}님, ` : ""}오늘의 운세 보기
              </button>
            )}
            <button
              onClick={onStart}
              className="w-full rounded-2xl bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-5 py-4 text-base font-bold text-[#241a08] shadow-[0_8px_28px_rgba(201,163,92,0.23)] transition hover:brightness-110 active:scale-[0.98]"
            >
              {typeof savedName === "string" ? "다른 운세 찾아보기" : "무료로 사주 풀이 시작하기"}
              <span aria-hidden="true" className="ml-2">→</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-white/40">로그인 없이 시작 · 자세한 결과는 광고 시청 후 확인</p>
        </div>
      </section>

      <section aria-labelledby="fortune-topics" className="relative z-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/70">YOUR READING</p>
            <h2 id="fortune-topics" className="mt-1 text-lg font-bold">지금 궁금한 운세를 골라보세요</h2>
          </div>
          <span className="pb-0.5 text-[10px] text-white/40">말투 선택 후 바로 시작</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_CATEGORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="group flex min-h-[102px] flex-col items-start justify-between rounded-2xl border bg-white/[0.035] p-3.5 text-left transition hover:bg-white/[0.07] active:scale-[0.98]"
              style={{ borderColor: `${item.accent}35` }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl text-lg font-semibold"
                style={{ color: item.accent, backgroundColor: `${item.accent}18` }}
              >
                {item.symbol}
              </span>
              <span className="mt-3 block">
                <span className="block text-sm font-bold text-white/90">{item.label}</span>
                <span className="mt-0.5 block text-[10px] leading-snug text-white/45">{item.description}</span>
              </span>
            </button>
          ))}
          <button
            onClick={onSelectCompatibility}
            className="flex min-h-[102px] flex-col items-start justify-between rounded-2xl border border-[color:var(--color-gold)]/35 bg-gradient-to-br from-[color:var(--color-gold)]/10 to-white/[0.02] p-3.5 text-left transition hover:border-[color:var(--color-gold)]/60 active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--color-gold)]/15 text-lg text-[color:var(--color-gold-light)]">♧</span>
            <span className="mt-3 block">
              <span className="block text-sm font-bold text-white/90">두 사람 궁합</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-white/45">각자의 사주와 관계 흐름</span>
            </span>
          </button>
        </div>
      </section>

      <section className="relative z-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[color:var(--color-gold)]/10 text-sm text-[color:var(--color-gold-light)]">◎</span>
          <div>
            <h2 className="text-sm font-bold">풀이가 만들어지는 순서</h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">출생 정보에서 계산한 원국을 주제별 해석과 오늘의 흐름에 연결해요.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["01", "출생 정보"],
            ["02", "사주 원국"],
            ["03", "주제별 풀이"],
          ].map(([number, label]) => (
            <div key={number} className="rounded-xl bg-black/15 px-2 py-2.5">
              <span className="block text-[10px] font-bold text-[color:var(--color-gold-light)]">{number}</span>
              <span className="mt-1 block text-[10px] text-white/55">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <nav aria-label="더 둘러보기" className="relative z-10 grid grid-cols-3 gap-2">
        <Link href="/learn" className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center text-[11px] font-medium text-white/65 transition hover:border-[color:var(--color-gold)]/35 hover:text-white">
          📖 사주 배우기
        </Link>
        <Link href="/zodiac" className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center text-[11px] font-medium text-white/65 transition hover:border-[color:var(--color-gold)]/35 hover:text-white">
          ♈ 별자리·띠
        </Link>
        <Link href="/tarot-guide" className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center text-[11px] font-medium text-white/65 transition hover:border-[color:var(--color-gold)]/35 hover:text-white">
          🃏 타로 백과
        </Link>
      </nav>
    </div>
  );
}
