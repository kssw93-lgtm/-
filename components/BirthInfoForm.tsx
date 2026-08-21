"use client";

import { useState } from "react";
import AdSlot from "./AdSlot";
import { DEFAULT_BIRTH_FORM, type BirthFormState } from "@/lib/session";
import { SUPPORTED_BIRTH_YEAR_RANGE } from "@/lib/calc";

interface Props {
  introText: string;
  initial: BirthFormState;
  onSubmit: (form: BirthFormState) => void;
  onBack: () => void;
}

/** S3. 정보 입력 화면 (화면 흐름 설계서 04번) */
export default function BirthInfoForm({ introText, initial, onSubmit, onBack }: Props) {
  const [form, setForm] = useState<BirthFormState>(initial);

  const isValid = form.birthDate.trim().length > 0 && !!form.calendarType && !!form.gender;

  function update<K extends keyof BirthFormState>(key: K, value: BirthFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-6 py-8">
      <button onClick={onBack} className="self-start text-sm text-white/40 hover:text-white/70">
        ← 뒤로
      </button>

      <p className="text-center text-sm text-white/70">{introText}</p>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          이름 (선택)
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="입력하지 않으면 '당신'으로 표시돼요"
            className="rounded-lg bg-white/10 px-4 py-3 text-base outline-none placeholder:text-white/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          생년월일
          <input
            type="date"
            value={form.birthDate}
            min={`${SUPPORTED_BIRTH_YEAR_RANGE.min}-01-01`}
            max={`${SUPPORTED_BIRTH_YEAR_RANGE.max}-12-31`}
            onChange={(e) => update("birthDate", e.target.value)}
            className="rounded-lg bg-white/10 px-4 py-3 text-base outline-none [color-scheme:dark]"
          />
          <span className="text-xs text-white/50">
            현재 {SUPPORTED_BIRTH_YEAR_RANGE.min}~{SUPPORTED_BIRTH_YEAR_RANGE.max}년 출생자만 계산할 수 있어요.
          </span>
        </label>

        <div className="flex flex-col gap-1 text-sm">
          양력 / 음력
          <div className="flex gap-3">
            {(["solar", "lunar"] as const).map((v) => (
              <button
                key={v}
                type="button"
                disabled={v === "lunar"}
                onClick={() => update("calendarType", v)}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  form.calendarType === v
                    ? "bg-[color:var(--color-gold)] font-semibold text-[#241a08]"
                    : "bg-white/10"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {v === "solar" ? "양력" : "음력 (준비중)"}
              </button>
            ))}
          </div>
          <span className="text-xs text-white/50">
            음력 생년월일 계산은 검증된 데이터 확보 후 곧 지원할 예정이에요. 지금은 양력으로 변환해서 입력해 주세요.
          </span>
        </div>

        {form.calendarType === "lunar" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isLeapMonth}
              onChange={(e) => update("isLeapMonth", e.target.checked)}
            />
            윤달이에요
          </label>
        )}

        <div className="flex flex-col gap-2 text-sm">
          출생시간
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.timeUnknown}
              onChange={(e) => update("timeUnknown", e.target.checked)}
            />
            시간 모름
          </label>
          {!form.timeUnknown && (
            <div className="flex gap-3">
              <select
                value={form.hour}
                onChange={(e) => update("hour", Number(e.target.value))}
                className="flex-1 rounded-lg bg-white/10 px-3 py-3 text-white"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h} className="bg-slate-800 text-white">
                    {String(h).padStart(2, "0")}시
                  </option>
                ))}
              </select>
              <select
                value={form.minute}
                onChange={(e) => update("minute", Number(e.target.value))}
                className="flex-1 rounded-lg bg-white/10 px-3 py-3 text-white"
              >
                {Array.from({ length: 60 }, (_, m) => (
                  <option key={m} value={m} className="bg-slate-800 text-white">
                    {String(m).padStart(2, "0")}분
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          성별
          <div className="flex gap-3">
            {(["female", "male"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("gender", v)}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  form.gender === v
                    ? "bg-[color:var(--color-gold)] font-semibold text-[#241a08]"
                    : "bg-white/10"
                }`}
              >
                {v === "female" ? "여성" : "남성"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          disabled={!isValid}
          onClick={() => onSubmit(form)}
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 disabled:shadow-none"
        >
          결과 보기
        </button>
        <AdSlot />
      </div>
    </div>
  );
}

export { DEFAULT_BIRTH_FORM };
