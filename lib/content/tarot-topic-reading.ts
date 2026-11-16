import type { TarotCardGuide } from "./tarot-types";
import type { TarotSpreadPosition, TarotTopic } from "./tarot-topics";
import { composeExamReading } from "./tarot-exam-reading";
import { localizeEnglishText } from "@/lib/i18n/english-content";

export function getTopicReadingText(
  topic: TarotTopic,
  position: TarotSpreadPosition,
  card: TarotCardGuide,
  orientation: "upright" | "reversed",
  locale: "ko" | "en" = "ko",
): string {
  if (!topic.readingKey) {
    return composeExamReading(card, orientation, locale);
  }
  const reading = card.readings[topic.readingKey];
  const text = position.field === "note" ? reading.note : reading[orientation];
  return locale === "en" ? localizeEnglishText(text) : text;
}
