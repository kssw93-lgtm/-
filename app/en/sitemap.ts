import type { MetadataRoute } from "next";

const BASE_URL = "https://www.sajudalyeok.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date("2026-11-07"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/en/what-is-saju`,
      lastModified: new Date("2026-11-07"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/en/privacy`,
      lastModified: new Date("2026-11-07"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
