import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteDescription, siteName, siteUrl } from "@/lib/constants/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - ${siteDescription}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName,
    title: siteName,
    description: siteDescription,
    url: siteUrl,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    inLanguage: "ko-KR",
  };

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
