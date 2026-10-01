import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZODIAC_ANIMALS, getZodiacAnimalEntry } from "@/lib/content/zodiac-pages";
import { computeNewYearFortune } from "@/lib/interpretation/newyear-fortune";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { BranchId } from "@/lib/calc/types";

export function generateStaticParams() {
  return ZODIAC_ANIMALS.map((z) => ({ branch: z.branch }));
}

export function generateMetadata({ params }: { params: { branch: string } }): Metadata {
  const z = getZodiacAnimalEntry(params.branch);
  if (!z) return {};
  const title = `2027년 ${z.animal} 운세 — 정미년 신년운세 | 사주달력`;
  const description = `2027년 정미년(丁未年), ${z.animal}의 종합운·직업운·재물운·애정운을 무료로 확인하세요.`;
  const path = `/newyear/2027/${z.branch}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default function NewYear2027AnimalPage({ params }: { params: { branch: string } }) {
  const z = getZodiacAnimalEntry(params.branch);
  if (!z) notFound();
  const fortune = computeNewYearFortune(params.branch as BranchId, 2027);

  const index = ZODIAC_ANIMALS.findIndex((x) => x.branch === params.branch);
  const prev = ZODIAC_ANIMALS[(index - 1 + ZODIAC_ANIMALS.length) % ZODIAC_ANIMALS.length];
  const next = ZODIAC_ANIMALS[(index + 1) % ZODIAC_ANIMALS.length];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "2027년 신년운세", path: "/newyear/2027" },
          { name: `2027년 ${z.animal} 운세`, path: `/newyear/2027/${z.branch}` },
        ])}
      />
      <div>
        <Link href="/newyear/2027" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 2027년 띠별 신년운세 목록
        </Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          2027년 {z.animal} 신년운세
        </h1>
        <p className="mt-1 text-xs text-white/40">2027년 丁未年(정미년) · {z.hanja}</p>
      </div>

      <section className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-6 text-center">
        <p className="text-5xl font-black" style={{ color: "#e8cd94" }}>
          {fortune.score}
          <span className="text-2xl">점</span>
        </p>
        <p className="mt-2 text-lg font-bold">
          {fortune.emoji} {fortune.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{fortune.headline}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{fortune.overall}</p>
      </section>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/50">💼 2027년 직업운</p>
          <p className="mt-1 text-sm text-white/85">{fortune.careerNote}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/50">💰 2027년 재물운</p>
          <p className="mt-1 text-sm text-white/85">{fortune.wealthNote}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/50">💕 2027년 애정운</p>
          <p className="mt-1 text-sm text-white/85">{fortune.loveNote}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="text-xs text-amber-200/70">⚠️ 2027년 주의할 점</p>
          <p className="mt-1 text-sm text-white/85">{fortune.caution}</p>
        </div>
      </div>

      <AdSlot label="신년운세 본문 하단 디스플레이 광고" />

      <div className="flex gap-3">
        <Link
          href={`/newyear/2027/${prev.branch}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 transition hover:border-white/25"
        >
          ← {prev.animal}
        </Link>
        <Link
          href={`/newyear/2027/${next.branch}`}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60 transition hover:border-white/25"
        >
          {next.animal} →
        </Link>
      </div>

      <Link
        href={`/zodiac/animal/${z.branch}`}
        className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 transition hover:border-[color:var(--color-gold)]/60"
      >
        <p className="text-sm font-bold text-white/85">🐾 {z.animal} 성격과 오늘의 운세도 보기</p>
        <p className="mt-1 text-xs text-white/50">타고난 성격과 매일 바뀌는 오늘의 운세까지 →</p>
      </Link>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 생년월일시로 정확한 사주 보러 가기
      </Link>
    </div>
  );
}
