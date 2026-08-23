import { ARTICLES } from "@/lib/content/articles";

const BASE_URL = "https://cheongi-nuseol.vercel.app";
// 아티클 개별 게시일 데이터가 없어 전체 배치 게시일로 통일한다(추후 새 글 추가 시 그 글만 최신 날짜로 갱신).
const PUBLISHED_AT = new Date("2026-08-22T00:00:00+09:00").toUTCString();

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = ARTICLES.map(
    (a) => `
  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${BASE_URL}/learn/${a.slug}</link>
    <guid isPermaLink="true">${BASE_URL}/learn/${a.slug}</guid>
    <description>${escapeXml(a.summary)}</description>
    <pubDate>${PUBLISHED_AT}</pubDate>
  </item>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>천기누설 - 사주 배우기</title>
  <link>${BASE_URL}/learn</link>
  <description>사주 명리학의 기본 개념을 쉽게 풀어쓴 글 모음</description>
  <language>ko</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
