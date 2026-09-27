import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZODIAC_ANIMALS, getZodiacAnimalEntry } from "@/lib/content/zodiac-pages";
import { computeAnimalDailyFortune } from "@/lib/interpretation/daily-branch-fortune";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { BranchId } from "@/lib/calc/types";

/** 오늘의 띠별 운세는 날짜가 바뀌면 내용도 바뀌어야 하므로, 정적 페이지를 일정
 * 주기로 다시 생성한다(하루보다 촘촘히 잡아 자정 근처 지연도 크게 벌어지지 않게 함). */
export const revalidate = 1800;

export function generateStaticParams() {
  return ZODIAC_ANIMALS.map((z) => ({ branch: z.branch }));
}

export function generateMetadata({ params }: { params: { branch: string } }): Metadata {
  const z = getZodiacAnimalEntry(params.branch);
  if (!z) return {};
  const title = `${z.animal} 성격과 오늘의 운세 | 사주달력`;
  const description = `${z.animal}(${z.hanja})의 성격과 특징, 오늘의 띠별 운세까지 무료로 확인하세요.`;
  const path = `/zodiac/animal/${z.branch}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default function ZodiacAnimalPage({ params }: { params: { branch: string } }) {
  const z = getZodiacAnimalEntry(params.branch);
  if (!z) notFound();
  const daily = computeAnimalDailyFortune(params.branch as BranchId);

  const index = ZODIAC_ANIMALS.findIndex((x) => x.branch === params.branch);
  const prev = ZODIAC_ANIMALS[(index - 1 + ZODIAC_ANIMALS.length) % ZODIAC_ANIMALS.length];
  const next = ZODIAC_ANIMALS[(index + 1) % ZODIAC_ANIMALS.length];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "별자리·띠 성격", path: "/zodiac" },
          { name: `${z.animal} 성격과 특징`, path: `/zodiac/animal/${z.branch}` },
        ])}
      />
      <div>
        <Link href="/zodiac" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 별자리·띠 성격 목록
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div>
            <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
              {z.animal} 성격과 특징
            </h1>
            <p className="mt-1 text-xs text-white/40">{z.hanja}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="today-fortune" className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-6 text-center">
        <p className="text-xs text-white/40">{daily.dateLabel}</p>
        <h2 id="today-fortune" className="mt-1 text-sm font-semibold text-[color:var(--color-gold-light)]">
          오늘의 {z.animal} 운세
        </h2>
        <p className="mt-3 text-5xl font-black" style={{ color: "#e8cd94" }}>
          {daily.score}
          <span className="text-2xl">점</span>
        </p>
        <p className="mt-2 text-lg font-bold">
          {daily.emoji} {daily.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{daily.headline}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{daily.summary}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 text-left sm:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-white/50">💕 연애</p>
            <p className="mt-1 text-sm text-white/85">{daily.loveNote}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-white/50">💰 금전</p>
            <p className="mt-1 text-sm text-white/85">{daily.moneyNote}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/40">⚠️ {daily.caution}</p>
      </section>

      <article className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <p className="text-[15px] leading-relaxed text-white/85">{z.text}</p>
      </article>

      {z.body && z.body.length > 0 && (
        <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
          {z.body.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-white/85">
              {paragraph}
            </p>
          ))}
        </article>
      )}

      <Link
        href="/learn/samjae"
        className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 transition hover:border-[color:var(--color-gold)]/60"
      >
        <p className="text-sm font-bold text-white/85">🔮 내 띠의 삼재 시기가 궁금하다면?</p>
        <p className="mt-1 text-xs text-white/50">삼재(三災)란 무엇인가요? 내 띠는 언제일까 →</p>
      </Link>

      <AdSlot label="본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        <Link
          href={`/zodiac/animal/${prev.branch}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
        >
          ← {prev.animal}
        </Link>
        <Link
          href={`/zodiac/animal/${next.branch}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
        >
          {next.animal} →
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
