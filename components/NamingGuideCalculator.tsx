"use client";

import { useState } from "react";
import BirthInfoForm from "@/components/BirthInfoForm";
import { DEFAULT_BIRTH_FORM, type BirthFormState } from "@/lib/session";
import { computeSaju, type BirthInput } from "@/lib/calc";
import { computeNamingGuide, type NamingGuideResult } from "@/lib/interpretation/naming-guide";

function toBirthInput(form: BirthFormState): BirthInput {
  const [year, month, day] = form.birthDate.split("-").map(Number);
  return {
    name: form.name,
    year,
    month,
    day,
    hour: form.timeUnknown ? null : form.hour,
    minute: form.timeUnknown ? 0 : form.minute,
    gender: form.gender,
    calendarType: form.calendarType,
    isLeapMonth: form.calendarType === "lunar" ? form.isLeapMonth : false,
  };
}

export default function NamingGuideCalculator() {
  const [form, setForm] = useState<BirthFormState>(DEFAULT_BIRTH_FORM);
  const [result, setResult] = useState<NamingGuideResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(submitted: BirthFormState) {
    try {
      const saju = computeSaju(toBirthInput(submitted));
      setForm(submitted);
      setResult(computeNamingGuide(saju, submitted.gender));
      setError(null);
    } catch {
      setResult(null);
      setError("입력하신 생년월일시로 계산할 수 없어요. 날짜를 다시 확인해주세요.");
    }
  }

  if (!result) {
    return (
      <div className="flex flex-col gap-3">
        <BirthInfoForm
          introText="아기의 생년월일시를 입력하면 사주에 부족한 기운을 보완하는 이름 방향을 알려드려요."
          initial={form}
          onSubmit={handleSubmit}
          onBack={() => setForm(DEFAULT_BIRTH_FORM)}
        />
        {error && <p className="text-center text-xs text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {result.recommendations.map((rec) => (
        <div
          key={rec.element}
          className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-5"
        >
          <p className="text-xs text-white/50">보완하면 좋은 기운</p>
          <p className="mt-1 text-2xl font-black" style={{ color: "#e8cd94" }}>
            {rec.label}
          </p>
          <p className="mt-2 text-sm text-white/70">
            이름 첫 글자를 <span className="font-bold text-white/90">{rec.chosung.join(", ")}</span> 초성으로
            시작하면 {rec.label} 기운을 더할 수 있어요.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {rec.exampleNames.map((name) => (
              <span key={name} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => setResult(null)}
        className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:bg-white/5"
      >
        다른 정보로 다시 확인하기
      </button>
    </div>
  );
}
