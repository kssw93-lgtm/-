import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "사주 배우기 | 천기누설",
  description: "천간·지지·오행·십신·대운·격국까지, 사주 명리학의 기본 개념을 쉽게 풀어쓴 글 모음이에요.",
};

export default function LearnIndexPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          四柱命理 · 배우기
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          사주 배우기
        </h1>
        <p className="mt-2 text-sm text-white/50">
          결과를 더 잘 이해하고 싶다면, 사주의 기본 개념부터 차근차근 살펴보세요
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/learn/${a.slug}`}
            className="group flex flex-col gap-1.5 rounded-2xl border border-[color:var(--color-gold)]/25 bg-gradient-to-b from-white/[0.06] to-white/[0.01] px-5 py-4 transition hover:border-[color:var(--color-gold)]/60"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white/95">{a.title}</h2>
              <span className="text-xs text-white/30">{a.minuteRead}분</span>
            </div>
            <p className="text-sm leading-relaxed text-white/55">{a.summary}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-4 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주 무료로 보러 가기
      </Link>
    </div>
  );
}
