import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { TAROT_CARDS } from "@/lib/content/tarot";
import { GYEOKGUK_ENTRIES } from "@/lib/content/gyeokguk-pages";
import { SITE_LAUNCH_DATE } from "@/lib/seo";

const BASE_URL = "https://www.sajudalyeok.co.kr";
/** 아티클 개별 게시일 데이터가 없어, 콘텐츠 최초 게시일로 통일한다(lib/seo.ts와 동일 기준). */
const CONTENT_LAST_MODIFIED = new Date(SITE_LAUNCH_DATE);

/**
 * 카테고리별로 사이트맵을 나눠서 Search Console의 Sitemaps 리포트에서 카테고리 단위로
 * "발견됨-색인 안 됨" 현황을 따로 추적할 수 있게 한다(Next.js generateSitemaps API).
 *   0: 정적 페이지(홈/learn/zodiac/tarot-guide/about/privacy)
 *   1: 학습 아티클(/learn/[slug])
 *   2: 격국 상세(/learn/gyeokguk/[slug])
 *   3: 타로 카드(/tarot-guide/[slug])
 *   4: 별자리·띠 개별 페이지(/zodiac/star/[id], /zodiac/animal/[branch])
 * 각 sitemap()은 /sitemap/{id}.xml로 서빙된다. 이 Next.js 버전은 generateSitemaps()를
 * 쓰면 통합 /sitemap.xml 인덱스를 자동 생성해주지 않아서(실제로 404), app/robots.ts에
 * 5개 하위 사이트맵 URL을 전부 직접 나열해 구글이 찾도록 한다.
 *
 * 띠·별자리 궁합 조합 페이지(78+78개, /zodiac/animal-compat/[a]/[b], /zodiac/star-compat/[a]/[b])는
 * 애드센스 "가치가 별로 없는 콘텐츠" 반려 대응으로 noindex 처리해서 사이트맵 어디에도 포함하지 않는다.
 * 페이지 자체(및 인덱스 2개)는 유지되고 링크로는 접근 가능 — 승인 후 재검토.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  switch (id) {
    case 0:
      return [
        { url: BASE_URL, changeFrequency: "daily", priority: 1, lastModified: new Date() },
        { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8, lastModified: CONTENT_LAST_MODIFIED },
        { url: `${BASE_URL}/zodiac`, changeFrequency: "weekly", priority: 0.8, lastModified: CONTENT_LAST_MODIFIED },
        {
          url: `${BASE_URL}/zodiac/animal-compat`,
          changeFrequency: "weekly",
          priority: 0.7,
          lastModified: CONTENT_LAST_MODIFIED,
        },
        {
          url: `${BASE_URL}/zodiac/star-compat`,
          changeFrequency: "weekly",
          priority: 0.7,
          lastModified: CONTENT_LAST_MODIFIED,
        },
        {
          url: `${BASE_URL}/tarot-guide`,
          changeFrequency: "weekly",
          priority: 0.8,
          lastModified: CONTENT_LAST_MODIFIED,
        },
        { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5, lastModified: CONTENT_LAST_MODIFIED },
        { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6, lastModified: CONTENT_LAST_MODIFIED },
        {
          url: `${BASE_URL}/privacy`,
          changeFrequency: "yearly",
          priority: 0.3,
          lastModified: CONTENT_LAST_MODIFIED,
        },
      ];
    case 1:
      return ARTICLES.map((a) => ({
        url: `${BASE_URL}/learn/${a.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: CONTENT_LAST_MODIFIED,
      }));
    case 2:
      return GYEOKGUK_ENTRIES.map((g) => ({
        url: `${BASE_URL}/learn/gyeokguk/${g.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: CONTENT_LAST_MODIFIED,
      }));
    case 3:
      return TAROT_CARDS.map((c) => ({
        url: `${BASE_URL}/tarot-guide/${c.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: CONTENT_LAST_MODIFIED,
      }));
    case 4:
      return [
        ...STAR_SIGNS.map((s) => ({
          url: `${BASE_URL}/zodiac/star/${s.id}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          lastModified: CONTENT_LAST_MODIFIED,
        })),
        ...ZODIAC_ANIMALS.map((z) => ({
          url: `${BASE_URL}/zodiac/animal/${z.branch}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          lastModified: CONTENT_LAST_MODIFIED,
        })),
      ];
    default:
      return [];
  }
}
