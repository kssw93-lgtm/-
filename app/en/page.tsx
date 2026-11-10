import type { Metadata } from "next";
import SajuFlow from "@/components/SajuFlow";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";

export const metadata: Metadata = englishPageMetadata({
  title: "Free Korean Saju Readings in English | Saju Dalyeok",
  description: "Explore your Korean Saju birth chart in English. Get detailed readings on relationships, work, money, compatibility, daily cycles, and the Five Elements.",
  path: "/en",
  koreanPath: "/",
});

export default function EnglishHome() {
  return (
    <SajuFlow />
  );
}
