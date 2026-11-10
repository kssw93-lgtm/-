import Link from "next/link";
import TarotTopicDraw from "@/components/TarotTopicDraw";
import { TAROT_TOPICS, getTarotTopic } from "@/lib/content/tarot-topics";
import { englishTarotTopic } from "@/lib/i18n/english-tarot";

export function EnglishTarotIndex() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-8">
      <header className="text-center">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">THREE-CARD TAROT</p>
        <h1 className="font-brand mt-3 text-2xl font-bold text-[color:var(--color-gold-light)]">Choose a question to explore</h1>
        <p className="mt-2 text-sm leading-6 text-white/55">Pick a topic, draw three cards, and use the traditional symbolism as a prompt for reflection.</p>
      </header>
      <div className="flex flex-col gap-3">
        {TAROT_TOPICS.map((sourceTopic) => {
          const topic = englishTarotTopic(sourceTopic);
          return (
            <Link key={topic.slug} href={`/en/tarot/${topic.slug}`} className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-4 transition hover:border-[color:var(--color-gold)]/60">
              <span className="text-3xl">{topic.emoji}</span>
              <span>
                <span className="block text-base font-bold text-white/90">{topic.label}</span>
                <span className="mt-1 block text-xs leading-5 text-white/50">{topic.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="text-center text-xs leading-5 text-white/40">For reflection and entertainment. A Tarot reading cannot establish facts or guarantee future events.</p>
    </main>
  );
}

export function EnglishTarotTopicPage({ slug }: { slug: string }) {
  const sourceTopic = getTarotTopic(slug);
  if (!sourceTopic) return null;
  const topic = englishTarotTopic(sourceTopic);
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-8">
      <Link href="/en/tarot" className="self-start text-sm text-[color:var(--color-gold-light)] hover:underline">← All Tarot topics</Link>
      <header className="text-center">
        <span className="text-4xl">{topic.emoji}</span>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">THREE-CARD TAROT</p>
        <h1 className="font-brand mt-2 text-2xl font-bold text-[color:var(--color-gold-light)]">{topic.label}</h1>
        <p className="mt-2 text-sm leading-6 text-white/55">{topic.description}</p>
      </header>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <h2 className="text-sm font-bold text-white/85">About this spread</h2>
        <p className="mt-2 text-sm leading-6 text-white/65">{topic.guide.intro}</p>
        <div className="mt-4 flex flex-col gap-3">
          {topic.positions.map((position, index) => (
            <div key={position.label} className="rounded-xl bg-black/15 p-3">
              <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">{index + 1}. {position.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/50">{topic.guide.positionNotes[index]}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-5 text-xs font-semibold text-white/75">A helpful way to use the reading</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-xs leading-5 text-white/50">
          {topic.guide.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </section>
      <div id="draw"><TarotTopicDraw topic={sourceTopic} /></div>
    </main>
  );
}
