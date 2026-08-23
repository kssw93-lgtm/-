"use client";

import { branchById, stemById } from "@/lib/calc/data";
import { computeStrengthScore, strengthBand, type Gyeokguk } from "@/lib/interpretation";
import twelveStageMeaningJson from "@/data/twelve-stage-meaning.json";
import type { ElementId, SajuResult, TwelveStageId } from "@/lib/calc/types";

const STAGE_META = twelveStageMeaningJson as Record<TwelveStageId, { name: string; hanja: string; desc: string }>;
const PILLAR_TO_STAGE_KEY = {
  yearPillar: "year",
  monthPillar: "month",
  dayPillar: "day",
  hourPillar: "hour",
} as const;

const PILLAR_LABEL = { yearPillar: "년주", monthPillar: "월주", dayPillar: "일주", hourPillar: "시주" } as const;
const ELEMENT_LABEL: Record<ElementId, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const ELEMENT_COLOR: Record<ElementId, string> = {
  wood: "#4ade80",
  fire: "#f87171",
  earth: "#d6a75c",
  metal: "#e5e7eb",
  water: "#60a5fa",
};
const BRANCH_LABEL: Record<string, string> = {
  zi: "자", chou: "축", yin: "인", mao: "묘", chen: "진", si: "사",
  wu: "오", wei: "미", shen: "신", you: "유", xu: "술", hai: "해",
};

function elementCounts(saju: SajuResult): Record<ElementId, number> {
  const counts: Record<ElementId, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const e of [...saju.elements.stemElements, ...saju.elements.branchElements]) {
    counts[e] += 1;
  }
  return counts;
}

/** 실제 계산된 사주 원국을 그대로 보여주는 카드. 해석 텍스트와 달리 전부 결정론적 계산값이다. */
export default function SajuChart({ saju, gyeokguk }: { saju: SajuResult; gyeokguk: Gyeokguk }) {
  const counts = elementCounts(saju);
  const maxCount = Math.max(1, ...Object.values(counts));
  const strength = computeStrengthScore(saju);
  const band = strengthBand(strength.total);

  const pillarKeys = (["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const).filter(
    (k) => saju.pillars[k] !== null
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white/5 p-5">
      <div>
        <p className="mb-2 text-xs font-medium text-white/50">내 사주 원국</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {(["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const).map((key) => {
            const pillar = saju.pillars[key];
            return (
              <div key={key} className="rounded-xl bg-white/5 py-3">
                <p className="text-[11px] text-white/40">{PILLAR_LABEL[key]}</p>
                {pillar ? (
                  <>
                    <p
                      className="text-xl font-bold"
                      style={{ color: ELEMENT_COLOR[stemById(pillar.stem).element] }}
                    >
                      {stemById(pillar.stem).hanja}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: ELEMENT_COLOR[branchById(pillar.branch).element] }}
                    >
                      {branchById(pillar.branch).hanja}
                    </p>
                  </>
                ) : (
                  <p className="py-2 text-xs text-white/30">모름</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-white/30">십이운성 (일간이 각 자리에서 갖는 기운의 세기)</p>
        <div className="mt-1 grid grid-cols-4 gap-2 text-center">
          {(["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const).map((key) => {
            const stageKey = PILLAR_TO_STAGE_KEY[key];
            const entry = saju.twelveStages.find((s) => s.pillar === stageKey);
            const meta = entry ? STAGE_META[entry.stageId] : null;
            return (
              <p key={key} className="text-[11px] text-white/50" title={meta?.desc}>
                {meta ? `${meta.name}(${meta.hanja})` : "-"}
              </p>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-white/50">오행 분포 ({pillarKeys.length * 2}글자 기준)</p>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(counts) as ElementId[]).map((el) => (
            <div key={el} className="flex items-center gap-2">
              <span className="w-4 text-xs text-white/60">{ELEMENT_LABEL[el]}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(counts[el] / maxCount) * 100}%`,
                    backgroundColor: ELEMENT_COLOR[el],
                  }}
                />
              </div>
              <span className="w-3 text-right text-xs text-white/60">{counts[el]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white/5 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-white/50">일간 강약</p>
          <p className="text-xs text-white/40">
            득령 {strength.deukryeong} · 득지 {strength.deukji} · 득세 {strength.deukse} = {strength.total}/98
          </p>
        </div>
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-rose-400">
          <div
            className="absolute -top-1 h-4 w-1 rounded-full bg-white shadow"
            style={{ left: `calc(${band.percent}% - 2px)` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/40">
          <span>태약</span>
          <span>신약</span>
          <span>중화</span>
          <span>신강</span>
          <span>태강</span>
        </div>
        <p className="mt-1 text-center text-base font-bold">{band.label}</p>
      </div>

      <div className="rounded-xl bg-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">격국</p>
          <p className="text-lg font-bold text-[color:var(--color-gold-light)]">{gyeokguk.name}</p>
        </div>
        <p className="mt-1 text-sm text-white/70">&ldquo;{gyeokguk.subtitle}&rdquo;</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
        <span className="text-white/50">공망</span>
        <span className="font-medium">
          {saju.voidBranches.map((b) => BRANCH_LABEL[b]).join("")}({saju.voidBranches.map((b) => branchById(b).hanja).join("")})
        </span>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-white/50">
          대운 ({saju.luckDirection === "forward" ? "순행" : "역행"})
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {saju.majorLuck.slice(0, 6).map((lp) => {
            const isCurrent = Date.now() >= Date.parse(lp.startDate) && Date.now() < Date.parse(lp.endDate);
            return (
              <div
                key={lp.index}
                className={`flex min-w-[64px] flex-col items-center rounded-lg px-2 py-2 ${
                  isCurrent ? "bg-[color:var(--color-gold)] text-[#241a08]" : "bg-white/5"
                }`}
              >
                <span className="text-[10px] opacity-70">{lp.startAgeDisplay}세~</span>
                <span className="text-base font-bold">{stemById(lp.pillar.stem).hanja}{branchById(lp.pillar.branch).hanja}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
