"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Google Ad Manager 보상형(rewarded) 광고 훅. GPT(Google Publisher Tag)의
 * defineOutOfPageSlot(..., OutOfPageFormat.REWARDED) 방식을 그대로 쓴다.
 *
 * 상태 흐름: idle → loading(슬롯 정의·요청 중) → ready(표시 대기, makeRewardedVisible
 * 호출 가능) → showing(사용자에게 노출 중) → granted(끝까지 시청, 보상 확정) /
 * closed(끝까지 안 보고 닫음 — 보상 없음) / unavailable(광고 단위 미설정·미지원·
 * 미충전·네트워크 오류 등으로 아예 못 띄움).
 *
 * "표시(visible)"는 사용자가 명시적으로 원할 때만 트리거해야 하므로 slot 정의·요청
 * 자체는 훅이 마운트되자마자(백그라운드) 시작하되, 실제 화면에 뜨는 시점은 호출부가
 * showRewardedAd()를 불러야만 발생한다(GPT의 rewardedSlotReady 이벤트가 주는
 * makeRewardedVisible()을 그때 실행). 이렇게 하면 "광고 준비"와 "광고 표시"를
 * 분리해, 준비가 끝나기 전에도 CTA는 먼저 보여주고 버튼 라벨만 "준비 중"으로
 * 바꿀 수 있다.
 */

export type RewardedAdStatus =
  | "idle"
  | "loading"
  | "ready"
  | "showing"
  | "granted"
  | "closed"
  | "unavailable";

const GPT_SCRIPT_SRC = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";

let gptScriptPromise: Promise<void> | null = null;
let enabledServicesOnce = false;
/** 한 번에 하나의 보상형 슬롯만 요청한다 — 여러 화면이 동시에 훅을 마운트해도
 * 두 번째 요청은 즉시 "unavailable"로 빠진다(정책 요구사항: "한 번에 하나만"). */
let activeSlotHolder: symbol | null = null;

function loadGptScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.googletag && window.googletag.cmd) {
    gptScriptPromise = gptScriptPromise ?? Promise.resolve();
    return gptScriptPromise;
  }
  if (gptScriptPromise) return gptScriptPromise;

  gptScriptPromise = new Promise((resolve, reject) => {
    window.googletag = window.googletag || ({ cmd: [] } as unknown as Googletag);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GPT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("gpt.js load error")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = GPT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gpt.js load error"));
    document.head.appendChild(script);
  });
  return gptScriptPromise;
}

/** 광고 단위 미설정·미지원·타임아웃 등 실패 시 결과를 계속 막아두지 않는다(fail-open)
 * — 정책 요구사항: "3~5초 내에 알린 뒤 결과를 열어준다". */
const READY_TIMEOUT_MS = 4000;

