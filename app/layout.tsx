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
const SITE_TITLE = "천기누설 | 무료 사주팔자·만세력·타로";
const SITE_DESCRIPTION =
  "생년월일시로 보는 정확한 사주팔자와 만세력, 2026년 신년운세·재물운·연애운·재회운·궁합까지 타로 백과사전과 함께 무료로 확인하세요.";

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
        {/*
          네이버 웹로그분석. 원본 스니펫은 <script src="wcslog.js">와 wcs_do() 호출 스크립트를
          문서 순서대로 배치해 "먼저 로드되고 나서 실행됨"을 가정하는데, next/script의
          afterInteractive는 그 순서를 보장하지 않는다. 그래서 wcslog.js를 코드로 직접 로드하고
          onload 콜백 안에서만 wcs_do()를 호출해, 로드가 끝나기 전에 호출되는 경합을 없앤다.
        */}
        <Script id="naver-wcslog" strategy="afterInteractive">
          {`
            window.wcs_add = window.wcs_add || {};
            window.wcs_add["wa"] = "1876a85e8213540";
            (function () {
              var s = document.createElement("script");
              s.src = "//wcs.pstatic.net/wcslog.js";
              s.onload = function () {
                if (window.wcs) { window.wcs_do(); }
              };
              document.head.appendChild(s);
            })();
          `}
        </Script>
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
