/**
 * SEO/GEO 구조화 데이터(JSON-LD) 생성 헬퍼.
 * 도메인·URL 구조는 절대 바꾸지 않는다는 원칙에 따라 기존 사이트 상수만 재사용한다.
 * SITE_URL은 app/layout.tsx, app/robots.ts, app/sitemap.ts에 이미 박혀 있는 값과 동일하게 유지할 것.
 */

export const SITE_URL = "https://cheongi-nuseol.vercel.app";

/** 프로그램명 "천기누설"과의 혼동을 피하기 위해 항상 "사주"를 붙여서 쓰는 사이트명. */
export const SITE_NAME = "천기누설 사주";

/** 아티클 개별 게시일 데이터가 없어, 개인정보처리방침 시행일(app/privacy/page.tsx, rss.xml과 동일)로 통일한 합리적 고정값. */
export const SITE_LAUNCH_DATE = "2026-08-22";

export interface BreadcrumbItem {
  name: string;
  /** SITE_URL을 기준으로 한 절대 경로(예: "/learn", "/learn/saju-basics"). */
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function articleJsonLd(params: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const { headline, description, path, datePublished = SITE_LAUNCH_DATE, dateModified = SITE_LAUNCH_DATE } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "ko-KR",
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko-KR",
  };
}
