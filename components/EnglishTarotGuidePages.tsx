import Image from "next/image";
import Link from "next/link";
import { TAROT_CARDS } from "@/lib/content/tarot";
import type { EnglishTarotCard } from "@/lib/i18n/english-tarot-card";
import TarotReadingBasics from "@/components/TarotReadingBasics";

const SECTIONS = [
  { title: "Major Arcana · 22 cards", from: 0, to: 21 },
  { title: "Minor Arcana · Wands", from: 22, to: 35 },
  { title: "Minor Arcana · Cups", from: 36, to: 49 },
  { title: "Minor Arcana · Swords", from: 50, to: 63 },
  { title: "Minor Arcana · Pentacles", from: 64, to: 77 },
];

export function EnglishTarotGuideIndexPage() {
  return (
    <main className="flex flex-1 flex-col gap-7 px-5 py-8 sm:px-8">
      <header className="text-center">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">TAROT FIELD GUIDE</p>
        <h1 className="font-brand mt-3 text-3xl font-bold text-[color:var(--color-gold-light)]">All 78 Tarot Cards</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
          Browse the Major and Minor Arcana with upright and reversed keywords, visual symbols, and reflective readings for love, money, work, and well-being.
        </p>
      </header>

      <TarotReadingBasics locale="en" />

      {SECTIONS.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-[color:var(--color-gold-light)]">{section.title}</h2>
          <div className="grid grid-cols-2 gap-3">
            {TAROT_CARDS.filter((card) => card.id >= section.from && card.id <= section.to).map((card) => (
              <Link
                key={card.slug}
                href={`/en/tarot-guide/${card.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 p-3 text-center transition hover:border-[color:var(--color-gold)]/60"
              >
                <div className="relative aspect-[11/19] w-full overflow-hidden rounded-lg bg-black/20">
                  <Image src={`/tarot/${card.slug}.jpg`} alt={`${card.nameEn} Tarot card`} fill sizes="(max-width: 480px) 45vw, 200px" className="object-cover" />
                </div>
                <div>
                  <span className="block text-xs text-[color:var(--color-gold-light)]/70">{card.number}</span>
                  <span className="block text-sm font-semibold text-white/85">{card.nameEn}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <Link href="/en/tarot" className="rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-sm font-bold text-[#241a08] transition hover:brightness-110">
        Draw three Tarot cards →
      </Link>
    </main>
  );
}

const READING_ORDER = [
  { key: "love", label: "Love and relationships" },
  { key: "money", label: "Money and resources" },
  { key: "career", label: "Work and career" },
  { key: "health", label: "Well-being" },
] as const;

export function EnglishTarotCardPage({ card, allCards }: { card: EnglishTarotCard; allCards: typeof TAROT_CARDS }) {
  const index = allCards.findIndex((item) => item.slug === card.slug);
  const previous = allCards[(index - 1 + allCards.length) % allCards.length];
  const next = allCards[(index + 1) % allCards.length];

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-8">
      <div>
        <Link href="/en/tarot-guide" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">← All 78 cards</Link>
        <header className="mt-3 text-center">
          <span className="text-xs text-[color:var(--color-gold-light)]/70">{card.number}</span>
          <h1 className="font-brand mt-1 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">{card.nameEn} Tarot Card Meaning</h1>
          <p className="mt-1 text-xs text-white/45">RWS symbolic association · {card.element}</p>
        </header>
      </div>

      <div className="mx-auto w-full max-w-[240px]">
        <div className="relative aspect-[11/19] w-full overflow-hidden rounded-2xl border border-[color:var(--color-gold)]/30 shadow-lg shadow-black/40">
          <Image src={`/tarot/${card.slug}.jpg`} alt={`${card.nameEn} Tarot card`} fill priority sizes="240px" className="object-cover" />
        </div>
        <p className="mt-2 text-center text-[10px] text-white/35">Rider–Waite–Smith tarot deck · Pamela Colman Smith, 1909</p>
      </div>

      <p className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-sm leading-relaxed text-white/85">{card.summary}</p>

      <div className="grid grid-cols-2 gap-3">
        <KeywordList title="Upright keywords" values={card.keywords.upright} />
        <KeywordList title="Reversed keywords" values={card.keywords.reversed} reversed />
      </div>

      <section className="rounded-2xl bg-white/10 p-5">
        <h2 className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">Symbols in the image</h2>
        <div className="flex flex-col gap-3">
          {card.symbols.map((symbol) => (
            <div key={symbol.name} className="rounded-lg bg-white/5 p-3">
              <h3 className="text-sm font-bold">{symbol.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{symbol.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-label="Contextual card readings">
        <h2 className="text-base font-semibold text-[color:var(--color-gold-light)]">How this card can be read by topic</h2>
        {READING_ORDER.map(({ key, label }) => {
          const reading = card.readings[key];
          return (
            <article key={key} className="rounded-2xl bg-white/10 p-5">
              <h3 className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">{label} · {reading.title}</h3>
              {key === "money" && <p className="mb-3 rounded-lg bg-black/20 p-3 text-xs leading-relaxed text-white/55">This is symbolic reflection, not financial, investment, or income advice.</p>}
              {key === "health" && <p className="mb-3 rounded-lg bg-black/20 p-3 text-xs leading-relaxed text-white/55">Tarot cannot diagnose a condition or predict recovery. For symptoms or treatment, consult a qualified health professional.</p>}
              <div className="space-y-2 text-sm leading-relaxed">
                <p><span className="text-white/45">Upright · </span><span className="text-white/85">{reading.upright}</span></p>
                <p><span className="text-white/45">Reversed · </span><span className="text-white/85">{reading.reversed}</span></p>
                <p className="mt-1 border-t border-white/10 pt-2 text-white/60">Reflection: {reading.note}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5">
        <h2 className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">A note from the reader</h2>
        <p className="text-sm leading-relaxed text-white/85">{card.baekhoAdvice}</p>
      </section>
      <section className="rounded-2xl bg-white/10 p-5">
        <h2 className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">A small action to consider</h2>
        <p className="text-sm leading-relaxed text-white/80">{card.actionItem}</p>
      </section>
      <p className="text-center text-xs leading-relaxed text-white/40">Tarot interpretations draw on traditional symbolism for reflection and entertainment. They do not establish facts or guarantee future events.</p>

      <div className="flex gap-3">
        <Link href={`/en/tarot-guide/${previous.slug}`} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">← {previous.nameEn}</Link>
        <Link href={`/en/tarot-guide/${next.slug}`} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-white/60">{next.nameEn} →</Link>
      </div>
      <Link href="/en/tarot" className="rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-sm font-bold text-[#241a08]">Draw three Tarot cards →</Link>
    </main>
  );
}

function KeywordList({ title, values, reversed = false }: { title: string; values: string[]; reversed?: boolean }) {
  return (
    <section className="rounded-xl bg-white/5 p-4">
      <h2 className={`mb-2 text-xs font-semibold ${reversed ? "text-white/55" : "text-[color:var(--color-gold-light)]"}`}>{title}</h2>
      <div className="flex flex-wrap gap-1.5">
        {values.map((word) => <span key={word} className={`rounded-full px-2.5 py-1 text-xs ${reversed ? "bg-white/10 text-white/65" : "bg-[color:var(--color-gold)]/15 text-[color:var(--color-gold-light)]"}`}>{word}</span>)}
      </div>
    </section>
  );
}
