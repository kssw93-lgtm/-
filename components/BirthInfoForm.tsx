"use client";

import { useEffect, useState } from "react";
import { DEFAULT_BIRTH_FORM, type BirthFormState } from "@/lib/session";
import { SUPPORTED_BIRTH_YEAR_RANGE } from "@/lib/calc";
import { useSiteLocale } from "@/lib/i18n/site-locale";
import { t } from "@/lib/i18n/messages";

interface Props {
  introText: string;
  initial: BirthFormState;
  onSubmit: (form: BirthFormState) => void;
  onBack: () => void;
}

const FALLBACK_TIME_ZONES = [
  "UTC", "Asia/Seoul", "Asia/Tokyo", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
  "Asia/Bangkok", "Asia/Kolkata", "Asia/Dubai", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Africa/Johannesburg", "Africa/Cairo", "America/Sao_Paulo", "America/Mexico_City",
  "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York", "America/Toronto",
  "America/Vancouver", "Pacific/Honolulu", "Australia/Perth", "Australia/Sydney", "Pacific/Auckland",
];

function timeZoneLabel(timeZone: string): string {
  const parts = timeZone.split("/");
  const city = parts.pop()?.replaceAll("_", " ") ?? timeZone;
  return `${city} — ${timeZone}`;
}

function availableTimeZones(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
  const zones = intl.supportedValuesOf?.("timeZone") ?? FALLBACK_TIME_ZONES;
  const current = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return [...new Set([...FALLBACK_TIME_ZONES, ...zones, current])].sort((a, b) =>
    timeZoneLabel(a).localeCompare(timeZoneLabel(b), "en")
  );
}

