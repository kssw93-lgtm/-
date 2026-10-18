"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canLoadAdTag, canRequestAds, isAdEligiblePath } from "@/lib/ads-policy";

const AD_SCRIPT_ID = "saju-adsense-script";
const AD_SCRIPT_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8704899603701516";

function injectAdTag() {
  if (hasAdScriptLoaded()) return;
  const script = document.createElement("script");
  script.id = AD_SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = AD_SCRIPT_SRC;
  document.head.appendChild(script);
}

export function hasAdScriptLoaded(): boolean {
  return typeof document !== "undefined" && !!document.getElementById(AD_SCRIPT_ID);
}

/**
 * 실제 광고 단위가 있는 페이지에서만 실행하며, 로컬·프리뷰는 실광고를 요청하지 않는다.
 * spaContent는 메인 앱("/")의 풀이 결과 화면처럼 본문이 실제로 보이는 화면에서만 true로 넘긴다.
 */
export function useAdEligibility(spaContent = false) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const allowed = canRequestAds(pathname, window.location.hostname, spaContent);
    setEnabled(allowed);
    if (allowed) injectAdTag();
  }, [pathname, spaContent]);
  return enabled && isAdEligiblePath(pathname, spaContent);
}

/**
 * 모든 페이지에서 애드센스 태그를 처음부터 불러온다. 구글 오퍼월("광고 한 번 보면 N시간 이용")
 * 같은 메시지는 이 태그가 있어야 방문 직후에 뜨기 때문이다. 광고 칸은 따로 isAdEligiblePath인
 * 화면에서만 그린다.
 */
export default function AdSenseTag() {
  useEffect(() => {
    if (canLoadAdTag(window.location.hostname)) injectAdTag();
  }, []);
  return null;
}
