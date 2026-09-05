import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { GYEOKGUK_ENTRIES } from "@/lib/content/gyeokguk-pages";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | 사주 배우기 | 천기누설`,
    description: article.summary,
  };
}

export default function LearnArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const index = ARTICLES.findIndex((a) => a.slug === params.slug);
  const prev = ARTICLES[index - 1];
  const next = ARTICLES[index + 1];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/learn" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 사주 배우기 목록
        </Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-white/50">{article.summary}</p>
      </div>

      <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        {article.body.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-white/85">
            {paragraph}
          </p>
        ))}
      </article>

      {article.slug === "gyeokguk" && (
        <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
          <p className="mb-3 text-sm font-bold text-white/85">10가지 격국 살펴보기</p>
          <div className="grid grid-cols-2 gap-2">
            {GYEOKGUK_ENTRIES.map((g) => (
              <Link
                key={g.slug}
                href={`/learn/gyeokguk/${g.slug}`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:border-[color:var(--color-gold)]/60"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <AdSlot label="본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        {prev && (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
          >
            ← {prev.title}
          </Link>
        )}
        {next && (
          <Link
            href={`/learn/${next.slug}`}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
          >
            {next.title} →
          </Link>
        )}
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주 무료로 보러 가기
      </Link>
    </div>
  );
}
