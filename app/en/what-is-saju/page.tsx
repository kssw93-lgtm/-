import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is Korean Saju? A Guide to the Four Pillars",
  description:
    "Learn what Korean Saju means, how the Four Pillars and Five Elements are arranged, and what a Day Master represents in a birth chart.",
  alternates: {
    canonical: "/en/what-is-saju",
  },
  openGraph: {
    title: "What Is Korean Saju? A Guide to the Four Pillars",
    description: "A practical introduction to the pillars, stems, branches, and Five Elements in a Korean Saju chart.",
    url: "https://www.sajudalyeok.co.kr/en/what-is-saju",
    siteName: "Saju Dalyeok",
    locale: "en_US",
    type: "article",
  },
};

const TERMS = [
  ["Four Pillars", "The year, month, day, and hour of birth. Each pillar is made of one Heavenly Stem and one Earthly Branch."],
  ["Heavenly Stems", "A cycle of ten symbols. Each stem is associated with one of the Five Elements and a Yin or Yang quality."],
  ["Earthly Branches", "A cycle of twelve symbols, also associated with the zodiac animals. Each branch has its own element and seasonal associations."],
  ["Day Master", "The Heavenly Stem in the Day Pillar. It is used as the central reference point when interpreting the relationships among the chart's other symbols."],
  ["Five Elements", "Wood, Fire, Earth, Metal, and Water. In Saju, these describe relationships and cycles among chart symbols; they are not literal measurements of physical substances."],
];

export default function WhatIsSajuPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pb-10 pt-7 sm:px-6">
      <article className="rounded-[28px] border border-white/10 bg-[#111321]/85 p-5 sm:p-7">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">SAJU BASICS</p>
        <h1 className="font-brand mt-2 text-3xl font-black leading-tight">What Is Korean Saju?</h1>
        <p className="mt-4 text-sm leading-7 text-white/65">
          Korean Saju (사주) is a traditional way of reading a birth chart using the year, month, day, and time a person was born. The word literally points to “four pillars”: four pairs of symbols that form a chart. You may also see the system called the Four Pillars of Destiny. Saju shares concepts with other East Asian calendrical traditions, while its practical use and terminology have developed in Korean contexts.
        </p>

        <h2 className="font-brand mt-8 text-xl font-bold">How the Four Pillars are formed</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Each pillar has two parts: a Heavenly Stem above an Earthly Branch. Together, the year, month, day, and hour pillars create a set of up to eight characters. If the birth time is unknown, the hour pillar cannot be determined, so the chart uses the other three pillars.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[["Year", "Family background and the wider environment in traditional readings"], ["Month", "Seasonal context and social setting"], ["Day", "The Day Master and close relationships"], ["Hour", "Later-life themes and private aspirations"]].map(([title, description]) => (
            <div key={title} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <h3 className="text-sm font-bold text-[color:var(--color-gold-light)]">{title} Pillar</h3>
              <p className="mt-1 text-[11px] leading-5 text-white/45">{description}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-white/45">
          These are common interpretive associations, not fixed rules. Different schools may explain a pillar's role differently.
        </p>

        <h2 className="font-brand mt-8 text-xl font-bold">The Day Master and Five Elements</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
          The Day Master is the stem of the Day Pillar. Readers use it as a reference point when comparing the other stems, branches, and seasonal influences. The Five Elements—Wood, Fire, Earth, Metal, and Water—describe cycles of support and control among those symbols. A simple count can help you see which elements appear in the visible positions, but it is not a complete interpretation: hidden stems, seasonal strength, and relationships among pillars also matter.
        </p>
        <div className="mt-4 space-y-2">
          {TERMS.map(([term, definition]) => (
            <details key={term} className="group rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white/80 marker:hidden">{term}<span className="float-right text-[color:var(--color-gold-light)] transition group-open:rotate-45">＋</span></summary>
              <p className="mt-2 text-xs leading-5 text-white/50">{definition}</p>
            </details>
          ))}
        </div>

        <h2 className="font-brand mt-8 text-xl font-bold">Why birth time and calendar boundaries matter</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
          A chart depends on more than the date written on a birth certificate. In Saju, the year and month pillars follow solar-term boundaries; the year pillar commonly changes at Ipchun, or the Beginning of Spring. Historical time-zone and daylight-saving changes can also affect the recorded local time. For that reason, a calculator needs a clear calendar and time-zone convention.
        </p>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Saju is a cultural and interpretive practice rather than a scientifically established way to predict events. Use a reading as a prompt for reflection, not as a substitute for professional advice or your own judgment.
        </p>

        <div className="mt-8 rounded-2xl border border-[color:var(--color-gold)]/20 bg-[color:var(--color-gold)]/[0.05] p-4">
          <h2 className="text-base font-bold">Explore your chart</h2>
          <p className="mt-1 text-xs leading-5 text-white/50">See the Four Pillars, Day Master, and visible Five Elements in the free English calculator.</p>
          <Link href="/en#calculator" className="mt-3 inline-flex rounded-full bg-[color:var(--color-gold)] px-4 py-2.5 text-xs font-bold text-[#241a08] hover:brightness-110">Open the Saju calculator →</Link>
        </div>
      </article>
    </main>
  );
}
