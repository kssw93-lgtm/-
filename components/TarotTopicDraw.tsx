"use client";

import { useState } from "react";
import Image from "next/image";
import { TAROT_CARDS } from "@/lib/content/tarot";
import type { TarotCardGuide } from "@/lib/content/tarot-types";
import type { TarotTopic } from "@/lib/content/tarot-topics";
import { getTopicReadingText } from "@/lib/content/tarot-topic-reading";
import AdSlot from "@/components/AdSlot";

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

function CardBack({ picked, order, onClick }: { picked: boolean; order: number | null; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={picked}
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
  const [phase, setPhase] = useState<"picking" | "loading" | "result">("picking");
  const [picks, setPicks] = useState<Pick[]>([]);

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
        <span className="text-4xl">{topic.emoji}</span>
        <p className="text-sm leading-relaxed text-white/70">{topic.description}</p>
        <p className="text-sm font-semibold text-[color:var(--color-gold-light)]">
          마음에 드는 카드 3장을 골라보세요 ({picks.length}/3)
        </p>
        <div className="grid w-full grid-cols-4 gap-2.5">
          {Array.from({ length: SPREAD_SIZE }, (_, slot) => {
            const orderIndex = picks.findIndex((p) => p.slot === slot);
            return (
              <CardBack
                key={slot}
                picked={orderIndex !== -1}
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
        <p className="text-sm text-white/60">카드를 살피고 있어요...</p>
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
              <Image src={`/tarot/${card.slug}.jpg`} alt={card.nameKo} fill sizes="120px" className="object-cover" />
            </div>
            <p className="text-center text-[11px] font-semibold text-[color:var(--color-gold-light)]">
              {topic.positions[i].label}
            </p>
            <p className="text-center text-[10px] text-white/40">
              {card.nameKo}
              {orientation === "reversed" ? " (역방향)" : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {picks.map(({ card, orientation }, i) => (
          <div key={card.slug} className="rounded-2xl bg-white/10 p-4">
            <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
              {topic.positions[i].label} · {card.nameKo}
            </p>
            <p className="text-sm leading-relaxed text-white/85">
              {getTopicReadingText(topic, topic.positions[i], card, orientation)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/baekho-dosa.svg" alt="백호도사" width={48} height={62} className="rounded-lg" />
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">백호도사의 한마디</p>
        </div>
        <p className="text-base leading-relaxed text-white/90">{picks[2].card.baekhoAdvice}</p>
      </div>

      <AdSlot label="타로 3장 뽑기 결과 하단 디스플레이 광고" />

      <button
        onClick={handleRedraw}
        className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/70 transition hover:border-white/30"
      >
        다시 뽑기
      </button>

      <p className="text-center text-xs leading-relaxed text-white/40">
        🔮 타로 카드는 전통적인 상징 해석을 바탕으로 한 참고용 콘텐츠이며, 실제 미래나 사실을 확정하는 내용은 아닙니다.
      </p>
    </div>
  );
}
