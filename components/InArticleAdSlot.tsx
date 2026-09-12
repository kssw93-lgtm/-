"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_CLIENT = "ca-pub-8704899603701516";
const AD_SLOT = "4161802900";

/**
 * 인아티클 광고 단위. 긴 글 본문 문단 사이에 끼워 넣도록 만든 스타일이라(애드센스
 * 공식 가이드: "문단과 문단 사이"), 목록/그리드용 InFeedAdSlot과는 다른 자리에 쓴다.
 * AdSlot.tsx와 동일한 방어 로직(폭이 잡힐 때까지 대기, 미채움 시 접기)을 그대로 쓴다.
 */
export default function InArticleAdSlot({ label }: { label?: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let raf = 0;
    let attempts = 0;

    function tryPush() {
      if (pushedRef.current || !insRef.current) return;
      if (insRef.current.getBoundingClientRect().width === 0) {
        attempts += 1;
        if (attempts < 20) raf = requestAnimationFrame(tryPush);
        return;
      }
      pushedRef.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        setCollapsed(true);
        return;
      }
      setTimeout(() => {
        if (insRef.current?.getAttribute("data-ad-status") !== "filled") {
          setCollapsed(true);
        }
      }, 4000);
    }
    raf = requestAnimationFrame(tryPush);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (collapsed) return null;

  return (
    <ins
      ref={insRef}
      className="adsbygoogle no-print"
      style={{ display: "block", textAlign: "center" }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      aria-label={label ? `${label} 영역` : undefined}
    />
  );
}
