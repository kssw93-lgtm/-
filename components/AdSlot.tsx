"use client";

import { useEffect, useRef, useState } from "react";

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
 *
 * 반응형(auto) 포맷은 실제로 광고가 채워지는지와 무관하게 레이아웃 공간을 먼저
 * 예약해두는 특성이 있어, 미채움(no-fill) 상태가 오래 지속되면 화면에 빈 여백만
 * 남는다. push 후 일정 시간 안에 data-ad-status가 "filled"로 바뀌지 않으면
 * 아예 렌더링을 접어(display: none) 빈 공간이 남지 않도록 한다.
 */
export default function AdSlot({ label }: { label?: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
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
        setCollapsed(true);
        return;
      }
      // 개발 모드의 StrictMode 이펙트 이중 호출로 cleanup이 이 타이머를 취소해버리면
      // 미채움 감지가 영영 동작하지 않으므로, 언마운트 여부와 무관하게 살려둔다
      // (언마운트된 뒤에 실행돼도 insRef.current가 null이라 안전하게 무시된다).
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
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
      aria-label={label ? `${label} 영역` : undefined}
    />
  );
}
