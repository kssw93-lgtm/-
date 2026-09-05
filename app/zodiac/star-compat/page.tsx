import Link from "next/link";
import type { Metadata } from "next";
import { allStarPairs, getStarEntry, getStarPairRelation } from "@/lib/content/zodiac-compat-pages";

export const metadata: Metadata = {
  title: "별자리 궁합 전체 모음 | 12별자리 조합 78가지 | 천기누설",
  description: "양자리부터 물고기자리까지, 12별자리로 만들 수 있는 78가지 조합의 궁합을 4원소 배속으로 확인해보세요.",
};

export default function StarCompatIndexPage() {
  const pairs = allStarPairs();

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/zodiac" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 별자리·띠 성격 목록
        </Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          별자리 궁합 전체 모음
        </h1>
        <p className="mt-2 text-sm text-white/50">
          12별자리로 만들 수 있는 조합은 총 78가지예요. 궁금한 두 별자리를 눌러 4원소(불·흙·바람·물) 배속으로 계산한 궁합을 확인해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {pairs.map(([a, b]) => {
          const starA = getStarEntry(a);
          const starB = getStarEntry(b);
          if (!starA || !starB) return null;
          const relation = getStarPairRelation(a, b);
          return (
            <Link
              key={`${a}-${b}`}
              href={`/zodiac/star-compat/${a}/${b}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 px-4 py-3 text-sm transition hover:border-[color:var(--color-gold)]/60"
            >
              <span className="text-white/85">
                {starA.symbol} {starA.name} × {starB.symbol} {starB.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <span>{relation.emoji}</span>
                <span>{relation.label}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 실제 궁합 보러 가기
      </Link>
    </div>
  );
}
