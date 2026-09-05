import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { allAnimalPairs, getAnimalEntry, getAnimalPairRelation } from "@/lib/content/zodiac-compat-pages";

export function generateStaticParams() {
  return allAnimalPairs().map(([a, b]) => ({ a, b }));
}

export function generateMetadata({ params }: { params: { a: string; b: string } }): Metadata {
  const animalA = getAnimalEntry(params.a);
  const animalB = getAnimalEntry(params.b);
  if (!animalA || !animalB) return {};
  const title = `${animalA.animal} ${animalB.animal} 궁합 | 천기누설`;
  const description = `${animalA.animal}와 ${animalB.animal}의 궁합, 12지지 관계로 실제 계산한 결과를 확인해보세요.`;
  return { title, description };
}

export default function AnimalCompatPairPage({ params }: { params: { a: string; b: string } }) {
  const [sortedA, sortedB] = allAnimalPairs().find(([a, b]) => a === params.a && b === params.b) ?? [];
  if (!sortedA || !sortedB) notFound();

  const animalA = getAnimalEntry(sortedA);
  const animalB = getAnimalEntry(sortedB);
  if (!animalA || !animalB) notFound();

  const relation = getAnimalPairRelation(sortedA, sortedB);
  const isSame = sortedA === sortedB;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/zodiac/animal-compat" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 띠 궁합 전체 모음
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div>
            <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
              {animalA.animal} {animalB.animal} 궁합
            </h1>
            <p className="mt-1 text-xs text-white/40">
              {animalA.hanja} · {animalB.hanja}
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
          같은 띠끼리의 조합이에요. 태어난 해가 달라도(12년 차이) 지지가 같기 때문에 기본 기질의 결이 비슷하게 나타나는 경향이 있어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white/85">{animalA.animal}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">{animalA.text}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white/85">{animalB.animal}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">{animalB.text}</p>
          </article>
        </div>
      )}

      <AdSlot label="본문 하단 디스플레이 광고" />

      <p className="text-xs leading-relaxed text-white/40">
        이 궁합은 태어난 해의 지지(띠)만으로 보는 참고용 재미 콘텐츠예요. 실제 궁합은 두 사람의 생년월일시 전체(일간·일지 등)를 함께 봐야 훨씬 정확해요.
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
