import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { GYEOKGUK_ENTRIES, getGyeokgukEntry } from "@/lib/content/gyeokguk-pages";

export function generateStaticParams() {
  return GYEOKGUK_ENTRIES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGyeokgukEntry(params.slug);
  if (!g) return {};
  return {
    title: `${g.name}이란 무엇인가요? | 격국 | 천기누설`,
    description: `${g.name}(${g.subtitle}) — 강점과 약점, 격국의 의미를 알아보세요.`,
  };
}

export default function GyeokgukDetailPage({ params }: { params: { slug: string } }) {
  const g = getGyeokgukEntry(params.slug);
  if (!g) notFound();

  const index = GYEOKGUK_ENTRIES.findIndex((x) => x.slug === params.slug);
  const prev = GYEOKGUK_ENTRIES[(index - 1 + GYEOKGUK_ENTRIES.length) % GYEOKGUK_ENTRIES.length];
  const next = GYEOKGUK_ENTRIES[(index + 1) % GYEOKGUK_ENTRIES.length];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/learn/gyeokguk" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 격국(格局)이란 무엇인가요?
        </Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          {g.name}이란 무엇인가요?
        </h1>
        <p className="mt-2 text-sm text-white/50">{g.subtitle}</p>
      </div>

      <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <div>
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">강점</p>
          <p className="mt-1 text-[15px] leading-relaxed text-white/85">{g.strength}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">주의할 점</p>
          <p className="mt-1 text-[15px] leading-relaxed text-white/85">{g.weakness}</p>
        </div>
        {g.slug === "geopjae" && (
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs leading-relaxed text-white/50">
              같은 겁재(劫財)라도 일간이 양간(갑·병·무·경·임)이면 &apos;양인격&apos;, 음간(을·정·기·신·계)이면
              &apos;겁재격&apos;이라고 이름만 다르게 불러요. 강점·약점의 방향은 같아요.
            </p>
          </div>
        )}
      </article>

      <p className="text-xs leading-relaxed text-white/40">
        격국은 사주 원국에서 월지(태어난 달의 지지) 속 본기가 일간을 기준으로 어떤 십신에 해당하는지로 정해요. 자세한 원리는{" "}
        <Link href="/learn/gyeokguk" className="text-[color:var(--color-gold-light)] underline">
          격국(格局)이란 무엇인가요?
        </Link>{" "}
        글에서 확인할 수 있어요.
      </p>

      <AdSlot label="본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        <Link
          href={`/learn/gyeokguk/${prev.slug}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
        >
          ← {prev.name}
        </Link>
        <Link
          href={`/learn/gyeokguk/${next.slug}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
        >
          {next.name} →
        </Link>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 내 격국 확인하러 가기
      </Link>
    </div>
  );
}
