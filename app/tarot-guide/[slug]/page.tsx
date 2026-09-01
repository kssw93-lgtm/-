import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TAROT_CARDS, getTarotCard } from "@/lib/content/tarot";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return TAROT_CARDS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getTarotCard(params.slug);
  if (!c) return {};
  return {
    title: `${c.nameKo}(${c.nameEn}) 타로카드 의미 | 천기누설`,
    description: c.summary,
  };
}

const READING_ORDER = [
  { key: "love", label: "💕 연애운" },
  { key: "money", label: "💰 금전운" },
  { key: "career", label: "💼 직업운" },
  { key: "health", label: "🩺 건강운" },
] as const;

export default function TarotCardPage({ params }: { params: { slug: string } }) {
  const c = getTarotCard(params.slug);
  if (!c) notFound();

  const index = TAROT_CARDS.findIndex((x) => x.slug === params.slug);
  const prev = TAROT_CARDS[(index - 1 + TAROT_CARDS.length) % TAROT_CARDS.length];
  const next = TAROT_CARDS[(index + 1) % TAROT_CARDS.length];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/tarot-guide" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 타로 카드 백과사전
        </Link>
        <div className="mt-3 text-center">
          <span className="text-xs text-[color:var(--color-gold-light)]/70">{c.number}</span>
          <h1 className="font-brand mt-1 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
            {c.nameKo}
          </h1>
          <p className="mt-1 text-xs text-white/40">
            {c.nameEn} · {c.element}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[240px]">
        <div className="relative aspect-[11/19] w-full overflow-hidden rounded-2xl border border-[color:var(--color-gold)]/30 shadow-lg shadow-black/40">
          <Image
            src={`/tarot/${c.slug}.jpg`}
            alt={`${c.nameKo}(${c.nameEn}) 타로카드 이미지`}
            fill
            priority
            sizes="240px"
            className="object-cover"
          />
        </div>
        <p className="mt-2 text-center text-[10px] text-white/30">
          Rider–Waite–Smith tarot deck (Public Domain, 1909)
        </p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-center">
        <p className="text-base leading-relaxed text-white/85">{c.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">🔼 정방향 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {c.keywords.upright.map((k) => (
              <span key={k} className="rounded-full bg-[color:var(--color-gold)]/15 px-2.5 py-1 text-xs text-[color:var(--color-gold-light)]">
                #{k}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold text-white/50">🔽 역방향 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {c.keywords.reversed.map((k) => (
              <span key={k} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">
                #{k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">카드 속 상징</p>
        <div className="flex flex-col gap-3">
          {c.symbols.map((s) => (
            <div key={s.name} className="rounded-lg bg-white/5 p-3">
              <p className="text-sm font-bold">{s.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <AdSlot label="타로 카드 본문 중단 디스플레이 광고" />

      <div className="flex flex-col gap-4">
        {READING_ORDER.map(({ key, label }) => {
          const r = c.readings[key];
          return (
            <div key={key} className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
                {label} · {r.title}
              </p>
              <div className="flex flex-col gap-2 text-sm leading-relaxed">
                <p>
                  <span className="text-white/50">🔼 정방향 </span>
                  <span className="text-white/85">{r.upright}</span>
                </p>
                <p>
                  <span className="text-white/50">🔽 역방향 </span>
                  <span className="text-white/85">{r.reversed}</span>
                </p>
                <p className="mt-1 border-t border-white/10 pt-2 text-white/60">💡 {r.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/baekho-dosa.svg" alt="백호도사" width={48} height={62} className="rounded-lg" />
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">백호도사의 한마디</p>
        </div>
        <p className="text-base leading-relaxed text-white/90">{c.baekhoAdvice}</p>
      </div>

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">✅ 오늘의 실천 과제</p>
        <p className="text-base leading-relaxed">{c.actionItem}</p>
      </div>

      <p className="text-center text-xs leading-relaxed text-white/40">
        🔮 타로 카드는 전통적인 상징 해석을 바탕으로 한 참고용 콘텐츠이며, 실제 미래나 사실을 확정하는 내용은 아닙니다.
      </p>

      <AdSlot label="타로 카드 본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        <Link
          href={`/tarot-guide/${prev.slug}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
        >
          ← {prev.number} {prev.nameKo}
        </Link>
        <Link
          href={`/tarot-guide/${next.slug}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
        >
          {next.number} {next.nameKo} →
        </Link>
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
