"use client";

import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import { describeDayMasterPair, type CompatibilityResult } from "@/lib/interpretation/compatibility";
import { computeCompatibilityAxes, getConflictPoint, getSecretMindTeaser, type CompatTier } from "@/lib/interpretation/compatibility-axes";
import SecretMindCard from "./SecretMindCard";
import type { SajuResult } from "@/lib/calc/types";

const TIER_COLOR: Record<CompatTier, string> = {
  good: "#4ade80",
  neutral: "#c9a35c",
  challenging: "#f87171",
};

interface Props {
  nameA: string;
  nameB: string;
  sajuA: SajuResult;
  sajuB: SajuResult;
  result: CompatibilityResult;
  onRestart: () => void;
}

/** 한글 받침 유무에 따라 주격조사(이/가)를 붙인다. "나"→"내가", "저"→"제가"는 불규칙 활용이라 예외 처리한다. */
function withSubjectParticle(word: string): string {
  if (word === "나") return "내가";
  if (word === "저") return "제가";
  const lastCharCode = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = lastCharCode >= 0 && lastCharCode <= 11171 && lastCharCode % 28 !== 0;
  return hasBatchim ? `${word}이` : `${word}가`;
}

/** 궁합 결과 화면. 계산 규칙서 60번: 두 사람의 독립 사주를 각각 계산한 뒤 비교한다. */
export default function CompatibilityResultScreen({
  nameA,
  nameB,
  sajuA,
  sajuB,
  result,
  onRestart,
}: Props) {
  const displayA = nameA.trim() || "나";
  const displayB = nameB.trim() || "상대방";
  const axes = computeCompatibilityAxes(result);
  const axisList = [axes.personality, axes.communication, axes.emotional, axes.daily, axes.money, axes.marriage];
  const conflictPoint = getConflictPoint(result.dayBranchRelation);
  const secretMindTeaser = getSecretMindTeaser(result);

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
        <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">궁합 요약 6축</p>
        <div className="grid grid-cols-2 gap-2.5">
          {axisList.map((axis) => (
            <div key={axis.label} className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">{axis.label}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${TIER_COLOR[axis.tier]}26`, color: TIER_COLOR[axis.tier] }}
                >
                  {axis.tierLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          점수(%)로 환산할 근거가 없는 항목이라 숫자 대신 세 단계 정성 평가로 보여드려요. 아래에서 각 항목의 자세한 이유를 확인할 수 있어요.
        </p>
      </div>

      <SecretMindCard partnerLabel={displayB} teaser={secretMindTeaser} />

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
            {withSubjectParticle(displayA)} {displayB}에게 통하는 기운
          </p>
          <p className="text-base leading-relaxed">{result.textAtoB}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
            {withSubjectParticle(displayB)} {displayA}에게 통하는 기운
          </p>
          <p className="text-base leading-relaxed">{result.textBtoA}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">일간 오행으로 보는 궁합</p>
          <p className="text-base leading-relaxed">{result.elementRelation}</p>
        </div>

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

        {conflictPoint && (
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
              💡 관계에서 함께 신경 쓰면 좋은 점 — {conflictPoint.title}
            </p>
            <p className="text-base leading-relaxed">{conflictPoint.desc}</p>
          </div>
        )}

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">대화 궁합</p>
          <p className="text-base leading-relaxed">{axes.communication.desc}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">생활 궁합</p>
          <p className="text-base leading-relaxed">{axes.daily.desc}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">금전 궁합</p>
          <p className="text-base leading-relaxed">{axes.money.desc}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">결혼 궁합</p>
          <p className="text-base leading-relaxed">{axes.marriage.desc}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5 text-sm leading-relaxed text-white/70">
          궁합은 두 사람의 원국을 각각 정확히 계산한 뒤, 일간 사이의 십신 관계(양방향)와 오행 생극 관계,
          일지(배우자궁)의 합충 관계까지 종합해 판단한 결과예요. 한쪽 사주만으로 상대를 추정하지 않고, 실제로
          계산된 두 사람의 값을 그대로 비교했어요.
        </div>

        <AdSlot />
      </div>

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
