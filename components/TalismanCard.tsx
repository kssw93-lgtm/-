"use client";

import { useRef, useState } from "react";
import { useAdWatch } from "@/lib/ad";
import AdSlot from "@/components/AdSlot";
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
 * 실제 부적(누런 종이 + 붉은 경면주사 먹 + 세로쓰기 + 낙관)의 시각 문법을 따라
 * 디자인하고, 정보성 텍스트(행운 컬러/키워드)는 부적 이미지 밖 캡션으로 분리해
 * 저장되는 이미지 자체는 실제 부적처럼 보이게 했다. 이미지 저장을 지원해
 * 광고 시청의 대가로 느껴지는 결과물을 남긴다.
 */
export default function TalismanCard({ displayName, luckColor, coreSummary, gyeokguk }: Props) {
  const { state, secondsLeft, watch } = useAdWatch();
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

  if (state === "playing") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <p className="text-xs text-white/50">광고가 끝나면 자동으로 열려요 ({secondsLeft}초)</p>
        <AdSlot label="리워드 광고" />
      </div>
    );
  }

  if (state !== "done") {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
        <span className="text-3xl">🧿</span>
        <p className="font-brand text-base font-bold text-[color:var(--color-gold-light)]">나만의 개운 부적 받기</p>
        <p className="text-xs text-white/50">짧은 광고를 보면 나만의 부적이 만들어져요</p>
        <button
          onClick={() => watch(() => {})}
          className="mt-1 w-full max-w-xs rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3 text-sm font-bold text-[#241a08] transition hover:brightness-110 active:scale-95"
        >
          광고 보고 부적 받기
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* 붉은 테두리 — 바깥 div의 배경색 자체가 테두리 역할(패딩만큼 두께) */}
      <div ref={cardRef} className="w-full max-w-[280px] rounded-sm p-[5px]" style={{ background: "#8f1c14" }}>
        <div
          className="relative overflow-hidden rounded-sm p-6 text-center"
          style={{
            background: "linear-gradient(180deg, #f3d27e 0%, #e6bc63 50%, #c99332 100%)",
            border: "2px solid #8f1c14",
          }}
        >
          <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[#8f1c14]/70" />
          <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[#8f1c14]/70" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[#8f1c14]/70" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[#8f1c14]/70" />

          <div className="relative mx-auto h-4 w-24">
            <span
              className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
              style={{ borderColor: "#8f1c14" }}
            />
            <span
              className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
              style={{ borderColor: "#8f1c14" }}
            />
            <span
              className="absolute left-[14px] right-[14px] top-1/2 h-[2px]"
              style={{ background: "#8f1c14", transform: "translateY(-50%) rotate(10deg)" }}
            />
            <span
              className="absolute left-[14px] right-[14px] top-1/2 h-[2px]"
              style={{ background: "#8f1c14", transform: "translateY(-50%) rotate(-10deg)" }}
            />
          </div>

          <p className="font-brand mt-2 text-[11px] font-black tracking-[0.5em]" style={{ color: "#8f1c14" }}>
            開運符
          </p>

          <div className="mx-auto mt-4 flex min-h-[190px] items-center justify-center">
            <p
              className="font-brand font-black"
              style={{
                writingMode: "vertical-rl",
                color: "#7a140e",
                fontSize: "2.6rem",
                letterSpacing: "0.15em",
                lineHeight: 1.05,
                textShadow: "0 0 1.5px rgba(122,20,14,0.55)",
              }}
            >
              {gyeokguk.name}
            </p>
          </div>

          <div
            className="pointer-events-none absolute bottom-5 right-5 flex h-9 w-9 rotate-[-8deg] items-center justify-center rounded-[2px] text-[10px] font-black text-white"
            style={{ background: "#8f1c14" }}
          >
            吉運
          </div>

          <p className="mt-2 text-[9px] tracking-[0.15em]" style={{ color: "#8f1c14", opacity: 0.6 }}>
            天機漏泄
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs rounded-2xl bg-white/5 p-4 text-center">
        <p className="font-brand text-sm font-bold text-[color:var(--color-gold-light)]">
          {displayName}님을 위한 개운 부적
        </p>
        {luckColor && (
          <p className="mt-1 text-sm text-white/80">
            행운의 컬러 <span className="font-semibold text-[color:var(--color-gold-light)]">{luckColor.color}</span> ·
            행운의 숫자{" "}
            <span className="font-semibold text-[color:var(--color-gold-light)]">{luckColor.numbers.join(", ")}</span>
          </p>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {coreSummary.keywords.map((k) => (
            <span key={k} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              #{k}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          이 색과 숫자를 오늘 하루 곁에 두어보세요. 재미로 보는 개운 아이템이에요 :)
        </p>
      </div>

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
