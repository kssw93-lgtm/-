import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { TAROT_CARDS } from "@/lib/content/tarot";
import { GYEOKGUK_ENTRIES } from "@/lib/content/gyeokguk-pages";

const BASE_URL = "https://www.sajudalyeok.co.kr";

/**
 * 카테고리별로 사이트맵을 나눠서 Search Console의 Sitemaps 리포트에서 카테고리 단위로
 * "발견됨-색인 안 됨" 현황을 따로 추적할 수 있게 한다(Next.js generateSitemaps API).
 *   0: 정적 페이지(홈/learn/zodiac/tarot-guide/about/privacy)
 *   1: 학습 아티클(/learn/[slug])
 *   2: 격국 상세(/learn/gyeokguk/[slug])
 *   3: 타로 카드(/tarot-guide/[slug])
 *   4: 별자리·띠 개별 페이지(/zodiac/star/[id], /zodiac/animal/[branch])
 * 각 sitemap()은 /sitemap/{id}.xml로 서빙되고, /sitemap.xml 인덱스는 Next.js가 자동 생성한다.
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
        { url: BASE_URL, changeFrequency: "daily", priority: 1 },
        { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/zodiac`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/zodiac/animal-compat`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/zodiac/star-compat`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/tarot-guide`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
      ];
    case 1:
      return ARTICLES.map((a) => ({
        url: `${BASE_URL}/learn/${a.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    case 2:
      return GYEOKGUK_ENTRIES.map((g) => ({
        url: `${BASE_URL}/learn/gyeokguk/${g.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    case 3:
      return TAROT_CARDS.map((c) => ({
        url: `${BASE_URL}/tarot-guide/${c.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    case 4:
      return [
        ...STAR_SIGNS.map((s) => ({
          url: `${BASE_URL}/zodiac/star/${s.id}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
        ...ZODIAC_ANIMALS.map((z) => ({
          url: `${BASE_URL}/zodiac/animal/${z.branch}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ];
    default:
      return [];
  }
}
