import type { MetadataRoute } from "next";
import { TAROT_TOPICS } from "@/lib/content/tarot-topics";
import { ENGLISH_GUIDES } from "@/lib/i18n/english-guides";

const BASE_URL = "https://www.sajudalyeok.co.kr";
const CONTENT_LAST_MODIFIED = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/en/what-is-saju`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/en/learn`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...ENGLISH_GUIDES.map((guide) => ({
      url: `${BASE_URL}/en/learn/${guide.slug}`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/en/tarot`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...TAROT_TOPICS.map((topic) => ({
      url: `${BASE_URL}/en/tarot/${topic.slug}`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/en/about`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/en/faq`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/en/privacy`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
