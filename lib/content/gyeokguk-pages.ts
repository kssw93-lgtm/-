import gyeokgukJson from "@/data/gyeokguk.json";

export interface GyeokgukEntry {
  slug: string;
  name: string;
  subtitle: string;
  strength: string;
  weakness: string;
  /** 격국의 명리학적 성립 조건·실생활 경향·재물 성향을 2~3문단으로 풀어쓴 본문(SEO/GEO용 콘텐츠 보강). */
  body?: string[];
}

/**
 * "OO격이란 무엇인가요" 검색 키워드용 개별 페이지 — data/gyeokguk.json에 이미 있는
 * 격국별 name/subtitle/strength/weakness(+body)를 그대로 뽑아 쓴다. lib/interpretation/gyeokguk.ts가
 * 실제 사주 계산 결과에 매칭할 때 쓰는 것과 완전히 같은 데이터, 새 해석 문구는 없다.
 */
export const GYEOKGUK_TABLE = gyeokgukJson as Record<
  string,
  { name: string; subtitle: string; strength: string; weakness: string; body?: string[] }
>;

export const GYEOKGUK_ENTRIES: GyeokgukEntry[] = Object.entries(GYEOKGUK_TABLE).map(([slug, info]) => ({
  slug,
  ...info,
}));

export function getGyeokgukEntry(slug: string): GyeokgukEntry | undefined {
  return GYEOKGUK_ENTRIES.find((g) => g.slug === slug);
}
