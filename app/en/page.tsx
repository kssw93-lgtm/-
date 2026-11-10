import type { Metadata } from "next";
import Link from "next/link";
import EnglishSajuCalculator from "./EnglishSajuCalculator";

const SITE_URL = "https://www.sajudalyeok.co.kr";

export const metadata: Metadata = {
  title: "Free Korean Saju Calculator | Four Pillars of Destiny",
  description:
    "Calculate your Korean Saju chart online for free. See your Four Pillars, Day Master, and Five Elements with a clear explanation of the calculation method.",
  alternates: {
    canonical: "/en",
    languages: {
      en: `${SITE_URL}/en`,
      ko: `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: "Free Korean Saju Calculator | Saju Dalyeok",
    description: "Explore your Four Pillars, Day Master, and Five Elements in English.",
    url: `${SITE_URL}/en`,
    siteName: "Saju Dalyeok",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    type: "website",
  },
};

export default function EnglishHome() {
  return (
    <main className="flex flex-1 flex-col gap-8 px-5 pb-10 pt-6 sm:px-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[color:var(--color-gold)]/20 bg-gradient-to-br from-[#211d30] via-[#111321] to-[#0a0c16] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-10 font-serif text-[180px] font-bold leading-none text-[color:var(--color-gold)] opacity-[0.08]">命</div>
        <div className="relative max-w-[32rem]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-black/20 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-[color:var(--color-gold-light)]">
            KOREAN SAJU · FOUR PILLARS
          </span>
          <h1 className="font-brand mt-4 text-[32px] font-black leading-[1.25] text-[color:var(--color-ink)] sm:text-4xl">
            Discover the pattern
            <br />
            in your birth chart.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
            Saju is a Korean birth-chart tradition based on your year, month, day, and time of birth. Calculate your Four Pillars and see how the Five Elements appear in your chart.
          </p>
          <p className="mt-2 max-w-lg text-xs leading-5 text-white/45">
            This first English release provides a chart preview. Full-length English fortune interpretations are not available yet.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-white/60">
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">Free to use</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">No sign-up</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">Calculated in your browser</span>
          </div>
          <a href="#calculator" className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3.5 text-sm font-bold text-[#241a08] shadow-[0_8px_28px_rgba(201,163,92,0.2)] transition hover:brightness-110">
            Calculate my Saju chart <span aria-hidden="true" className="ml-2">↓</span>
          </a>
        </div>
      </section>

      <section aria-label="Saju calculator" className="scroll-mt-4">
        <EnglishSajuCalculator />
      </section>

      <section id="how-its-calculated" className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/70">HOW IT WORKS</p>
        <h2 className="font-brand mt-1 text-xl font-bold">A chart built from four moments in time</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Birth date and time", "Your birth information is converted into the calendar and time reference used by the chart."],
            ["02", "Four Pillars", "Year, month, day, and hour are each represented by a Heavenly Stem and an Earthly Branch."],
            ["03", "Five Elements", "The chart shows the visible Wood, Fire, Earth, Metal, and Water positions in those pillars."],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-xl border border-white/[0.06] bg-black/15 p-4">
              <span className="text-[10px] font-bold text-[color:var(--color-gold-light)]">{number}</span>
              <h3 className="mt-2 text-sm font-bold text-white/85">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-white/45">
          Year and month boundaries follow solar terms, including Ipchun (the Beginning of Spring) for the year pillar. The current English calculator uses Korean calendar and historical standard-time data.
        </p>
        <Link href="/en/what-is-saju" className="mt-3 inline-flex text-xs font-semibold text-[color:var(--color-gold-light)] underline underline-offset-4 hover:text-white">
          Learn how to read a Saju chart →
        </Link>
      </section>

      <section className="rounded-2xl border border-[color:var(--color-gold)]/15 bg-[color:var(--color-gold)]/[0.04] p-5">
        <h2 className="font-brand text-lg font-bold">About this first English release</h2>
        <p className="mt-2 text-xs leading-5 text-white/55">
          This version accepts Gregorian (solar-calendar) dates from 1950 through 2028 and birth times recorded in South Korea. It does not yet adjust for birth locations or time zones outside South Korea, or accept lunar-calendar dates. If you were born elsewhere, the chart may not match your local birth time.
        </p>
      </section>
    </main>
  );
}
