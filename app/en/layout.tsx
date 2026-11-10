import EnglishDocumentLocale from "./EnglishDocumentLocale";
import type { Metadata } from "next";

const ENGLISH_DESCRIPTION = "Explore Korean Saju in English with birth-chart readings, Five Elements guides, compatibility, and three-card Tarot.";

export const metadata: Metadata = {
  description: ENGLISH_DESCRIPTION,
  openGraph: {
    title: "Saju Dalyeok | Korean Saju in English",
    description: ENGLISH_DESCRIPTION,
    siteName: "Saju Dalyeok",
    locale: "en_US",
    type: "website",
    images: [{ url: "/thumbnail-en.png", width: 1200, height: 630, alt: "Saju Dalyeok — Korean birth charts in English" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saju Dalyeok | Korean Saju in English",
    description: ENGLISH_DESCRIPTION,
    images: ["/thumbnail-en.png"],
  },
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <EnglishDocumentLocale />
      {children}
    </>
  );
}
