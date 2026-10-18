/** 입력·안내·오류 화면과 콘텐츠가 적은 화면에는 광고 스크립트 자체를 불러오지 않는다. */
export const REVIEW_ARTICLE_SLUGS = ["saju-input-guide", "birth-time-boundaries", "why-readings-repeat"] as const;

/**
 * spaContent: 메인 앱("/")은 한 URL 안에서 화면이 바뀌는 SPA라 경로만으로는 입력 화면과
 * 결과 화면을 구분할 수 없다. 풀이 본문이 실제로 보이는 결과 화면(결과·궁합·오늘의 운세)이
 * 직접 true를 넘길 때만 "/"에서도 광고를 허용한다.
 */
export function isAdEligiblePath(pathname: string, spaContent = false): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return spaContent;
  if (REVIEW_ARTICLE_SLUGS.some((slug) => path === `/learn/${slug}`)) return false;
  if (path.includes("-compat")) return false;
  return path === "/learn" || path.startsWith("/learn/") ||
    path === "/tarot-guide" || path.startsWith("/tarot-guide/") ||
    path.startsWith("/tarot/") ||
    path === "/zodiac" || path.startsWith("/zodiac/star/") || path.startsWith("/zodiac/animal/") ||
    path === "/zodiac/today" || path === "/lucky-day" || path.startsWith("/newyear/");
}

export function canRequestAds(pathname: string, hostname: string, spaContent = false): boolean {
  return process.env.NEXT_PUBLIC_CONTENT_PREVIEW !== "1" &&
    process.env.NEXT_PUBLIC_DISABLE_ADS !== "1" &&
    hostname === "www.sajudalyeok.co.kr" && isAdEligiblePath(pathname, spaContent);
}

/**
 * 애드센스 태그(adsbygoogle.js) 자체를 불러와도 되는지. 오퍼월 같은 구글 메시지는 이 태그가 있어야
 * 첫 화면부터 뜬다. 태그를 불러오는 것과 광고 칸(ins)을 그리는 것은 별개라서, 광고는 여전히
 * isAdEligiblePath인 화면에서만 그리고 입력·안내 화면에는 광고 칸이 없다. 로컬·프리뷰는 불러오지 않는다.
 */
export function canLoadAdTag(hostname: string): boolean {
  return process.env.NEXT_PUBLIC_CONTENT_PREVIEW !== "1" &&
    process.env.NEXT_PUBLIC_DISABLE_ADS !== "1" &&
    hostname === "www.sajudalyeok.co.kr";
}
