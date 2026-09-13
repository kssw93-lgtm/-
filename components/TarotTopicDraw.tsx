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

function drawThreeCards(): DrawnCard[] {
  const pool = [...TAROT_CARDS];
  const picks: DrawnCard[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(idx, 1);
    picks.push({ card, orientation: Math.random() < 0.5 ? "upright" : "reversed" });
  }
  return picks;
}

function CardBack({ rotate }: { rotate: number }) {
  return (
    <div
      className="relative aspect-[2/3] w-20 overflow-hidden rounded-xl border-2 border-[color:var(--color-gold)]/40 bg-[#161e30] shadow-lg shadow-black/40"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, var(--color-gold) 0, var(--color-gold) 1px, transparent 1px, transparent 10px)",
        }}
      />
      <div className="absolute inset-1.5 rounded-lg border border-[color:var(--color-gold)]/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl text-[color:var(--color-gold-light)] drop-shadow-[0_0_6px_rgba(201,163,92,0.6)]">
          ☯
        </span>
      </div>
    </div>
  );
}

export default function TarotTopicDraw({ topic }: { topic: TarotTopic }) {
  const [phase, setPhase] = useState<"intro" | "loading" | "result">("intro");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);

  function handleDraw() {
    setPhase("loading");
    setTimeout(() => {
      setDrawn(drawThreeCards());
      setPhase("result");
    }, 900);
  }

  function handleRedraw() {
    setDrawn([]);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-6 text-center">
        <span className="text-5xl">{topic.emoji}</span>
        <p className="text-sm leading-relaxed text-white/70">{topic.description}</p>
        <div className="flex justify-center -space-x-6 py-2">
          <CardBack rotate={-8} />
          <CardBack rotate={0} />
          <CardBack rotate={8} />
        </div>
        <button
          onClick={handleDraw}
          className="rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-base font-bold text-[#241a08] transition hover:brightness-110"
        >
          카드 3장 뽑기
        </button>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 py-14 text-center">
        <span className="animate-pulse text-4xl">🔮</span>
        <p className="text-sm text-white/60">카드를 섞고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {drawn.map(({ card, orientation }, i) => (
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
        {drawn.map(({ card, orientation }, i) => (
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
        <p className="text-base leading-relaxed text-white/90">{drawn[2].card.baekhoAdvice}</p>
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
