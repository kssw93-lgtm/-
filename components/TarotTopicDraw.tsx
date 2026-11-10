"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TAROT_CARDS } from "@/lib/content/tarot";
import type { TarotCardGuide } from "@/lib/content/tarot-types";
import type { TarotTopic } from "@/lib/content/tarot-topics";
import { getTopicReadingText } from "@/lib/content/tarot-topic-reading";
import AdSlot from "@/components/AdSlot";
import { loadEnglishContent, localizeEnglishText } from "@/lib/i18n/english-content";
import { useSiteLocale } from "@/lib/i18n/site-locale";
import { englishTarotTopic } from "@/lib/i18n/english-tarot";

type Orientation = "upright" | "reversed";

interface DrawnCard {
  card: TarotCardGuide;
  orientation: Orientation;
}

const SPREAD_SIZE = 12;

function drawRandomCard(excludeSlugs: string[]): DrawnCard {
  const pool = TAROT_CARDS.filter((c) => !excludeSlugs.includes(c.slug));
  const card = pool[Math.floor(Math.random() * pool.length)];
  return { card, orientation: Math.random() < 0.5 ? "upright" : "reversed" };
}

function CardBack({ picked, order, onClick, disabled = false }: { picked: boolean; order: number | null; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={picked || disabled}
      className={`group relative aspect-[2/3] w-full overflow-hidden rounded-lg border-2 bg-[#161e30] shadow-lg shadow-black/40 transition ${
        picked
          ? "-translate-y-2 border-[color:var(--color-gold-light)] opacity-50"
          : "border-[color:var(--color-gold)]/40 active:scale-95 active:border-[color:var(--color-gold-light)]"
      }`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 10px)",
        }}
      />
      <div className="absolute inset-1 rounded-md border border-[color:var(--color-gold)]/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg text-[color:var(--color-gold-light)] drop-shadow-[0_0_6px_rgba(201,163,92,0.6)]">
          ☯
        </span>
      </div>
      {order !== null && (
        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-gold)] text-[11px] font-bold text-[#241a08]">
          {order}
        </span>
      )}
    </button>
  );
}

interface Pick extends DrawnCard {
  slot: number;
}

