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
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
