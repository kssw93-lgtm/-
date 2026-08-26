import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
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

const SITE_URL = "https://cheongi-nuseol.vercel.app";
const SITE_TITLE = "천기누설 | 연애운·직업운";
const SITE_DESCRIPTION = "생년월일시로 보는 무료 사주 - 연애운과 직업운을 바로 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  verification: {
    google: "5PEFXksjaJ9b4G9tqOhswubHrr7D7nmwwPjtoo1Xph4",
    other: {
      "naver-site-verification": "f92c5fd28f8220b9d3e25a0dd26a8e39b1d39006",
      "google-adsense-account": "ca-pub-8704899603701516",
      "msvalidate.01": "F22E43777BFF94BDA559E17F65E0BBE6",
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "천기누설",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/thumbnail.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8704899603701516"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
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
