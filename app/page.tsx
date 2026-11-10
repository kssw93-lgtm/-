import type { Metadata } from "next";
import SajuFlow from "@/components/SajuFlow";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      ko: "https://www.sajudalyeok.co.kr/",
      en: "https://www.sajudalyeok.co.kr/en",
      "x-default": "https://www.sajudalyeok.co.kr/",
    },
  },
};

export default function Home() {
  return <SajuFlow />;
}
