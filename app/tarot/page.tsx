import Link from "next/link";
import type { Metadata } from "next";
import { TAROT_TOPICS } from "@/lib/content/tarot-topics";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

const TITLE = "타로점 보기 · 카드 3장 뽑기 | 사주달력";
const DESCRIPTION =
  "연애운, 궁합, 시험·합격운, 취업·이직운, 금전운까지 — 궁금한 주제를 고르고 타로 카드 3장을 뽑아 백호도사의 해석을 확인하세요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tarot" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tarot" },
};

export default function TarotTopicListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "타로점 보기", path: "/tarot" },
        ])}
      />
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          타로점 보기
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          궁금한 주제를 골라 카드 3장을 뽑아보세요
        </h1>
        <p className="mt-2 text-sm text-white/50">🐯 백호도사가 카드의 의미를 함께 풀이해 드려요</p>
      </div>

      <div className="flex flex-col gap-3">
        {TAROT_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/tarot/${topic.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-4 transition hover:border-[color:var(--color-gold)]/60"
          >
            <span className="text-3xl">{topic.emoji}</span>
            <div>
              <p className="text-base font-bold text-white/90">{topic.label}</p>
              <p className="mt-0.5 text-xs text-white/50">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/tarot-guide" className="text-center text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
        카드 한 장씩 의미가 궁금하다면? 타로 백과사전 →
      </Link>
    </div>
  );
}
