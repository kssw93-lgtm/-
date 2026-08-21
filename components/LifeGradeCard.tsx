"use client";

import { useState } from "react";
import type { LifeStageGrade } from "@/lib/interpretation/life-grade";

const GRADE_COLOR: Record<string, string> = {
  SS: "#e879f9",
  S: "#c9a35c",
  "A+": "#e8cd94",
  A: "#4ade80",
  B: "#60a5fa",
  C: "#a8a29e",
  D: "#94a3b8",
};

/** 재미 콘텐츠: 대운별 인생 등급을 탭으로 넘겨보는 카드. */
export default function LifeGradeCard({ stages }: { stages: LifeStageGrade[] }) {
  const currentIndex = stages.findIndex((s) => s.isCurrent);
  const [selected, setSelected] = useState(currentIndex >= 0 ? currentIndex : 0);
  const stage = stages[selected];
  if (!stage) return null;

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/25 bg-gradient-to-b from-white/[0.06] to-transparent p-5">
      <p className="mb-3 text-xs font-semibold text-[color:var(--color-gold-light)]">너의 인생 등급 (대운별)</p>

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
            {s.ageLabel}
            {s.isCurrent && " ·지금"}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs text-white/40">
          {stage.ageLabel} · {stage.pillarHanja} 대운
        </p>
        <p className="text-5xl font-black" style={{ color: GRADE_COLOR[stage.overallGrade] }}>
          {stage.overallGrade}
        </p>
        <p className="text-lg font-bold">{stage.title}</p>
        <p className="text-xs text-white/50">{stage.titleDesc}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {stage.axes.map((a) => (
          <div key={a.label} className="rounded-xl bg-white/5 py-3 text-center">
            <p className="text-[10px] text-white/40">{a.label}</p>
            <p className="text-base font-bold" style={{ color: GRADE_COLOR[a.grade] }}>
              {a.grade}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-white/30">
        일간·십신·대운 계산값에 근거해 만들었지만, 정밀 상담을 대신하진 않아요. 가볍게 재미로 즐겨주세요 :)
      </p>
    </div>
  );
}
