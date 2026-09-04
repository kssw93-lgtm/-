import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";

export const metadata: Metadata = {
  title: "별자리 성격 · 띠 성격 모음 | 천기누설",
  description: "양자리부터 물고기자리까지, 쥐띠부터 돼지띠까지 — 별자리와 띠별 성격과 특징을 한눈에 확인하세요.",
};

export default function ZodiacIndexPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          별자리 · 띠 성격
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          별자리 &amp; 띠 성격
        </h1>
        <p className="mt-2 text-sm text-white/50">궁금한 별자리나 띠를 눌러 성격과 특징을 확인해보세요</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="/zodiac/night-sky.jpg"
            alt="은하수가 흐르는 밤하늘 — 별자리를 읽던 옛사람들의 시선"
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
            priority
          />
        </div>
        <p className="px-4 py-3 text-center text-xs leading-relaxed text-white/50">
          별과 띠는 오래전부터 사람들이 자신을 이해하는 언어였어요.
          나의 별자리와 띠를 통해 타고난 성격을 들여다보세요.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-white/70">♈ 별자리 성격</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {STAR_SIGNS.map((s) => (
            <Link
              key={s.id}
              href={`/zodiac/star/${s.id}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 py-4 text-center transition hover:border-[color:var(--color-gold)]/60"
            >
              <span className="text-xl">{s.symbol}</span>
              <span className="text-xs font-semibold text-white/85">{s.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-white/70">🐾 띠 성격</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {ZODIAC_ANIMALS.map((z) => (
            <Link
              key={z.branch}
              href={`/zodiac/animal/${z.branch}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 py-4 text-center transition hover:border-[color:var(--color-gold)]/60"
            >
              <span className="text-xs font-semibold text-white/85">{z.animal}</span>
              <span className="text-[10px] text-white/30">{z.hanja}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 연애운·궁합 보러 가기
      </Link>

      <p className="text-center text-[11px] text-white/25">
        사진 출처: 공유마당(gongu.copyright.or.kr) · 한국교육방송공사 作 (CC BY)
      </p>
    </div>
  );
}
