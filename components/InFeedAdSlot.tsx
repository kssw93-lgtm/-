"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_CLIENT = "ca-pub-8704899603701516";
const AD_SLOT = "4353374595";
/** 애드센스 콘솔에서 "상단 이미지" 스타일로 만든 인피드 광고의 레이아웃 키. */
const AD_LAYOUT_KEY = "-6t+ed+2i-1n-4w";

/**
 * 인피드(네이티브) 광고 단위. 타로/별자리/띠 카드 그리드처럼 "이미지 위, 텍스트 아래"
 * 구조인 피드 안에 카드 하나처럼 자연스럽게 섞여 들어가도록 만든 스타일이라, 같은
 * grid 컨테이너 안에 다른 카드들과 나란히 배치해야 한다(그리드 밖에 단독으로 두면
 * 레이아웃이 깨진다). AdSlot.tsx와 동일하게 폭이 잡힐 때까지 기다렸다가 push하고,
 * 일정 시간 안에 채워지지 않으면 접어서 빈 카드 자리가 남지 않게 한다.
 */
export default function InFeedAdSlot({ label }: { label?: string }) {
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
      style={{ display: "block" }}
      data-ad-format="fluid"
      data-ad-layout-key={AD_LAYOUT_KEY}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      aria-label={label ? `${label} 영역` : undefined}
    />
  );
}
