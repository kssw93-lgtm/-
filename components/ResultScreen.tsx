"use client";

import AdSlot from "./AdSlot";
import FreeAdsNotice from "./FreeAdsNotice";
import LifeGradeCard, { GRADE_COLOR } from "./LifeGradeCard";
import PastLifeCard from "./PastLifeCard";
import TalismanCard from "./TalismanCard";
import SajuChart from "./SajuChart";
import type { Category, ToneStyleId } from "@/lib/session";
import type { SajuResult } from "@/lib/calc/types";
import {
  CATEGORY_LABEL,
  getToneStyleMeta,
  type DaeunFlowDisplay,
  type DailyFortune,
  type Gyeokguk,
  type CoreSummary,
  type IncomeSource,
  type JohuAnalysis,
  type LifeStageDisplay,
  type LifeStageGrade,
  type LuckColorDisplay,
  type MeetingChannel,
  type MeetingTiming,
  type MonthRhythmDisplay,
  type PastLife,
  type WorkStyle,
  type GyeokgukCareerFit,
  type GyeokgukWealthStyle,
  type SinsalDisplay,
  type StarSign,
  type WealthMonthRanking,
  type GwiinDaeun,
  type ZodiacAnimal,
  type ZodiacCompat,
  type ZodiacCareerFit,
} from "@/lib/interpretation";

