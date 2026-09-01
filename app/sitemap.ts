import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { TAROT_CARDS } from "@/lib/content/tarot";

const BASE_URL = "https://cheongi-nuseol.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/zodiac`, changeFrequency: "weekly", priority: 0.8 },
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

  return [...staticRoutes, ...articleRoutes, ...starRoutes, ...animalRoutes, ...tarotRoutes];
}
