import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { TAROT_CARDS } from "@/lib/content/tarot";

export const metadata: Metadata = {
  title: "타로 카드 백과사전 · 메이저 아르카나 22장 | 천기누설",
  description: "메이저 아르카나 22장의 의미, 정방향·역방향 키워드, 연애·금전·직업·건강 해석을 백호도사와 함께 알아보세요.",
};

export default function TarotGuideIndexPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          타로 백과사전
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          메이저 아르카나 22장
        </h1>
        <p className="mt-2 text-sm text-white/50">
          🐯 백호도사와 함께 카드 하나하나의 의미를 알아보세요
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/baekho-dosa.svg" alt="백호도사" width={140} height={182} className="rounded-xl" />
        <p className="text-sm leading-relaxed text-white/70">
          "카드 한 장 한 장에는 다 뜻이 있느니라. 천천히 살펴보거라." — 백호도사
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TAROT_CARDS.map((c) => (
          <Link
            key={c.slug}
            href={`/tarot-guide/${c.slug}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 p-3 text-center transition hover:border-[color:var(--color-gold)]/60"
          >
            <div className="relative aspect-[11/19] w-full overflow-hidden rounded-lg bg-black/20">
              <Image
                src={`/tarot/${c.slug}.jpg`}
                alt={`${c.nameKo}(${c.nameEn}) 타로카드`}
                fill
                sizes="(max-width: 480px) 45vw, 200px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="block text-xs text-[color:var(--color-gold-light)]/70">{c.number}</span>
              <span className="block text-sm font-semibold text-white/85">{c.nameKo}</span>
              <span className="block text-[10px] text-white/30">{c.nameEn}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        🔮 내 운명 백호도사 타로로 직접 뽑아보기
      </Link>
    </div>
  );
}
