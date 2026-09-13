import type { TarotCardGuide } from "./tarot-types";
import type { TarotSpreadPosition, TarotTopic } from "./tarot-topics";
import { composeExamReading } from "./tarot-exam-reading";

export function getTopicReadingText(
  topic: TarotTopic,
  position: TarotSpreadPosition,
  card: TarotCardGuide,
  orientation: "upright" | "reversed"
): string {
  if (!topic.readingKey) {
    return composeExamReading(card, orientation);
  }
  const reading = card.readings[topic.readingKey];
  return position.field === "note" ? reading.note : reading[orientation];
}
