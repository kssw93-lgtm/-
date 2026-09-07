import type { MetadataRoute } from "next";

const BASE_URL = "https://cheongi-nuseol.vercel.app";

const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
];

// app/sitemap.ts의 generateSitemaps()가 만드는 카테고리별 개수(0~4)와 반드시 맞춰야 한다.
// Next.js는 generateSitemaps()를 쓰면 /sitemap.xml 통합 인덱스를 자동으로 만들어주지 않고
// /sitemap/{id}.xml만 개별로 서빙하기 때문에(직접 빌드해서 확인함), robots.txt에 각 sitemap을
// 전부 나열해서 Search Console이 카테고리별로 모두 찾을 수 있게 한다.
const SITEMAP_IDS = [0, 1, 2, 3, 4];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // AI 답변 엔진(ChatGPT, Perplexity, Claude, Gemini 등)이 이 사이트를 읽고 인용할 수 있도록
      // 알려진 AI 크롤러를 명시적으로 허용한다(GEO: Generative Engine Optimization).
      {
        userAgent: AI_CRAWLER_USER_AGENTS,
        allow: "/",
      },
    ],
    sitemap: SITEMAP_IDS.map((id) => `${BASE_URL}/sitemap/${id}.xml`),
  };
}
