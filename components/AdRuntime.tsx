"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canRequestAds, isAdEligiblePath } from "@/lib/ads-policy";

/** 실제 광고 단위가 있는 페이지에서만 실행하며, 로컬·프리뷰는 실광고를 요청하지 않는다. */
export function useAdEligibility() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const allowed = canRequestAds(pathname, window.location.hostname);
    setEnabled(allowed);
    if (!allowed || document.getElementById("saju-adsense-script")) return;
    const script = document.createElement("script");
    script.id = "saju-adsense-script";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8704899603701516";
    document.head.appendChild(script);
  }, [pathname]);
  return enabled && isAdEligiblePath(pathname);
}

/** SPA에 남은 자동 광고 스크립트가 입력 화면으로 따라오지 않도록 경계를 넘을 때 문서를 새로 연다. */
export default function AdNavigationBoundary() {
  useEffect(() => {
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download || (anchor.target && anchor.target !== "_self")) return;
      const next = new URL(anchor.href, window.location.href);
      if (next.origin !== window.location.origin || next.pathname === window.location.pathname) return;
      if (!document.getElementById("saju-adsense-script") && isAdEligiblePath(next.pathname) === isAdEligiblePath(window.location.pathname)) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(next.href);
    }
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, []);
  return null;
}