interface Props {
  name: string;
  category: Category;
  toneStyle: ToneStyleId;
  saju: SajuResult;
  sections: { heading: string; text: string }[];
  monthRhythm: MonthRhythmDisplay[];
  daeunFlow: DaeunFlowDisplay[];
  luckColor: LuckColorDisplay | null;
  starSign: StarSign;
  zodiacAnimal: ZodiacAnimal;
  gyeokguk: Gyeokguk;
  sinsal: SinsalDisplay[];
  dailyFortune: DailyFortune;
  pastLife: PastLife | null;
  lifeGrades: LifeStageGrade[];
  johu: JohuAnalysis | null;
  lifeStages: LifeStageDisplay[];
  meetingTiming: MeetingTiming | null;
  meetingChannel: MeetingChannel | null;
  workStyle: WorkStyle | null;
  gyeokgukCareerFit: GyeokgukCareerFit | null;
  gyeokgukWealthStyle: GyeokgukWealthStyle | null;
  coreSummary: CoreSummary;
  incomeSource: IncomeSource | null;
  wealthMonthRanking: WealthMonthRanking | null;
  gwiinDaeun: GwiinDaeun[];
  zodiacCompat: ZodiacCompat | null;
  zodiacCareer: ZodiacCareerFit | null;
  datingAdvice: string | null;
  resultText: string;
  isHourExcluded: boolean;
  onOtherFortune: () => void;
  onResetPerson: () => void;
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
  lifeStages,
  meetingTiming,
  meetingChannel,
  workStyle,
  gyeokgukCareerFit,
  gyeokgukWealthStyle,
  coreSummary,
  incomeSource,
  wealthMonthRanking,
  gwiinDaeun,
  zodiacCompat,
  zodiacCareer,
  datingAdvice,
  resultText,
  isHourExcluded,
  onOtherFortune,
  onResetPerson,
}: Props) {
  const displayName = name.trim() || "당신";
  const [freeSection, ...gatedSections] = sections;
  const styleMeta = getToneStyleMeta(toneStyle);
  const currentGrade = lifeGrades.find((g) => g.isCurrent) ?? lifeGrades[0] ?? null;

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "천기누설", text: resultText });
        return;
      } catch {
        // 사용자가 공유를 취소한 경우 등 — 아래 복사 폴백으로 진행
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(resultText);
      alert("결과 텍스트를 클립보드에 복사했어요.");
    }
  }

  return (
    <div className="print-area flex flex-1 flex-col gap-6 px-6 py-8">
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

      {currentGrade && (
        <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5 text-center">
          <p className="text-4xl font-black" style={{ color: GRADE_COLOR[currentGrade.overallGrade] }}>
            {currentGrade.overallGrade}
          </p>
          <p className="text-lg font-bold">{currentGrade.title}</p>
          <p className="text-xs text-white/50">{currentGrade.titleDesc}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {currentGrade.axes.map((a) => (
              <div key={a.label} className="rounded-xl bg-white/5 py-2 text-center">
                <p className="text-[10px] text-white/40">{a.label}</p>
                <p className="text-sm font-bold" style={{ color: GRADE_COLOR[a.grade] }}>
                  {a.grade}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white/10 p-5">
        <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">사주 핵심 요약</p>
        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="text-white/50">🔥 강점 </span>
            {coreSummary.strengths.join(" · ")}
          </p>
          <p>
            <span className="text-white/50">⚠️ 주의 </span>
            {coreSummary.cautions.join(" · ")}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {coreSummary.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full bg-[color:var(--color-gold)]/15 px-2.5 py-1 text-xs text-[color:var(--color-gold-light)]"
              >
                #{k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <AdSlot label="결과 화면 상단 디스플레이 광고" />

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

      <div className="flex flex-col gap-4">
          {datingAdvice && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">지금 관계에서 눈여겨볼 점</p>
              <p className="text-base leading-relaxed">{datingAdvice}</p>
            </div>
          )}

          {workStyle && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">나의 업무 스타일</p>
              <p className="text-base font-bold">{workStyle.style}</p>
              <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                <p>
                  <span className="text-white/50">🟢 잘 맞는 환경 </span>
                  <span className="text-white/80">{workStyle.goodEnv}</span>
                </p>
                <p>
                  <span className="text-white/50">🔴 피하면 좋은 환경 </span>
                  <span className="text-white/80">{workStyle.badEnv}</span>
                </p>
              </div>
            </div>
          )}

          {gyeokgukCareerFit && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">격국으로 보는 직업 적성</p>
              <p className="text-base font-bold">{gyeokgukCareerFit.fitField}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{gyeokgukCareerFit.desc}</p>
            </div>
          )}

          {zodiacCareer && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">띠·별자리로 보는 직업 적성</p>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">
                    🐾 {zodiacAnimal.animal} · {zodiacCareer.animal.fields}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCareer.animal.desc}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">
                    {starSign.symbol} {starSign.name} · {zodiacCareer.star.fields}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCareer.star.desc}</p>
                </div>
              </div>
            </div>
          )}

          {incomeSource && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">나에게 유리한 수입 구조</p>
              <div className="flex flex-col gap-1.5 text-sm">
                {incomeSource.sources.map((s, i) => (
                  <p key={s}>
                    {i + 1}. {s}
                  </p>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/80">
                <p>
                  <span className="text-white/50">💰 들어오는 흐름 </span>
                  {incomeSource.flowIn}
                </p>
                <p>
                  <span className="text-white/50">💸 새기 쉬운 지점 </span>
                  {incomeSource.flowOut}
                </p>
              </div>
            </div>
          )}

          {gyeokgukWealthStyle && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">격국으로 보는 재물 스타일</p>
              <p className="text-base font-bold">{gyeokgukWealthStyle.style}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{gyeokgukWealthStyle.desc}</p>
            </div>
          )}

          {wealthMonthRanking && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">올해 재물 유리한 달 · 조심할 달</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-2 text-xs text-white/50">🟢 유리한 달 TOP3</p>
                  <div className="flex flex-col gap-2">
                    {wealthMonthRanking.topMonths.map((m) => (
                      <div key={m.month} className="rounded-lg bg-white/5 p-2.5">
                        <p className="text-sm font-bold">{m.month}월 · {m.tag}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/70">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-white/50">🔴 조심할 달 TOP3</p>
                  <div className="flex flex-col gap-2">
                    {wealthMonthRanking.cautionMonths.map((m) => (
                      <div key={m.month} className="rounded-lg bg-white/5 p-2.5">
                        <p className="text-sm font-bold">{m.month}월 · {m.tag}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/70">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {gatedSections.map((s) => (
            <div key={s.heading} className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">{s.heading}</p>
              <p className="text-base leading-relaxed">{s.text}</p>
            </div>
          ))}

          {meetingChannel && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
                {category === "reunion" ? "다시 연결되기 쉬운 방식" : "인연이 들어오는 경로"}
              </p>
              <p className="text-base font-bold">{meetingChannel.type}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">{meetingChannel.desc}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm">
                <span className="text-white/50">🤍 잘 맞는 상대 </span>
                {meetingChannel.matchType}
              </p>
            </div>
          )}

          {meetingTiming && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">
                {category === "reunion" ? "연락하기 좋은 날·다시 만나기 좋은 환경" : "인연을 만나기 좋은 날·장소"}
              </p>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">
                    {category === "reunion" ? "📱" : "📅"} {meetingTiming.dayOfWeek}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">{meetingTiming.dayReason}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">
                    {category === "reunion" ? "🤝" : "📍"} {meetingTiming.place}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">{meetingTiming.placeReason}</p>
                </div>
              </div>
            </div>
          )}

          {zodiacCompat && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">🐾 띠 궁합</p>
              <div className="flex flex-col gap-2">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">💛 찰떡궁합 {zodiacCompat.animalBest.labels.join(", ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.animalBest.desc}</p>
                </div>
                {zodiacCompat.animalGood.labels.length > 0 && (
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-sm font-bold">🟢 잘 맞는 편 {zodiacCompat.animalGood.labels.join(", ")}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.animalGood.desc}</p>
                  </div>
                )}
                {zodiacCompat.animalEffort.labels.length > 0 && (
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-sm font-bold">🔴 노력이 필요한 편 {zodiacCompat.animalEffort.labels.join(", ")}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.animalEffort.desc}</p>
                  </div>
                )}
              </div>

              <p className="mb-3 mt-5 text-xs font-semibold text-[color:var(--color-gold-light)]">{starSign.symbol} 별자리 궁합</p>
              <div className="flex flex-col gap-2">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">💛 찰떡궁합 {zodiacCompat.starBest.labels.join(", ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.starBest.desc}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">🟢 잘 맞는 편 {zodiacCompat.starGood.labels.join(", ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.starGood.desc}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-sm font-bold">🔴 노력이 필요한 편 {zodiacCompat.starChallenging.labels.join(", ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{zodiacCompat.starChallenging.desc}</p>
                </div>
              </div>
            </div>
          )}

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

          {lifeStages.length > 0 && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">인생의 큰 흐름 (초년·중년·말년)</p>
              <div className="flex flex-col gap-2">
                {lifeStages.map((s) => (
                  <div key={s.stage} className="rounded-lg bg-white/5 p-3">
                    <p className="text-xs font-semibold text-white/60">
                      {s.label} · {s.pillarHanja}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{s.text}</p>
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

          {gwiinDaeun.length > 0 && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">✨ 귀인이 드는 대운 시기</p>
              <p className="text-sm leading-relaxed text-white/80">
                평생 대운 중 천을귀인 기운이 드는 시기예요. 어려운 순간에 뜻밖의 도움을 받기 쉬운 시기라고 봐요.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {gwiinDaeun.map((g) => (
                  <span key={g.ageLabel} className="rounded-full bg-[color:var(--color-gold)]/20 px-3 py-1.5 text-sm font-semibold text-[color:var(--color-gold-light)]">
                    {g.ageLabel} · {g.pillarHanja}
                  </span>
                ))}
              </div>
            </div>
          )}

          {johu && (
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
                조후(調候) · {johu.seasonLabel}에 태어난 사주
              </p>
              <p className="text-sm leading-relaxed text-white/80">{johu.text}</p>
            </div>
          )}

          {luckColor && (
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
          )}

          {lifeGrades.length > 0 && <LifeGradeCard stages={lifeGrades} />}

          {pastLife && <PastLifeCard pastLife={pastLife} />}

          <TalismanCard displayName={displayName} luckColor={luckColor} coreSummary={coreSummary} gyeokguk={gyeokguk} />
        </div>

      {isHourExcluded && (
        <p className="text-center text-xs text-white/50">
          출생시간을 몰라 시주는 제외하고 계산했어요
        </p>
      )}

      {/* 화면별 광고 배치 원칙 09번: 결과 화면에 디스플레이 광고 1개 (결과 텍스트를 가리지 않는 위치) */}
      <AdSlot label="결과 화면 하단 디스플레이 광고" />
      <FreeAdsNotice />

      <div className="no-print mt-auto flex flex-col gap-3">
        <button
          onClick={onOtherFortune}
          className="w-full rounded-full bg-[color:var(--color-gold)] px-8 py-4 text-base font-semibold text-[#241a08] transition hover:brightness-110 active:scale-95"
        >
          다른 운세도 보기
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20 active:scale-95"
          >
            PDF로 저장
          </button>
          <button
            onClick={handleShare}
            className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20 active:scale-95"
          >
            공유하기
          </button>
        </div>
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
