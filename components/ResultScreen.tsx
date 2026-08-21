"use client";

import AdGate from "./AdGate";
import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import LifeGradeCard from "./LifeGradeCard";
import PastLifeCard from "./PastLifeCard";
import SajuChart from "./SajuChart";
import type { Category, ToneStyleId } from "@/lib/session";
import type { SajuResult } from "@/lib/calc/types";
import {
  CATEGORY_LABEL,
  getToneStyleMeta,
  type DaeunFlowDisplay,
  type DailyFortune,
  type Gyeokguk,
  type JohuAnalysis,
  type LifeStageGrade,
  type LuckColorDisplay,
  type MonthRhythmDisplay,
  type PastLife,
  type SinsalDisplay,
  type StarSign,
  type ZodiacAnimal,
} from "@/lib/interpretation";

interface Props {
  name: string;
  category: Category;
  toneStyle: ToneStyleId;
  saju: SajuResult;
  sections: { heading: string; text: string }[];
  monthRhythm: MonthRhythmDisplay[];
  daeunFlow: DaeunFlowDisplay[];
  luckColor: LuckColorDisplay;
  starSign: StarSign;
  zodiacAnimal: ZodiacAnimal;
  gyeokguk: Gyeokguk;
  sinsal: SinsalDisplay[];
  dailyFortune: DailyFortune;
  pastLife: PastLife;
  lifeGrades: LifeStageGrade[];
  johu: JohuAnalysis;
  isHourExcluded: boolean;
  adUnlocked: boolean;
  onAdUnlocked: () => void;
  onOtherFortune: () => void;
  onUnlock: () => void;
}

const CURRENT_MONTH = new Date().getMonth() + 1;

/** S5. 결과 화면 (화면 흐름 설계서 06번) — 해석 텍스트 + 실제 계산된 원국을 함께 보여준다. */
export default function ResultScreen({
  name,
  category,
  toneStyle,
  saju,
  sections,
  monthRhythm,
  daeunFlow,
  luckColor,
  starSign,
  zodiacAnimal,
  gyeokguk,
  sinsal,
  dailyFortune,
  pastLife,
  lifeGrades,
  johu,
  isHourExcluded,
  adUnlocked,
  onAdUnlocked,
  onOtherFortune,
  onUnlock,
}: Props) {
  const displayName = name.trim() || "당신";
  const [freeSection, ...gatedSections] = sections;
  const styleMeta = getToneStyleMeta(toneStyle);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        {toneStyle !== "standard" && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-[color:var(--color-gold)]/30 bg-white/5 px-3 py-1 text-[11px] font-medium text-[color:var(--color-gold-light)]">
            {styleMeta.emoji} {styleMeta.label} 말투로 보는 중
          </span>
        )}
        <h1 className="text-2xl font-bold">
          {displayName}님의 {CATEGORY_LABEL[category]}
        </h1>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
          <span className="text-xl">{starSign.symbol}</span>
          <span className="text-sm font-medium">{starSign.name}</span>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
          <span className="text-xl">🐾</span>
          <span className="text-sm font-medium">{zodiacAnimal.animal}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-[color:var(--color-gold-light)]">오늘의 운세 · {dailyFortune.dateLabel}</p>
          <p className="text-xl font-bold">{dailyFortune.score}점</p>
        </div>
        <p className="text-base font-semibold">
          {dailyFortune.label} · {dailyFortune.oneliner}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <span className="text-white/50">인연 </span>
            {dailyFortune.loveTag}
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <span className="text-white/50">재물 </span>
            {dailyFortune.moneyTag}
          </div>
        </div>
      </div>

      <SajuChart saju={saju} gyeokguk={gyeokguk} />

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">{freeSection.heading}</p>
        <p className="text-base leading-relaxed">{freeSection.text}</p>
      </div>

      <AdGate unlocked={adUnlocked} onUnlocked={onAdUnlocked}>
        <div className="flex flex-col gap-4">
          {gatedSections.map((s) => (
            <div key={s.heading} className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">{s.heading}</p>
              <p className="text-base leading-relaxed">{s.text}</p>
            </div>
          ))}

          {sinsal.length > 0 && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">나에게 깃든 별(신살)</p>
              <div className="flex flex-col gap-3">
                {sinsal.map((s) => (
                  <div key={s.name} className="rounded-lg bg-white/5 p-3">
                    <p className="text-sm font-bold">
                      {s.name} <span className="font-normal text-white/40">({s.hanja})</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/80">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {monthRhythm.length > 0 && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">
                올해 월별 {CATEGORY_LABEL[category]} 리듬
              </p>
              <div className="grid grid-cols-3 gap-2">
                {monthRhythm.map((r) => (
                  <div
                    key={r.month}
                    className={`rounded-lg px-2 py-2 text-center ${
                      r.month === CURRENT_MONTH ? "bg-[color:var(--color-gold)] text-[#241a08]" : "bg-white/5"
                    }`}
                  >
                    <p className="text-[11px] opacity-70">{r.month}월</p>
                    <p className="text-sm font-bold">{r.label}</p>
                    <p className="mt-0.5 text-[10px] leading-tight opacity-80">{r.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {daeunFlow.length > 0 && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">평생 대운 흐름</p>
              <div className="flex flex-col gap-2">
                {daeunFlow.map((d) => (
                  <div
                    key={d.index}
                    className={`rounded-lg p-3 ${d.isCurrent ? "bg-[color:var(--color-gold)]/20 ring-1 ring-[color:var(--color-gold)]" : "bg-white/5"}`}
                  >
                    <p className="text-xs font-semibold text-white/60">
                      {d.ageLabel} · {d.pillarHanja}
                      {d.isCurrent && <span className="ml-1 text-[color:var(--color-gold-light)]">(지금)</span>}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
              조후(調候) · {johu.seasonLabel}에 태어난 사주
            </p>
            <p className="text-sm leading-relaxed text-white/80">{johu.text}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">행운의 컬러 &amp; 숫자</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-lg font-bold">{luckColor.color}</p>
                <p className="text-sm text-white/60">{luckColor.numbers.join(", ")}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-white/80">
                지금 원국에 가장 적은 오행을 보완해주는 색과 숫자예요. {luckColor.desc}.
              </p>
            </div>
          </div>

          <LifeGradeCard stages={lifeGrades} />

          <PastLifeCard pastLife={pastLife} />
        </div>
      </AdGate>

      {isHourExcluded && (
        <p className="text-center text-xs text-white/50">
          출생시간을 몰라 시주는 제외하고 계산했어요
        </p>
      )}

      {/* 화면별 광고 배치 원칙 09번: 결과 화면에 디스플레이 광고 1개 (결과 텍스트를 가리지 않는 위치) */}
      <AdSlot label="결과 화면 디스플레이 광고" />
      <FreeAdsNotice />

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={onOtherFortune}
          className="w-full rounded-full bg-[color:var(--color-gold)] px-8 py-4 text-base font-semibold text-[#241a08] transition hover:brightness-110 active:scale-95"
        >
          다른 운세도 보기
        </button>
        <div className="flex gap-3">
          <button
            onClick={onUnlock}
            className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20 active:scale-95"
          >
            PDF로 저장
          </button>
          <button
            onClick={onUnlock}
            className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20 active:scale-95"
          >
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