export default function TarotTopicDraw({ topic }: { topic: TarotTopic }) {
  const isEnglish = useSiteLocale() === "en";
  const displayTopic = isEnglish ? englishTarotTopic(topic) : topic;
  const [phase, setPhase] = useState<"picking" | "loading" | "result">("picking");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [englishCatalogState, setEnglishCatalogState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    if (isEnglish) {
      setEnglishCatalogState("loading");
      void loadEnglishContent().then(
        () => { if (active) setEnglishCatalogState("ready"); },
        (error) => {
          console.error("English Tarot catalogue failed to load:", error);
          if (active) setEnglishCatalogState("error");
        },
      );
    } else {
      setEnglishCatalogState("ready");
    }
    return () => { active = false; };
  }, [isEnglish]);

  if (isEnglish && englishCatalogState !== "ready") {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-6 text-center" role="status" aria-live="polite">
        {englishCatalogState === "loading" ? (
          <>
            <span className="animate-pulse text-4xl">🔮</span>
            <p className="text-sm text-white/60">Preparing your English Tarot reading…</p>
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-white/70">We couldn’t load the English Tarot content. Please check your connection and refresh the page.</p>
            <button onClick={() => window.location.reload()} className="rounded-full bg-[color:var(--color-gold)] px-5 py-2.5 text-sm font-bold text-[#241a08]">Try again</button>
          </>
        )}
      </div>
    );
  }

  function handlePickSlot(slot: number) {
    if (picks.length >= 3 || picks.some((p) => p.slot === slot)) return;
    const excludeSlugs = picks.map((p) => p.card.slug);
    const next = [...picks, { slot, ...drawRandomCard(excludeSlugs) }];
    setPicks(next);

    if (next.length === 3) {
      setPhase("loading");
      setTimeout(() => setPhase("result"), 900);
    }
  }

  function handleRedraw() {
    setPicks([]);
    setPhase("picking");
  }

  if (phase === "picking") {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-6 text-center">
        <span className="text-4xl">{displayTopic.emoji}</span>
        <p className="text-sm leading-relaxed text-white/70">{displayTopic.description}</p>
        <p className="text-sm font-semibold text-[color:var(--color-gold-light)]">
          {isEnglish ? `Choose 3 cards (${picks.length}/3)` : `마음에 드는 카드 3장을 골라보세요 (${picks.length}/3)`}
        </p>
        <div className="grid w-full grid-cols-4 gap-2.5">
          {Array.from({ length: SPREAD_SIZE }, (_, slot) => {
            const orderIndex = picks.findIndex((p) => p.slot === slot);
            return (
              <CardBack
                key={slot}
                picked={orderIndex !== -1}
                disabled={isEnglish && englishCatalogState !== "ready"}
                order={orderIndex !== -1 ? orderIndex + 1 : null}
                onClick={() => handlePickSlot(slot)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 py-14 text-center">
        <span className="animate-pulse text-4xl">🔮</span>
        <p className="text-sm text-white/60">{isEnglish ? "Reading your cards…" : "카드를 살피고 있어요..."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {picks.map(({ card, orientation }, i) => (
          <div key={card.slug} className="flex flex-col items-center gap-2">
            <div
              className={`relative aspect-[11/19] w-full overflow-hidden rounded-lg border border-[color:var(--color-gold)]/30 ${
                orientation === "reversed" ? "rotate-180" : ""
              }`}
            >
              <Image src={`/tarot/${card.slug}.jpg`} alt={isEnglish ? localizeEnglishText(card.nameKo) : card.nameKo} fill sizes="120px" className="object-cover" />
            </div>
            <p className="text-center text-[11px] font-semibold text-[color:var(--color-gold-light)]">
              {displayTopic.positions[i].label}
            </p>
            <p className="text-center text-[10px] text-white/40">
              {isEnglish ? localizeEnglishText(card.nameKo) : card.nameKo}
              {orientation === "reversed" ? (isEnglish ? " (reversed)" : " (역방향)") : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {picks.map(({ card, orientation }, i) => (
          <div key={card.slug} className="rounded-2xl bg-white/10 p-4">
            <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
              {displayTopic.positions[i].label} · {isEnglish ? localizeEnglishText(card.nameKo) : card.nameKo}
            </p>
            <p className="text-sm leading-relaxed text-white/85">
              {isEnglish ? localizeEnglishText(getTopicReadingText(topic, topic.positions[i], card, orientation)) : getTopicReadingText(topic, topic.positions[i], card, orientation)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/baekho-dosa.svg" alt={isEnglish ? "White Tiger Reader" : "백호도사"} width={48} height={62} className="rounded-lg" />
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">{isEnglish ? "A note from the reader" : "백호도사의 한마디"}</p>
        </div>
        <p className="text-base leading-relaxed text-white/90">{isEnglish ? localizeEnglishText(picks[2].card.baekhoAdvice) : picks[2].card.baekhoAdvice}</p>
      </div>

      <AdSlot label={isEnglish ? "Display ad below the three-card Tarot reading" : "타로 3장 뽑기 결과 하단 디스플레이 광고"} />

      <button
        onClick={handleRedraw}
        className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/70 transition hover:border-white/30"
      >
        {isEnglish ? "Draw again" : "다시 뽑기"}
      </button>

      <p className="text-center text-xs leading-relaxed text-white/40">
        {isEnglish ? "🔮 Tarot readings use traditional card symbolism for reflection and entertainment. They do not establish facts or guarantee future events." : "🔮 타로 카드는 전통적인 상징 해석을 바탕으로 한 참고용 콘텐츠이며, 실제 미래나 사실을 확정하는 내용은 아닙니다."}
      </p>
    </div>
  );
}
