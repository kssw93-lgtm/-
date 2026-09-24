/** 입력·개인 결과·안내·검토 원고에는 광고 스크립트 자체를 불러오지 않는다. */
export const REVIEW_ARTICLE_SLUGS = ["saju-input-guide", "birth-time-boundaries", "why-readings-repeat"] as const;

export function isAdEligiblePath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (REVIEW_ARTICLE_SLUGS.some((slug) => path === `/learn/${slug}`)) return false;
  if (path.includes("-compat")) return false;
  return path === "/learn" || path.startsWith("/learn/") ||
    path === "/tarot-guide" || path.startsWith("/tarot-guide/") ||
    path === "/zodiac" || path.startsWith("/zodiac/star/") || path.startsWith("/zodiac/animal/");
}

export function canRequestAds(pathname: string, hostname: string): boolean {
  return process.env.NEXT_PUBLIC_CONTENT_PREVIEW !== "1" &&
    process.env.NEXT_PUBLIC_DISABLE_ADS !== "1" &&
    hostname === "www.sajudalyeok.co.kr" && isAdEligiblePath(pathname);
}
