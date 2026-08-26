import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STAR_SIGNS, getStarSignEntry, formatDateRange } from "@/lib/content/zodiac-pages";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return STAR_SIGNS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const s = getStarSignEntry(params.id);
  if (!s) return {};
  return {
    title: `${s.name} 성격과 특징 | 천기누설`,
    description: `${s.name}(${formatDateRange(s)}) 성격, 강점과 약점을 알아보세요.`,
  };
}

export default function StarSignPage({ params }: { params: { id: string } }) {
  const s = getStarSignEntry(params.id);
  if (!s) notFound();

  const index = STAR_SIGNS.findIndex((x) => x.id === params.id);
  const prev = STAR_SIGNS[(index - 1 + STAR_SIGNS.length) % STAR_SIGNS.length];
  const next = STAR_SIGNS[(index + 1) % STAR_SIGNS.length];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/zodiac" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 별자리·띠 성격 목록
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">{s.symbol}</span>
          <div>
            <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
              {s.name} 성격과 특징
            </h1>
            <p className="mt-1 text-xs text-white/40">
              {s.hanja} · {formatDateRange(s)}
            </p>
          </div>
        </div>
      </div>

      <article className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <p className="text-[15px] leading-relaxed text-white/85">{s.text}</p>
      </article>

      <AdSlot label="본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        <Link
          href={`/zodiac/star/${prev.id}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
        >
          ← {prev.symbol} {prev.name}
        </Link>
        <Link
          href={`/zodiac/star/${next.id}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
        >
          {next.symbol} {next.name} →
        </Link>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 연애운·궁합 보러 가기
      </Link>
    </div>
  );
}
