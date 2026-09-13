import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TAROT_TOPICS, getTarotTopic } from "@/lib/content/tarot-topics";
import TarotTopicDraw from "@/components/TarotTopicDraw";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return TAROT_TOPICS.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const topic = getTarotTopic(params.topic);
  if (!topic) return {};
  const title = `${topic.label} 타로 3장 뽑기 | 사주달력`;
  const path = `/tarot/${topic.slug}`;
  return {
    title,
    description: topic.description,
    alternates: { canonical: path },
    openGraph: { title, description: topic.description, url: path },
  };
}

export default function TarotTopicPage({ params }: { params: { topic: string } }) {
  const topic = getTarotTopic(params.topic);
  if (!topic) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "타로점 보기", path: "/tarot" },
          { name: `${topic.label} 타로`, path: `/tarot/${topic.slug}` },
        ])}
      />
      <div>
        <Link href="/tarot" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">
          ← 타로점 목록
        </Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          {topic.emoji} {topic.label} 타로
        </h1>
      </div>

      <TarotTopicDraw topic={topic} />

      <Link
        href="/tarot-guide"
        className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 transition hover:border-[color:var(--color-gold)]/60"
      >
        <p className="text-sm font-bold text-white/85">🔮 카드 의미가 더 궁금하다면?</p>
        <p className="mt-1 text-xs text-white/50">타로 카드 백과사전에서 전체 78장 살펴보기 →</p>
      </Link>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주로 연애운·궁합 보러 가기
      </Link>
    </div>
  );
}
