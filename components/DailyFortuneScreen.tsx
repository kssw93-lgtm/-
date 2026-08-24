"use client";

import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import { computeDailyFortune, computeLuckColor, getStarSignForSaju, getZodiacAnimalForSaju } from "@/lib/interpretation";
import type { SajuResult } from "@/lib/calc/types";

interface Props {
  displayName: string;
  saju: SajuResult;
  onSeeFullResult: () => void;
  onResetPerson: () => void;
}

/**
 * 저장된 생년월일 정보로 "오늘의 운세"만 빠르게 보여주는 화면. 전체 사주 흐름
 * (말투 선택 → 카테고리 선택 → 생년월일 입력 → 광고 → 계산중 → 결과)을 전부
 * 건너뛰고, 이미 저장된 사람 정보로 오늘 날짜 기준 운세만 바로 계산해서 보여준다.
 * "다시 찾아올 이유"를 만들기 위한 진입점 — 매번 처음부터 다시 입력해야 하면
 * 매일 확인할 이유가 없다는 피드백을 반영했다.
 */
export default function DailyFortuneScreen({ displayName, saju, onSeeFullResult, onResetPerson }: Props) {
  const dailyFortune = computeDailyFortune(saju);
  const starSign = getStarSignForSaju(saju);
  const zodiacAnimal = getZodiacAnimalForSaju(saju);
  const luckColor = computeLuckColor(saju);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{displayName}님의 오늘의 운세</h1>
        <p className="mt-1 text-xs text-white/50">{dailyFortune.dateLabel}</p>
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

      <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-6 text-center">
        <p className="text-5xl font-black" style={{ color: "#e8cd94" }}>
          {dailyFortune.score}
          <span className="text-2xl">점</span>
        </p>
        <p className="mt-2 text-lg font-bold">{dailyFortune.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-white/80">{dailyFortune.oneliner}</p>
        <p className="mt-3 text-xs text-white/40">일진(日辰) {dailyFortune.dayPillarHanja}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/50">💕 인연</p>
          <p className="mt-1 text-sm font-semibold">{dailyFortune.loveTag}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/50">💰 재물</p>
          <p className="mt-1 text-sm font-semibold">{dailyFortune.moneyTag}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">오늘의 행운 컬러 &amp; 숫자</p>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-lg font-bold">{luckColor.color}</p>
            <p className="text-sm text-white/60">{luckColor.numbers.join(", ")}</p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-white/80">{luckColor.desc}.</p>
        </div>
      </div>

      <AdSlot label="오늘의 운세 화면 디스플레이 광고" />
      <FreeAdsNotice />

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={onSeeFullResult}
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-base font-semibold text-[#241a08] transition hover:brightness-110 active:scale-95"
        >
          연애운·직업운 등 자세히 보기
        </button>
        <button
          onClick={() => {
            if (confirm("입력한 생년월일 정보를 지우고 다른 사람 정보로 새로 볼까요?")) onResetPerson();
          }}
          className="text-center text-xs text-white/40 underline-offset-4 transition hover:text-white/70 hover:underline"
        >
          🔄 다른 사람 정보로 보기
        </button>
      </div>
    </div>
  );
}
