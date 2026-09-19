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

      <section className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <h2 className="text-base font-bold text-[color:var(--color-gold-light)]">{topic.label} 타로, 이렇게 읽어요</h2>
        <p className="text-sm leading-relaxed text-white/80">{topic.guide.intro}</p>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white/85">세 장의 카드가 뜻하는 것</h3>
          <ol className="flex flex-col gap-2">
            {topic.positions.map((p, i) => (
              <li key={p.label} className="rounded-lg bg-white/5 p-3 text-sm leading-relaxed">
                <span className="font-semibold text-[color:var(--color-gold-light)]">
                  {i + 1}번째 · {p.label}
                </span>
                <span className="mt-0.5 block text-white/70">{topic.guide.positionNotes[i]}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white/85">정방향과 역방향</h3>
          <p className="text-sm leading-relaxed text-white/70">
            카드가 바로 서 있으면(정방향) 그 카드 본래의 의미가 비교적 온전하게, 뒤집혀 있으면(역방향) 그 의미가 막혀
            있거나 지나치거나 다른 모습으로 나타난다고 읽어요. 역방향이 곧 나쁜 결과를 뜻하는 건 아니고, 지금 신경 써야
            할 부분을 알려주는 신호에 가까워요. 펼쳐진 카드는 메이저 아르카나 22장과 마이너 아르카나 56장, 총 78장 전체
            덱에서 무작위로 정해져요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white/85">더 잘 활용하는 팁</h3>
          <ul className="flex flex-col gap-1.5">
            {topic.guide.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-white/70">
                <span className="text-[color:var(--color-gold-light)]/70">·</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
