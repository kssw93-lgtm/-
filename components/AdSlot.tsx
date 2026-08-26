"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_CLIENT = "ca-pub-8704899603701516";
const AD_SLOT = "3567680618";

/**
 * 실제 애드센스 디스플레이 광고 단위(반응형). 인스턴스마다 한 번씩
 * adsbygoogle.push({})를 호출해야 광고가 실제로 렌더링된다 — 광고 차단기 등으로
 * 실패해도 레이아웃이 깨지지 않도록 조용히 무시한다.
 * 반응형 광고는 부모에 고정 높이를 주면 0x0으로 접혀버릴 수 있어 일부러 높이를
 * 강제하지 않는다(애드센스 공식 권장 사항).
 */
export default function AdSlot({ label }: { label?: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    let raf = 0;
    let attempts = 0;

    // 하이드레이션 직후 몇 프레임 동안은 부모 폭이 아직 0일 수 있어(특히 폰트 스왑과
    // 겹치면) "No slot size for availableWidth=0" 에러가 난다. 실제로 폭이 잡힐
    // 때까지(최대 20프레임) 기다렸다가 push한다.
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
        // 광고 차단기 등으로 실패해도 무시 — 나머지 화면은 그대로 정상 동작해야 한다
      }
    }
    raf = requestAnimationFrame(tryPush);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle no-print"
      style={{ display: "block" }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
      aria-label={label ? `${label} 영역` : undefined}
    />
  );
}
