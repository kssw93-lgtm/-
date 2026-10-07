"use client";

import { useEffect, useRef, useState } from "react";

import { useAdEligibility } from "./AdRuntime";

const AD_CLIENT = "ca-pub-8704899603701516";
const AD_SLOT = "3567680618";
const RAIL_WIDTH = 160;
/** 본문 컬럼(max-w-md = 448px) 양옆에 160px 광고와 여백을 두고도 화면이 넘치지 않는 최소 폭. */
const MIN_VIEWPORT_WIDTH = 960;
const COLUMN_HALF = 224;
const GAP = 16;

function Rail({ side }: { side: "left" | "right" }) {
  const insRef = useRef<HTMLModElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      setCollapsed(true);
      return;
    }
    // 미채움이면 자리를 접는다(광고 영역이 빈 채로 남지 않게).
    const timer = setTimeout(() => {
      if (insRef.current?.getAttribute("data-ad-status") !== "filled") setCollapsed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (collapsed) return null;

  const offset = side === "left" ? `calc(50% - ${COLUMN_HALF + GAP + RAIL_WIDTH}px)` : `calc(50% + ${COLUMN_HALF + GAP}px)`;
  return (
    <div className="no-print" style={{ position: "fixed", top: 96, left: offset, width: RAIL_WIDTH, zIndex: 1 }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "inline-block", width: RAIL_WIDTH, height: 600 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        aria-label={`${side === "left" ? "왼쪽" : "오른쪽"} 사이드 광고 영역`}
      />
    </div>
  );
}

/**
 * PC처럼 화면이 넓을 때만 본문 컬럼 좌우 빈 공간에 세로 광고(160×600)를 고정으로 붙인다.
 * 좁은 화면에서는 아예 렌더링하지 않아 광고를 요청하지도 않는다. 광고가 허용된 페이지에서만 동작한다
 * (useAdEligibility). 메인 앱 결과 화면은 spaContent를 넘겨서 허용한다.
 */
export default function SideRailAds({ spaContent = false }: { spaContent?: boolean }) {
  const enabled = useAdEligibility(spaContent);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_VIEWPORT_WIDTH}px)`);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled || !wide) return null;
  return (
    <>
      <Rail side="left" />
      <Rail side="right" />
    </>
  );
}
