import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "천기누설 | 연애운·직업운",
  description: "생년월일시로 보는 무료 사주 - 연애운과 직업운을 바로 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
