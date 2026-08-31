import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/constants/site";

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

/**
 * 페이지별 title/description/canonical/OG metadata를 siteUrl 기준으로 생성합니다.
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      locale: "ko_KR",
      type: "website",
    },
  };
}
