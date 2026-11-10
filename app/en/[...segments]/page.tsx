import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnglishTarotIndex, EnglishTarotTopicPage } from "@/components/EnglishTarotPages";
import { getTarotTopic, TAROT_TOPICS } from "@/lib/content/tarot-topics";
import { englishTarotTopic } from "@/lib/i18n/english-tarot";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";

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
    return englishPageMetadata({
      title: "Three-Card Tarot Readings | Saju Dalyeok",
      description: "Explore love, compatibility, career, money, and goals with a three-card Tarot reading.",
      path: "/en/tarot",
      koreanPath: "/tarot",
    });
  }
  if (section === "tarot" && slug) {
    const sourceTopic = getTarotTopic(slug);
    const title = sourceTopic ? englishTarotTopic(sourceTopic).label : slug;
    if (sourceTopic) return englishPageMetadata({
      title: `${title} Tarot Reading | Saju Dalyeok`,
      description: `Draw three cards for a ${title.toLowerCase()} reading and reflect on traditional Tarot symbolism.`,
      path: `/en/tarot/${slug}`,
      koreanPath: `/tarot/${slug}`,
      type: "article",
    });
  }
  return englishPageMetadata({
    title: "Saju Dalyeok in English",
    description: "Explore Korean Saju readings in English.",
    path: "/en",
    koreanPath: "/",
  });
}

export default function EnglishFeatureRoute({ params }: Props) {
  const [section, slug, extra] = params.segments;
  if (section !== "tarot" || extra) notFound();
  if (!slug) return <EnglishTarotIndex />;
  if (getTarotTopic(slug)) return <EnglishTarotTopicPage slug={slug} />;
  notFound();
}
