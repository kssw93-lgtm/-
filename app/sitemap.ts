import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { TAROT_CARDS } from "@/lib/content/tarot";
import { GYEOKGUK_ENTRIES } from "@/lib/content/gyeokguk-pages";

const BASE_URL = "https://cheongi-nuseol.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/zodiac`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/zodiac/animal-compat`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/zodiac/star-compat`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/tarot-guide`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE_URL}/learn/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const starRoutes: MetadataRoute.Sitemap = STAR_SIGNS.map((s) => ({
    url: `${BASE_URL}/zodiac/star/${s.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const animalRoutes: MetadataRoute.Sitemap = ZODIAC_ANIMALS.map((z) => ({
    url: `${BASE_URL}/zodiac/animal/${z.branch}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tarotRoutes: MetadataRoute.Sitemap = TAROT_CARDS.map((c) => ({
    url: `${BASE_URL}/tarot-guide/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 띠·별자리 궁합 조합 페이지(78+78개, /zodiac/animal-compat, /zodiac/star-compat)는
  // 애드센스 "가치가 별로 없는 콘텐츠" 반려 대응으로 noindex 처리해서 sitemap에서도
  // 뺐다. 페이지 자체(및 인덱스 2개)는 유지되고 링크로는 접근 가능 — 승인 후 재검토.
  const gyeokgukRoutes: MetadataRoute.Sitemap = GYEOKGUK_ENTRIES.map((g) => ({
    url: `${BASE_URL}/learn/gyeokguk/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...starRoutes,
    ...animalRoutes,
    ...tarotRoutes,
    ...gyeokgukRoutes,
  ];
}
