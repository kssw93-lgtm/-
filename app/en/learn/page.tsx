import type { Metadata } from "next";
import Link from "next/link";
import { ENGLISH_GUIDES } from "@/lib/i18n/english-guides";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";

export const metadata: Metadata = englishPageMetadata({
  title: "Learn Korean Saju | Four Pillars and Five Elements",
  description: "Clear English guides to Korean Saju: the Four Pillars, Heavenly Stems, Five Elements, Ten Gods, luck cycles, compatibility, and Tarot.",
  path: "/en/learn",
  koreanPath: "/learn",
});

export default function EnglishLearnIndexPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-6">
      <header className="text-center">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">SAJU FIELD GUIDE</p>
        <h1 className="font-brand mt-3 text-3xl font-bold text-[color:var(--color-gold-light)]">Learn Korean Saju</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
          Straightforward guides to the symbols and calendar behind a Four Pillars birth chart. Explore the tradition with context, and treat readings as reflection rather than certainty.
        </p>
      </header>

      <Link href="/en/what-is-saju" className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/[0.06] p-5 transition hover:border-[color:var(--color-gold)]/60">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[color:var(--color-gold-light)]/75">START HERE</p>
        <h2 className="font-brand mt-2 text-lg font-bold text-white/90">What Is Korean Saju?</h2>
        <p className="mt-1 text-sm leading-6 text-white/55">A practical introduction to the Four Pillars, Day Master, calendar boundaries, and Five Elements.</p>
      </Link>

      <div className="grid gap-3">
        {ENGLISH_GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/en/learn/${guide.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-[color:var(--color-gold)]/45 hover:bg-white/[0.055]">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold leading-6 text-white/90">{guide.title}</h2>
              <span className="shrink-0 text-[11px] text-white/35">{guide.readingMinutes} min</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">{guide.description}</p>
          </Link>
        ))}
      </div>

      <Link href="/en" className="rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-sm font-bold text-[#241a08] transition hover:brightness-110">
        Calculate my Saju chart →
      </Link>
    </main>
  );
}
