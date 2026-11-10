import type { Metadata } from "next";
import SajuFlow from "@/components/SajuFlow";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      ko: "https://www.sajudalyeok.co.kr/",
      en: "https://www.sajudalyeok.co.kr/en",
    },
  },
};

export default function Home() {
  return <SajuFlow />;
}