export function useRewardedAd(adUnitPath: string | undefined) {
  const [status, setStatus] = useState<RewardedAdStatus>("idle");
  const slotRef = useRef<GoogletagSlot | null>(null);
  const ownerRef = useRef<symbol | null>(null);
  const readyEventRef = useRef<GoogletagRewardedSlotReadyEvent | null>(null);
  const listenersRef = useRef<{
    ready?: (e: GoogletagRewardedSlotReadyEvent) => void;
    granted?: (e: GoogletagRewardedSlotGrantedEvent) => void;
    closed?: (e: GoogletagRewardedSlotClosedEvent) => void;
  }>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const grantedRef = useRef(false);
  const mountedRef = useRef(true);
  /** show()가 빠르게 연속 호출돼도 makeRewardedVisible()은 한 번만 나가야 한다.
   * React state(status)는 같은 이벤트 루프 틱 안의 연속 클릭에는 즉시 반영되지
   * 않으므로(배치 처리), 동기적으로 즉시 확정되는 ref로 따로 막는다. */
  const shownRef = useRef(false);

  const cleanupSlot = useCallback(() => {
    clearTimeout(timeoutRef.current);
    const slot = slotRef.current;
    const pubads = typeof window !== "undefined" ? window.googletag?.pubads() : undefined;
    if (pubads) {
      if (listenersRef.current.ready) pubads.removeEventListener("rewardedSlotReady", listenersRef.current.ready);
      if (listenersRef.current.granted) pubads.removeEventListener("rewardedSlotGranted", listenersRef.current.granted);
      if (listenersRef.current.closed) pubads.removeEventListener("rewardedSlotClosed", listenersRef.current.closed);
    }
    listenersRef.current = {};
    if (slot && typeof window !== "undefined" && window.googletag) {
      try {
        window.googletag.destroySlots([slot]);
      } catch {
        // 이미 정리된 슬롯이거나 GPT 내부 상태 문제 — 화면 흐름에 영향 없으니 무시
      }
    }
    slotRef.current = null;
    readyEventRef.current = null;
    if (ownerRef.current && activeSlotHolder === ownerRef.current) {
      activeSlotHolder = null;
    }
    ownerRef.current = null;
  }, []);

  const requestSlot = useCallback(() => {
    if (!adUnitPath) {
      setStatus("unavailable");
      return;
    }
    if (activeSlotHolder !== null) {
      // 이미 다른 곳에서 슬롯을 쓰고 있다 — 정책상 동시에 두 개를 요청하지 않는다.
      setStatus("unavailable");
      return;
    }
    const owner = Symbol("rewarded-ad-owner");
    ownerRef.current = owner;
    activeSlotHolder = owner;
    grantedRef.current = false;
    shownRef.current = false;
    setStatus("loading");

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current || ownerRef.current !== owner) return;
      cleanupSlot();
      setStatus("unavailable");
    }, READY_TIMEOUT_MS);

    loadGptScript()
      .then(() => {
        if (!mountedRef.current || ownerRef.current !== owner) return;
        const googletag = window.googletag as Googletag;
        googletag.cmd.push(() => {
          if (!mountedRef.current || ownerRef.current !== owner) return;
          // 광고 차단기 등으로 GPT 내부 호출 자체가 예외를 던지는 경우가 있어,
          // 슬롯 정의부터 리스너 등록까지 전부 감싸서 활성 슬롯 락이 영구히
          // 걸린 채로 남지 않게 한다.
          let slot: GoogletagSlot | null = null;
          try {
            slot = googletag.defineOutOfPageSlot(adUnitPath, googletag.enums.OutOfPageFormat.REWARDED);
          } catch {
            slot = null;
          }
          if (!slot) {
            clearTimeout(timeoutRef.current);
            ownerRef.current = null;
            if (activeSlotHolder === owner) activeSlotHolder = null;
            setStatus("unavailable");
            return;
          }
          slotRef.current = slot;

          const pubads = googletag.pubads();

          const onReady = (event: GoogletagRewardedSlotReadyEvent) => {
            if (event.slot !== slot || ownerRef.current !== owner) return;
            clearTimeout(timeoutRef.current);
            readyEventRef.current = event;
            if (mountedRef.current) setStatus("ready");
          };
          const onGranted = (event: GoogletagRewardedSlotGrantedEvent) => {
            if (event.slot !== slot || ownerRef.current !== owner) return;
            grantedRef.current = true;
            if (mountedRef.current) setStatus("granted");
          };
          const onClosed = (event: GoogletagRewardedSlotClosedEvent) => {
            if (event.slot !== slot || ownerRef.current !== owner) return;
            const wasGranted = grantedRef.current;
            cleanupSlot();
            if (mountedRef.current) setStatus(wasGranted ? "granted" : "closed");
          };

          try {
            listenersRef.current = { ready: onReady, granted: onGranted, closed: onClosed };
            pubads.addEventListener("rewardedSlotReady", onReady);
            pubads.addEventListener("rewardedSlotGranted", onGranted);
            pubads.addEventListener("rewardedSlotClosed", onClosed);

            if (!enabledServicesOnce) {
              enabledServicesOnce = true;
              googletag.enableServices();
            }
            googletag.display(slot);
          } catch {
            clearTimeout(timeoutRef.current);
            ownerRef.current = null;
            if (activeSlotHolder === owner) activeSlotHolder = null;
            setStatus("unavailable");
          }
        });
      })
      .catch(() => {
        if (!mountedRef.current || ownerRef.current !== owner) return;
        clearTimeout(timeoutRef.current);
        ownerRef.current = null;
        if (activeSlotHolder === owner) activeSlotHolder = null;
        setStatus("unavailable");
      });
  }, [adUnitPath, cleanupSlot]);

  /** 사용자가 "광고 시청"을 눌렀을 때만 실제로 화면에 띄운다. 빠르게 연속으로 불려도
   * makeRewardedVisible()은 정확히 한 번만 나간다(shownRef가 동기적으로 막는다). */
  const show = useCallback(() => {
    if (shownRef.current) return;
    if (status !== "ready" || !readyEventRef.current) return;
    shownRef.current = true;
    setStatus("showing");
    readyEventRef.current.makeRewardedVisible();
  }, [status]);

  /** 닫힘(보상 없음) 이후 사용자가 다시 시도할 때 새 슬롯을 요청한다. */
  const retry = useCallback(() => {
    cleanupSlot();
    setStatus("idle");
    requestSlot();
  }, [cleanupSlot, requestSlot]);

  useEffect(() => {
    mountedRef.current = true;
    requestSlot();
    return () => {
      mountedRef.current = false;
      cleanupSlot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, show, retry };
}