/** S3. 정보 입력 화면 (화면 흐름 설계서 04번) */
export default function BirthInfoForm({ introText, initial, onSubmit, onBack }: Props) {
  const locale = useSiteLocale();
  const isEnglish = locale === "en";
  const [form, setForm] = useState<BirthFormState>(initial);
  const [timeZones, setTimeZones] = useState(FALLBACK_TIME_ZONES);
  const [timeZoneQuery, setTimeZoneQuery] = useState(timeZoneLabel(initial.timeZone ?? "Asia/Seoul"));

  useEffect(() => {
    setTimeZones(availableTimeZones());
    if (!isEnglish || (form.birthDate && form.timeZone)) return;
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (currentTimeZone) setForm((previous) => ({ ...previous, timeZone: currentTimeZone }));
  }, [isEnglish]);

  useEffect(() => {
    setTimeZoneQuery(timeZoneLabel(form.timeZone ?? "Asia/Seoul"));
  }, [form.timeZone]);

  const isValid = form.birthDate.trim().length > 0 && !!form.calendarType && !!form.gender;
  const isTimeZoneSelectionValid = !isEnglish || timeZones.some((timeZone) => timeZoneLabel(timeZone) === timeZoneQuery);

  function update<K extends keyof BirthFormState>(key: K, value: BirthFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-6 py-8">
      <button onClick={onBack} className="self-start text-sm text-white/40 hover:text-white/70">
        ← {t(locale, "뒤로")}
      </button>

      <p className="text-center text-sm text-white/70">{introText}</p>
      {isEnglish && <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-white/50">
        Enter the date and time as recorded where you were born. We apply that location’s historical time-zone rules, then convert the birth moment to Korea Standard Time for the chart. If the birth time is unknown, local noon is used only to place the date; the Hour Pillar is omitted. Local solar-time adjustments by longitude are not applied.
      </p>}

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {t(locale, "이름 (선택)")}
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={isEnglish ? "Leave blank to use ‘you’ in the reading" : "입력하지 않으면 '당신'으로 표시돼요"}
            className="rounded-lg bg-white/10 px-4 py-3 text-base outline-none placeholder:text-white/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t(locale, "생년월일")}
          <input
            type="date"
            value={form.birthDate}
            min={`${SUPPORTED_BIRTH_YEAR_RANGE.min}-01-01`}
            max={`${SUPPORTED_BIRTH_YEAR_RANGE.max}-12-31`}
            onChange={(e) => update("birthDate", e.target.value)}
            className="rounded-lg bg-white/10 px-4 py-3 text-base outline-none [color-scheme:dark]"
          />
          <span className="text-xs text-white/50">
            {isEnglish
              ? `Supported birth years: ${SUPPORTED_BIRTH_YEAR_RANGE.min}–${SUPPORTED_BIRTH_YEAR_RANGE.max}.`
              : `현재 ${SUPPORTED_BIRTH_YEAR_RANGE.min}~${SUPPORTED_BIRTH_YEAR_RANGE.max}년 출생자만 계산할 수 있어요.`}
          </span>
        </label>

        <div className="flex flex-col gap-1 text-sm">
          {t(locale, "양력 / 음력")}
          <div className="flex gap-3">
            {(["solar", "lunar"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("calendarType", v)}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  form.calendarType === v
                    ? "bg-[color:var(--color-gold)] font-semibold text-[#241a08]"
                    : "bg-white/10"
                }`}
              >
                {v === "solar" ? t(locale, "양력") : t(locale, "음력")}
              </button>
            ))}
          </div>
          {form.calendarType === "lunar" && (
            <span className="text-xs text-white/50">
              {isEnglish
                ? "Enter the lunar date above. We convert it using official Korean lunar–solar calendar data from the Korea Astronomy and Space Science Institute (KASI)."
                : "위 생년월일 칸에 음력 날짜 그대로 입력해 주세요. KASI(한국천문연구원) 공식 음양력 데이터로 변환해요."}
            </span>
          )}
        </div>

        {form.calendarType === "lunar" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isLeapMonth}
              onChange={(e) => update("isLeapMonth", e.target.checked)}
            />
              {isEnglish ? "This is a leap month" : "윤달이에요"}
          </label>
        )}

        {isEnglish && (
          <label htmlFor="birth-time-zone" className="flex flex-col gap-2 text-sm font-medium text-white/80">
            Time zone where you were born
            <input
              id="birth-time-zone"
              type="search"
              list="birth-time-zone-options"
              autoComplete="off"
              value={timeZoneQuery}
              onChange={(event) => {
                const query = event.target.value;
                setTimeZoneQuery(query);
                const selected = timeZones.find((timeZone) => timeZoneLabel(timeZone) === query);
                if (selected) update("timeZone", selected);
              }}
              aria-invalid={!isTimeZoneSelectionValid}
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-[color:var(--color-gold)]"
            />
            <datalist id="birth-time-zone-options">
              {timeZones.map((timeZone) => <option key={timeZone} value={timeZoneLabel(timeZone)} />)}
            </datalist>
            {!isTimeZoneSelectionValid && <span role="alert" className="text-xs text-rose-200">Choose a time zone from the list.</span>}
            <span className="text-xs leading-5 text-white/50">
              Search the list by city. Daylight-saving rules are applied; if clocks repeated the entered time, the earlier occurrence is used.
            </span>
          </label>
        )}

        <div className="flex flex-col gap-2 text-sm">
          {isEnglish ? "Time of birth" : "출생시간"}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.timeUnknown}
              onChange={(e) => update("timeUnknown", e.target.checked)}
            />
            {isEnglish ? "I don't know the birth time" : "시간 모름"}
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
                    {String(h).padStart(2, "0")}{isEnglish ? ":00" : "시"}
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
                    {String(m).padStart(2, "0")}{isEnglish ? " min" : "분"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          {t(locale, "성별")}
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
                {v === "female" ? t(locale, "여성") : t(locale, "남성")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          disabled={!isValid || !isTimeZoneSelectionValid}
          onClick={() => onSubmit(form)}
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-lg font-bold text-[#241a08] shadow-[0_8px_30px_rgba(201,163,92,0.35)] transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 disabled:shadow-none"
        >
          {isEnglish ? "Continue to my reading" : "결과 보기"}
        </button>
      </div>
    </div>
  );
}

export { DEFAULT_BIRTH_FORM };
