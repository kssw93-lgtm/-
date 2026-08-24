"use client";

import { useRef, useState } from "react";
import { useSimulatedAdWatch } from "@/lib/ad";
import type { CoreSummary, Gyeokguk, LuckColorDisplay } from "@/lib/interpretation";

interface Props {
  displayName: string;
  luckColor: LuckColorDisplay | null;
  coreSummary: CoreSummary;
  gyeokguk: Gyeokguk;
}

/**
 * 재미 콘텐츠: 광고를 보면 이미 계산된 값(행운의 컬러·숫자, 핵심 키워드, 격국)을
 * 부적 느낌으로 재구성해 보여준다. 새 계산 없음 — 전부 이미 화면 다른 곳에도 나오는
 * 값을 다시 조합해 "재미로 보는" 카드로 꾸민 것뿐이라 없는 사실을 지어내지 않는다.
 * 실제 부적 특유의 붉은 바탕·금테·낙관(도장) 모티프로 디자인하고, 이미지 저장을
 * 지원해 광고 시청의 대가로 느껴지는 결과물을 남긴다.
 */
export default function TalismanCard({ displayName, luckColor, coreSummary, gyeokguk }: Props) {
  const { state, watch } = useSimulatedAdWatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done">("idle");

  async function handleSave() {
    if (!cardRef.current || saveState === "saving") return;
    setSaveState("saving");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `${displayName || "나"}-개운부적.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }

  if (state !== "done") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <span className="text-3xl">🧿</span>
        <p className="font-brand text-base font-bold text-[color:var(--color-gold-light)]">나만의 개운 부적 받기</p>
        <p className="text-xs text-white/50">짧은 광고를 보면 나만의 부적이 만들어져요</p>
        <button
          onClick={() => watch(() => {})}
          disabled={state === "playing"}
          className="mt-1 w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3 text-sm font-bold text-[#241a08] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-60"
        >
          {state === "playing" ? "부적 만드는 중…" : "광고 보고 부적 받기"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="relative w-full max-w-xs overflow-hidden rounded-md border-[3px] border-double border-[#e0be82] p-7 text-center"
        style={{
          background: "radial-gradient(120% 100% at 50% 0%, #8a1c28 0%, #6b1420 45%, #43101a 100%)",
          boxShadow: "0 12px 40px rgba(107,20,32,0.45)",
        }}
      >
        <span className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 border-l-2 border-t-2 border-[#e0be82]/80" />
        <span className="pointer-events-none absolute right-2.5 top-2.5 h-5 w-5 border-r-2 border-t-2 border-[#e0be82]/80" />
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 border-b-2 border-l-2 border-[#e0be82]/80" />
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-5 w-5 border-b-2 border-r-2 border-[#e0be82]/80" />

        <p className="font-brand text-sm font-black tracking-[0.6em] text-[#f3ddb0]">開運符</p>

        <div className="relative mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-[#f3ddb0]/90 bg-[#2c0812]/50">
          <span className="font-brand text-xl font-black text-[#f3ddb0]">{gyeokguk.name}</span>
        </div>

        <p className="font-brand mt-6 text-lg font-black text-[#f6e5c2]">{displayName}님을 위한 개운 부적</p>

        {luckColor && (
          <p className="mt-2 text-sm text-[#f3ddb0]/90">
            행운의 컬러 <span className="font-bold">{luckColor.color}</span> · 행운의 숫자{" "}
            <span className="font-bold">{luckColor.numbers.join(", ")}</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {coreSummary.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-[#f3ddb0]/40 bg-[#2c0812]/50 px-3 py-1 text-xs font-medium text-[#f3ddb0]/90"
            >
              #{k}
            </span>
          ))}
        </div>

        <p className="mt-6 text-[10px] tracking-[0.2em] text-[#f3ddb0]/50">天機漏泄 · 재미로 보는 개운 부적</p>

        <div
          className="pointer-events-none absolute bottom-4 right-4 flex h-11 w-11 rotate-[-9deg] items-center justify-center rounded-sm border-2 text-[10px] font-black"
          style={{ borderColor: "#e8b0a8", color: "#e8b0a8" }}
        >
          吉運
        </div>
      </div>

      <p className="max-w-xs text-center text-xs leading-relaxed text-white/40">
        이 색과 숫자를 오늘 하루 곁에 두어보세요. 재미로 보는 개운 아이템이에요 :)
      </p>

      <button
        onClick={handleSave}
        disabled={saveState === "saving"}
        className="w-full max-w-xs rounded-full border border-[color:var(--color-gold)]/50 px-6 py-3 text-sm font-bold text-[color:var(--color-gold-light)] transition enabled:hover:bg-[color:var(--color-gold)]/10 enabled:active:scale-95 disabled:opacity-60"
      >
        {saveState === "saving" ? "이미지 만드는 중…" : saveState === "done" ? "저장 완료! 📥" : "🖼 이미지로 저장"}
      </button>
    </div>
  );
}
