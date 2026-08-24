"use client";

export type ReliabilityTier = "core" | "interpretive" | "fun";

const TIER_META: Record<ReliabilityTier, { emoji: string; label: string; color: string }> = {
  core: { emoji: "🟢", label: "명리학 기반", color: "#4ade80" },
  interpretive: { emoji: "🟡", label: "명리학 해석", color: "#e8cd94" },
  fun: { emoji: "🔮", label: "재미로 보는 콘텐츠", color: "#c9a3e8" },
};

/**
 * 콘텐츠 신빙성 등급 표시 — 원국/오행/십신/대운처럼 직접 계산한 값(🟢)과, 그 값을 현실적인
 * 언어로 풀어쓴 해석(🟡), 띠·별자리·전생처럼 계산 근거가 약한 재미 콘텐츠(🔮)를 시각적으로
 * 구분한다. 모든 내용을 똑같이 "명리학적 사실"처럼 보여주면 오히려 신뢰가 떨어진다는 판단—
 * 사용자가 어디까지 진지하게 볼지 스스로 판단할 수 있게 한다.
 */
export default function ReliabilityBadge({ tier }: { tier: ReliabilityTier }) {
  const meta = TIER_META[tier];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}
