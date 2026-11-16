import type { Metadata } from "next";
import { EnglishTarotGuideIndexPage } from "@/components/EnglishTarotGuidePages";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";

export const metadata: Metadata = englishPageMetadata({
  title: "All 78 Tarot Cards: Meanings and Symbols | Saju Dalyeok",
  description: "An English guide to all 78 Rider–Waite–Smith Tarot cards, with upright and reversed keywords, visual symbols, and reflective readings by topic.",
  path: "/en/tarot-guide",
  koreanPath: "/tarot-guide",
});

export default function EnglishTarotGuidePage() {
  return <EnglishTarotGuideIndexPage />;
}
