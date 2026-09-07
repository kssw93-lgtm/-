import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { allStarPairs, getStarEntry, getStarPairRelation } from "@/lib/content/zodiac-compat-pages";

export function generateStaticParams() {
  return allStarPairs().map(([a, b]) => ({ a, b }));
}

export function generateMetadata({ params }: { params: { a: string; b: string } }): Metadata {
  const starA = getStarEntry(params.a);
  const starB = getStarEntry(params.b);
  if (!starA || !starB) return {};
  const title = `${starA.name} ${starB.name} 궁합 | 사주달력`;
  const description = `${starA.name}와 ${starB.name}의 궁합, 4원소 배속으로 실제 계산한 결과를 확인해보세요.`;
  return {
    title,
    description,
    // 애드센스 "가치가 별로 없는 콘텐츠" 반려 대응: 78쌍이 동일한 문단 구조를 공유하는
    // 조합형 페이지라 대량으로 검색엔진에 노출되면 얇은 콘텐츠로 비칠 수 있다. 페이지
    // 자체는 유지하고(링크로는 접근 가능) 색인에서만 잠시 뺀다 — 승인 후 재검토.
    robots: { index: false, follow: true },
  };
}

export default function StarCompatPairPage({ params }: { params: { a: string; b: string } }) {
  const [sortedA, sortedB] = allStarPairs().find(([a, b]) => a === params.a && b === params.b) ?? [];
  if (!sortedA || !sortedB) notFound();

  const starA = getStarEntry(sortedA);
  const starB = getStarEntry(sortedB);
  if (!starA || !starB) notFound();

  const relation = getStarPairRelation(sortedA, sortedB);
  const isSame = sortedA === sortedB;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "별자리·띠 성격", path: "/zodiac" },
          { name: "별자리 궁합 전체 모음", path: "/zodiac/star-compat" },
          { name: `${starA.name} ${starB.name} 궁합`, path: `/zodiac/star-compat/${sortedA}/${sortedB}` },
        ])}
      />
      <div>
        <Link href="/zodiac/star-compat" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 별자리 궁합 전체 모음
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">
            {starA.symbol}
            {starB.symbol}
          </span>
          <div>
            <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
              {starA.name} {starB.name} 궁합
            </h1>
            <p className="mt-1 text-xs text-white/40">
              {starA.hanja} · {starB.hanja}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{relation.emoji}</span>
          <span className="text-base font-bold text-white/90">{relation.label}</span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-white/85">{relation.desc}</p>
      </div>

      {isSame ? (
        <p className="text-xs leading-relaxed text-white/40">
          같은 별자리끼리의 조합이에요. 태어난 날짜대가 같은 시기라 기본적인 기질의 결이 비슷하게 나타나는 경향이 있어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white/85">
              {starA.symbol} {starA.name}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">{starA.text}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white/85">
              {starB.symbol} {starB.name}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">{starB.text}</p>
          </article>
        </div>
      )}

      <AdSlot label="본문 하단 디스플레이 광고" />

      <p className="text-xs leading-relaxed text-white/40">
        이 궁합은 태어난 날짜로 정해지는 별자리와 그 4원소 배속만으로 보는 참고용 재미 콘텐츠예요. 실제 궁합은 두 사람의 생년월일시 전체(사주 일간·일지 등)를 함께 봐야 훨씬 정확해요.
      </p>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 실제 궁합 보러 가기
      </Link>
    </div>
  );
}
