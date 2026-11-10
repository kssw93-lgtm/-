import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnglishTarotIndex, EnglishTarotTopicPage } from "@/components/EnglishTarotPages";
import { getTarotTopic, TAROT_TOPICS } from "@/lib/content/tarot-topics";
import { englishTarotTopic } from "@/lib/i18n/english-tarot";

type Props = { params: { segments: string[] } };

export function generateStaticParams() {
  return [
    { segments: ["tarot"] },
    ...TAROT_TOPICS.map((topic) => ({ segments: ["tarot", topic.slug] })),
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const [section, slug] = params.segments;
  if (section === "tarot" && !slug) {
    return { title: "Three-Card Tarot Readings | Saju Dalyeok", description: "Explore love, compatibility, career, money, and goals with a three-card Tarot reading.", alternates: { canonical: "/en/tarot" } };
  }
  if (section === "tarot" && slug) {
    const sourceTopic = getTarotTopic(slug);
    const title = sourceTopic ? englishTarotTopic(sourceTopic).label : slug;
    if (sourceTopic) return { title: `${title} Tarot Reading | Saju Dalyeok`, description: `Draw three cards for a ${title.toLowerCase()} reading and reflect on traditional Tarot symbolism.`, alternates: { canonical: `/en/tarot/${slug}` } };
  }
  return { title: "Saju Dalyeok in English", alternates: { canonical: "/en" } };
}

export default function EnglishFeatureRoute({ params }: Props) {
  const [section, slug, extra] = params.segments;
  if (section !== "tarot" || extra) notFound();
  if (!slug) return <EnglishTarotIndex />;
  if (getTarotTopic(slug)) return <EnglishTarotTopicPage slug={slug} />;
  notFound();
}
