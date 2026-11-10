"use client";

import { useState } from "react";
import type { LifeStageGrade } from "@/lib/interpretation/life-grade";
import { localizeEnglishText } from "@/lib/i18n/english-content";
import { useSiteLocale } from "@/lib/i18n/site-locale";
import { t } from "@/lib/i18n/messages";

export const GRADE_COLOR: Record<string, string> = {
  SS: "#e879f9",
  S: "#c9a35c",
  "A+": "#e8cd94",
  A: "#4ade80",
  B: "#60a5fa",
  C: "#a8a29e",
  D: "#94a3b8",
};

const STEM_HANJA_EN: Record<string, string> = { 甲: "Jia", 乙: "Yi", 丙: "Bing", 丁: "Ding", 戊: "Wu", 己: "Ji", 庚: "Geng", 辛: "Xin", 壬: "Ren", 癸: "Gui" };
const BRANCH_HANJA_EN: Record<string, string> = { 子: "Rat", 丑: "Ox", 寅: "Tiger", 卯: "Rabbit", 辰: "Dragon", 巳: "Snake", 午: "Horse", 未: "Goat", 申: "Monkey", 酉: "Rooster", 戌: "Dog", 亥: "Pig" };

function formatPillar(value: string, isEnglish: boolean): string {
  if (!isEnglish) return value;
  const characters = [...value];
  if (characters.length !== 2) return value;
  const stem = STEM_HANJA_EN[characters[0]];
  const branch = BRANCH_HANJA_EN[characters[1]];
  return stem && branch ? `${stem} · ${branch}` : value;
}

/** 재미 콘텐츠: 대운별 인생 등급을 탭으로 넘겨보는 카드. */
export default function LifeGradeCard({ stages }: { stages: LifeStageGrade[] }) {
  const locale = useSiteLocale();
  const isEnglish = locale === "en";
  const currentIndex = stages.findIndex((s) => s.isCurrent);
  const [selected, setSelected] = useState(currentIndex >= 0 ? currentIndex : 0);
  const stage = stages[selected];
  if (!stage) return null;

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/25 bg-gradient-to-b from-white/[0.06] to-transparent p-5">
      <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">{isEnglish ? "Life ratings by major luck cycle" : "너의 인생 등급 (대운별)"}</p>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {stages.map((s, i) => (
          <button
            key={s.index}
            onClick={() => setSelected(i)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              i === selected
                ? "bg-[color:var(--color-gold)] text-[#241a08]"
                : "bg-white/10 text-white/60 hover:bg-white/15"
            }`}
          >
            {isEnglish ? localizeEnglishText(s.ageLabel) : s.ageLabel}
            {s.isCurrent && (isEnglish ? " · Current" : " ·지금")}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs text-white/40">
          {isEnglish ? `${localizeEnglishText(stage.ageLabel)} · ${formatPillar(stage.pillarHanja, true)} ${t(locale, "대운")}` : `${stage.ageLabel} · ${stage.pillarHanja} 대운`}
        </p>
        <p className="text-5xl font-black" style={{ color: GRADE_COLOR[stage.overallGrade] }}>
          {stage.overallGrade}
        </p>
        <p className="text-lg font-bold">{isEnglish ? localizeEnglishText(stage.title) : stage.title}</p>
        <p className="text-xs text-white/50">{isEnglish ? localizeEnglishText(stage.titleDesc) : stage.titleDesc}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {stage.axes.map((a) => (
          <div key={a.label} className="rounded-xl bg-white/5 py-3 text-center">
            <p className="text-[10px] text-white/40">{isEnglish ? localizeEnglishText(a.label) : a.label}</p>
            <p className="text-base font-bold" style={{ color: GRADE_COLOR[a.grade] }}>
              {a.grade}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-white/30">
        {isEnglish ? "Based on calculated Day Master, Ten Gods, and major luck cycle values. This is for entertainment and is not a substitute for professional consultation." : "일간·십신·대운 계산값에 근거해 만들었지만, 정밀 상담을 대신하진 않아요. 가볍게 재미로 즐겨주세요 :)"}
      </p>
    </div>
  );
}
