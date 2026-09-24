"use client";

import { useEffect, useRef, useState } from "react";
import { useRewardedAd } from "@/lib/rewarded-ad";
import { isResultUnlocked, markResultUnlocked } from "@/lib/result-unlock";

const AD_UNIT_PATH = process.env.NEXT_PUBLIC_AD_MANAGER_REWARDED_UNIT_PATH;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
/** fail-open 안내 문구를 읽을 최소 시간(ms). 광고 준비 자체는 lib/rewarded-ad.ts의
 * READY_TIMEOUT_MS(4초)로 이미 따로 제한돼 있어, 이 값은 그 위에 더해지는 "알리는
 * 시간"일 뿐이다 — 총 대기시간이 무한정 늘어나지 않는다. */
const FAIL_OPEN_DISPLAY_MS = 1200;

interface Props {
  /** lib/result-unlock.ts의 build*ResultKey()로 만든, 이 결과를 고유하게 가리키는 키. */
  resultKey: string;
  /** rewardedSlotGranted(또는 fail-open)로 실제 결과를 열어도 될 때 호출된다. */
  onUnlocked: () => void;
  /** 사전 안내에서 "닫기"를 눌렀을 때 — 결과를 열지 않고 이전 화면 등으로 돌아간다. */
  onCancel: () => void;
}

/**
 * "풀이 보기 전 사전 안내 → 사용자가 직접 선택 → 실제 보상형 광고 → 광고 시청
 * 완료(rewardedSlotGranted)했을 때만 결과 해제" 게이트. 결과 자체는 호출부가
 * 이미 백그라운드에서 계산해뒀다가 이 컴포넌트가 onUnlocked를 부르는 순간
 * 바로 보여주므로, 여기서는 계산을 하지 않고 오직 광고 동의·시청 상태만 다룬다.
 *
 * 같은 resultKey가 이번 브라우저 세션에서 이미 해제된 적 있으면(새로고침, 뒤로가기
 * 등) 아무것도 그리지 않고 즉시 onUnlocked를 불러 광고를 반복하지 않는다 — 다만
 * 이 판단은 보통 호출부(SajuFlow)가 화면 전환 이전에 먼저 하므로, 여기 체크는
 * 이중 안전장치다.
 */
export default function ResultUnlockGate({ resultKey, onUnlocked, onCancel }: Props) {
  const [consented, setConsented] = useState(false);
  const [failOpenMessage, setFailOpenMessage] = useState<string | null>(null);
  const ad = useRewardedAd(AD_UNIT_PATH);
  const resolvedRef = useRef(false);
  const failOpenTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function resolveUnlocked() {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    markResultUnlocked(resultKey);
    onUnlocked();
  }

  useEffect(() => {
    // 광고 단위 자체가 설정 안 된 상태(=애드센스/광고 계정 승인 전)에서는 안내 화면도
    // 없이 즉시 통과시킨다. 광고 단위가 실제로 설정된 뒤 일시적으로 못 불러온 경우의
    // fail-open(안내 문구 + 짧은 대기)과는 다른 경우라 구분해서 처리한다.
    if (!AD_UNIT_PATH || isResultUnlocked(resultKey)) {
      resolveUnlocked();
      return;
    }
    return () => clearTimeout(failOpenTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultKey]);

  useEffect(() => {
    if (resolvedRef.current) return;

    if (ad.status === "granted") {
      resolveUnlocked();
      return;
    }

    if (ad.status === "unavailable" && !failOpenMessage) {
      setFailOpenMessage("현재 광고를 불러올 수 없어 이번 풀이는 바로 보여드릴게요.");
      failOpenTimerRef.current = setTimeout(resolveUnlocked, FAIL_OPEN_DISPLAY_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad.status]);

  // 사용자가 "광고 시청"을 누른 뒤 준비가 늦게 끝난 경우, 준비되는 즉시 자동으로 띄운다
  // (다시 누르게 하지 않는다).
  useEffect(() => {
    if (consented && ad.status === "ready") ad.show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consented, ad.status]);

  function handleWatchAd() {
    setConsented(true);
    if (ad.status === "ready") ad.show();
  }

  function handleRetry() {
    setConsented(false);
    ad.retry();
  }

  if (failOpenMessage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-3xl">🔓</span>
        <p className="text-sm leading-relaxed text-white/70">{failOpenMessage}</p>
      </div>
    );
  }

  // 시청 도중 끝까지 못 보고 닫힌 경우(보상 미확정) — 결과는 열지 않고 재시도를 안내한다.
  if (consented && ad.status === "closed") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-3xl">📺</span>
        <p className="text-base font-bold text-white/90">광고를 끝까지 봐야 풀이를 확인할 수 있어요</p>
        <p className="text-xs text-white/40">중간에 닫으신 것 같아요. 다시 시도해 주세요.</p>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={handleRetry}
            className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-base font-bold text-[#241a08] transition hover:brightness-110 active:scale-95"
          >
            다시 시도
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/20"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  if (consented && (ad.status === "showing" || ad.status === "loading" || ad.status === "ready")) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[color:var(--color-gold)]" />
        <p className="text-sm text-white/60">
          {ad.status === "showing" ? "광고를 보여드리고 있어요…" : "광고를 준비하고 있어요…"}
        </p>
      </div>
    );
  }

  const buttonLabel = ad.status === "loading" ? "광고 준비 중…" : "광고 시청";
  const buttonDisabled = ad.status === "loading";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-3xl">🔮</span>
      <p className="text-lg font-bold text-white/90">풀이 보기</p>
      <p className="text-sm leading-relaxed text-white/60">짧은 광고를 본 뒤 이번 풀이를 바로 확인할 수 있어요.</p>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          onClick={handleWatchAd}
          disabled={buttonDisabled}
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-base font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-50"
        >
          {buttonLabel}
        </button>
        <button
          onClick={onCancel}
          className="w-full rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/20"
        >
          닫기
        </button>
      </div>
      {!IS_PRODUCTION && (
        <button
          onClick={resolveUnlocked}
          className="mt-2 rounded-full border border-dashed border-white/20 px-4 py-2 text-[11px] text-white/40 transition hover:border-white/40 hover:text-white/60"
        >
          🧪 개발용 — 광고 없이 결과 보기
        </button>
      )}
    </div>
  );
}
