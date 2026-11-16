import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnglishTarotCardPage } from "@/components/EnglishTarotGuidePages";
import { TAROT_CARDS, getTarotCard } from "@/lib/content/tarot";
import { getEnglishTarotCard } from "@/lib/i18n/english-tarot-card";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";
import { localizeEnglishText } from "@/lib/i18n/english-content";

export function generateStaticParams() {
  return TAROT_CARDS.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const source = getTarotCard(params.slug);
  if (!source) return {};
  const card = await getEnglishTarotCard(source);
  const title = `${card.nameEn} Tarot Card Meaning: Upright and Reversed | Saju Dalyeok`;
  const description = `${localizeEnglishText(card.summary)} Explore ${card.nameEn} upright and reversed keywords, image symbols, and reflective readings for love, money, work, and well-being.`;
  return englishPageMetadata({
    title,
    description,
    path: `/en/tarot-guide/${card.slug}`,
    koreanPath: `/tarot-guide/${card.slug}`,
    type: "article",
  });
}

export default async function EnglishTarotCardRoute({ params }: { params: { slug: string } }) {
  const source = getTarotCard(params.slug);
  if (!source) notFound();
  const card = await getEnglishTarotCard(source);
  return <EnglishTarotCardPage card={card} allCards={TAROT_CARDS} />;
}
