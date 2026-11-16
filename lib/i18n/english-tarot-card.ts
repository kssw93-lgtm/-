import type { TarotCardGuide } from "@/lib/content/tarot-types";
import { loadEnglishContent, localizeEnglishContent } from "./english-content";

export type EnglishTarotCard = Omit<TarotCardGuide, "element"> & { element: string };

const ELEMENT_LABELS: Record<TarotCardGuide["element"], string> = {
  "불(火)": "Fire",
  "물(水)": "Water",
  "공기(風)": "Air",
  "흙(土)": "Earth",
};

/** Pretranslated editorial copy is loaded at build time; no user data or API request is involved. */
export async function getEnglishTarotCard(card: TarotCardGuide): Promise<EnglishTarotCard> {
  await loadEnglishContent();
  const localized = localizeEnglishContent(card);
  return {
    ...localized,
    nameKo: card.nameEn,
    nameEn: card.nameEn,
    element: ELEMENT_LABELS[card.element],
  };
}
