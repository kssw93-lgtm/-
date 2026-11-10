import type { Metadata } from "next";
import SajuFlow from "@/components/SajuFlow";

const SITE_URL = "https://www.sajudalyeok.co.kr";

export const metadata: Metadata = {
  title: "Free Korean Saju Readings in English | Saju Dalyeok",
  description:
    "Explore your Korean Saju birth chart in English. Get detailed readings on relationships, work, money, compatibility, daily cycles, and the Five Elements.",
  alternates: {
    canonical: "/en",
    languages: {
      en: `${SITE_URL}/en`,
      ko: `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: "Free Korean Saju Readings in English | Saju Dalyeok",
    description: "Calculate your Saju birth chart and explore detailed readings in English.",
    url: `${SITE_URL}/en`,
    siteName: "Saju Dalyeok",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    type: "website",
  },
};

export default function EnglishHome() {
  return (
    <SajuFlow />
  );
}
