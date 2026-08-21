"use client";

import AdGate from "./AdGate";
import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import { describeDayMasterPair, type CompatibilityResult } from "@/lib/interpretation/compatibility";
import type { SajuResult } from "@/lib/calc/types";

interface Props {
  nameA: string;
  nameB: string;
  sajuA: SajuResult;
  sajuB: SajuResult;
  result: CompatibilityResult;
  adUnlocked: boolean;
  onAdUnlocked: () => void;
  onRestart: () => void;
}

/** 궁합 결과 화면. 계산 규칙서 60번: 두 사람의 독립 사주를 각각 계산한 뒤 비교한다. */
export default function CompatibilityResultScreen({
  nameA,
  nameB,
  sajuA,
  sajuB,
  result,
  adUnlocked,
  onAdUnlocked,
  onRestart,
}: Props) {
  const displayA = nameA.trim() || "나";
  const displayB = nameB.trim() || "상대방";

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-center text-2xl font-bold">
        {displayA} × {displayB} 궁합
      </h1>

      <div className="rounded-2xl bg-white/10 p-5 text-center">
        <p className="text-xs text-white/50">두 사람의 일주(日柱)</p>
        <p className="mt-1 text-2xl font-bold text-[color:var(--color-gold-light)]">
          {describeDayMasterPair(sajuA, sajuB)}
        </p>
      </div>

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">서로에게 통하는 기운</p>
        <p className="text-base leading-relaxed">{result.text}</p>
      </div>

      <AdGate unlocked={adUnlocked} onUnlocked={onAdUnlocked}>
        <div className="flex flex-col gap-4">
          {result.dayBranchRelation && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
                배우자궁(일지)의 관계 — {result.dayBranchRelation.name}
              </p>
              <p className="text-base leading-relaxed">{result.dayBranchRelation.desc}.</p>
            </div>
          )}

          {!result.dayBranchRelation && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">배우자궁(일지)의 관계</p>
              <p className="text-base leading-relaxed">
                두 사람의 일지 사이에 뚜렷한 합충 관계는 없어요. 서로에게 큰 자극이나 마찰 없이 각자의 속도를
                지키며 지낼 수 있는 조합이에요.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white/10 p-5 text-sm leading-relaxed text-white/70">
            궁합은 두 사람의 원국을 각각 정확히 계산한 뒤, 일간 사이의 십신 관계와 일지(배우자궁)의 합충
            관계만으로 판단한 결과예요. 한쪽 사주만으로 상대를 추정하지 않고, 실제로 계산된 두 사람의 값을
            그대로 비교했어요.
          </div>

          <AdSlot />
        </div>
      </AdGate>

      <FreeAdsNotice />

      <button
        onClick={onRestart}
        className="mt-auto w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition hover:brightness-110 active:scale-95"
      >
        다른 운세도 보기
      </button>
    </div>
  );
}
