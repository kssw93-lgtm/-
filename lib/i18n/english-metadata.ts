import type { Metadata } from "next";

const SITE_URL = "https://www.sajudalyeok.co.kr";
const ENGLISH_SHARE_IMAGE = {
  url: "/thumbnail-en.png",
  width: 1200,
  height: 630,
  alt: "Saju Dalyeok — Korean birth charts in English",
};

interface EnglishMetadataInput {
  title: string;
  description: string;
  path: string;
  koreanPath: string;
  type?: "website" | "article";
}

/** Consistent English metadata with reciprocal language URLs and English share previews. */
export function englishPageMetadata({ title, description, path, koreanPath, type = "website" }: EnglishMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: url,
        ko: `${SITE_URL}${koreanPath}`,
        ...(path === "/en" ? { "x-default": `${SITE_URL}/` } : {}),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Saju Dalyeok",
      locale: "en_US",
      type,
      images: [ENGLISH_SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ENGLISH_SHARE_IMAGE.url],
    },
  };
}
