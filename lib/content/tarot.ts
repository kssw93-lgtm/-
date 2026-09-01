import tarotCardsJson from "@/data/tarot-cards.json";
import type { TarotCardGuide } from "./tarot-types";

export type { TarotCardGuide, TarotSymbol, TarotReading } from "./tarot-types";

export const TAROT_CARDS = tarotCardsJson as TarotCardGuide[];

export function getTarotCard(slug: string): TarotCardGuide | undefined {
  return TAROT_CARDS.find((c) => c.slug === slug);
}
