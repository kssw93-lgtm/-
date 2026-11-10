"use client";

import { useState, type FormEvent } from "react";
import type { BranchId, ElementId, SajuResult, StemId } from "@/lib/calc/types";

const STEMS: Record<StemId, { name: string; hanja: string; element: ElementId; polarity: "Yang" | "Yin" }> = {
  jia: { name: "Jia", hanja: "甲", element: "wood", polarity: "Yang" },
  yi: { name: "Yi", hanja: "乙", element: "wood", polarity: "Yin" },
  bing: { name: "Bing", hanja: "丙", element: "fire", polarity: "Yang" },
  ding: { name: "Ding", hanja: "丁", element: "fire", polarity: "Yin" },
  wu: { name: "Wu", hanja: "戊", element: "earth", polarity: "Yang" },
  ji: { name: "Ji", hanja: "己", element: "earth", polarity: "Yin" },
  geng: { name: "Geng", hanja: "庚", element: "metal", polarity: "Yang" },
  xin: { name: "Xin", hanja: "辛", element: "metal", polarity: "Yin" },
  ren: { name: "Ren", hanja: "壬", element: "water", polarity: "Yang" },
  gui: { name: "Gui", hanja: "癸", element: "water", polarity: "Yin" },
};

const BRANCHES: Record<BranchId, { animal: string; hanja: string; name: string }> = {
  zi: { animal: "Rat", hanja: "子", name: "Zi" },
  chou: { animal: "Ox", hanja: "丑", name: "Chou" },
  yin: { animal: "Tiger", hanja: "寅", name: "Yin" },
  mao: { animal: "Rabbit", hanja: "卯", name: "Mao" },
  chen: { animal: "Dragon", hanja: "辰", name: "Chen" },
  si: { animal: "Snake", hanja: "巳", name: "Si" },
  wu: { animal: "Horse", hanja: "午", name: "Wu" },
  wei: { animal: "Goat", hanja: "未", name: "Wei" },
  shen: { animal: "Monkey", hanja: "申", name: "Shen" },
  you: { animal: "Rooster", hanja: "酉", name: "You" },
  xu: { animal: "Dog", hanja: "戌", name: "Xu" },
  hai: { animal: "Pig", hanja: "亥", name: "Hai" },
};

const ELEMENTS: { id: ElementId; name: string; color: string }[] = [
  { id: "wood", name: "Wood", color: "#78c89d" },
  { id: "fire", name: "Fire", color: "#f18c82" },
  { id: "earth", name: "Earth", color: "#d6b875" },
  { id: "metal", name: "Metal", color: "#c4cce4" },
  { id: "water", name: "Water", color: "#82b7e8" },
];

const PILLAR_LABELS = [
  { key: "yearPillar", label: "Year" },
  { key: "monthPillar", label: "Month" },
  { key: "dayPillar", label: "Day" },
  { key: "hourPillar", label: "Hour" },
] as const;

function PillarCard({ label, pillar }: { label: string; pillar: { stem: StemId; branch: BranchId } | null }) {
  if (!pillar) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</p>
        <p className="mt-3 text-sm text-white/35">Unknown</p>
      </div>
    );
  }

  const stem = STEMS[pillar.stem];
  const branch = BRANCHES[pillar.branch];
  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-black/20 p-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</p>
      <p className="font-brand mt-2 text-3xl font-bold text-[color:var(--color-gold-light)]">{stem.hanja}{branch.hanja}</p>
      <p className="mt-1 text-xs font-semibold text-white/85">{stem.name} · {branch.animal}</p>
      <p className="mt-1 text-[10px] text-white/45">{stem.polarity} {stem.element} · {branch.name}</p>
    </div>
  );
}

function ChartResult({ result, onReset }: { result: SajuResult; onReset: () => void }) {
  const counts: Record<ElementId, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const element of [...result.elements.stemElements, ...result.elements.branchElements]) counts[element] += 1;
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const dayMaster = STEMS[result.pillars.dayPillar.stem];

  return (
    <section aria-live="polite" className="mt-5 rounded-3xl border border-[color:var(--color-gold)]/25 bg-[#141321] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">YOUR FOUR PILLARS</p>
          <h3 className="font-brand mt-1 text-xl font-bold">Your Saju chart</h3>
        </div>
        <button type="button" onClick={onReset} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/65 hover:bg-white/5">New chart</button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PILLAR_LABELS.map(({ key, label }) => (
          <PillarCard key={key} label={label} pillar={result.pillars[key]} />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-white/45">DAY MASTER</p>
        <p className="mt-2 text-sm leading-6 text-white/85">
          Your Day Master is <strong className="text-[color:var(--color-gold-light)]">{dayMaster.hanja} {dayMaster.name}</strong>, the heavenly stem of your Day Pillar. In Saju, it is the reference point used to read the rest of the chart.
        </p>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold">Five Elements</h4>
            <p className="mt-1 text-[11px] text-white/45">Counts among {total} visible stem and branch positions</p>
          </div>
          <span className="text-[10px] text-white/35">Hidden stems are not included</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {ELEMENTS.map((element) => (
            <div key={element.id} className="grid grid-cols-[3.5rem_1fr_1.5rem] items-center gap-2 text-xs">
              <span className="text-white/70">{element.name}</span>
              <div className="h-2 overflow-hidden rounded-full bg-white/10" aria-label={`${element.name}: ${counts[element.id]} of ${total}`}>
                <div className="h-full rounded-full" style={{ width: `${total ? (counts[element.id] / total) * 100 : 0}%`, backgroundColor: element.color }} />
              </div>
              <span className="text-right tabular-nums text-white/55">{counts[element.id]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-white/35">This chart shows calculated pillars and visible element counts. It is a traditional interpretive framework, not a scientific prediction.</p>
    </section>
  );
}

export default function EnglishSajuCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsCalculating(true);

    try {
      const [year, month, day] = birthDate.split("-").map(Number);
      const [hour, minute] = birthTime.split(":").map(Number);
      const { computeSaju, SUPPORTED_BIRTH_YEAR_RANGE } = await import("@/lib/calc");
      if (year < SUPPORTED_BIRTH_YEAR_RANGE.min || year > SUPPORTED_BIRTH_YEAR_RANGE.max) {
        throw new Error(`This calculator currently supports birth years ${SUPPORTED_BIRTH_YEAR_RANGE.min}–${SUPPORTED_BIRTH_YEAR_RANGE.max}.`);
      }

      const chart = computeSaju({
        year,
        month,
        day,
        hour: timeUnknown ? null : hour,
        minute: timeUnknown ? 0 : minute,
        gender: "female", // Gender does not affect the four pillars shown in this chart preview.
        calendarType: "solar",
        isLeapMonth: false,
      });
      setResult(chart);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We could not calculate this chart. Check the date and try again.";
      setError(message.includes("supports birth years") ? message : "We could not calculate this chart. Check the date and try again.");
    } finally {
      setIsCalculating(false);
    }
  }

  function resetChart() {
    setResult(null);
    setError("");
  }

  return (
    <div>
      <form id="calculator" onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-[#111321] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] sm:p-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">FREE · NO SIGN-UP</p>
          <h2 className="font-brand mt-1 text-2xl font-bold">Calculate your Four Pillars</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Enter a solar-calendar birth date and time recorded in South Korea.</p>
        </div>

        <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-white/80">
          Date of birth
          <input
            required
            type="date"
            min="1950-01-01"
            max="2028-12-31"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none focus:border-[color:var(--color-gold)] [color-scheme:dark]"
          />
        </label>

        <div className="mt-4">
          <label htmlFor="birth-time" className="flex flex-col gap-2 text-sm font-medium text-white/80">
            Local birth time (Korea)
            <input
              id="birth-time"
              type="time"
              value={birthTime}
              disabled={timeUnknown}
              onChange={(event) => setBirthTime(event.target.value)}
              className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none focus:border-[color:var(--color-gold)] disabled:opacity-40 [color-scheme:dark]"
            />
          </label>
          <label className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <input type="checkbox" checked={timeUnknown} onChange={(event) => setTimeUnknown(event.target.checked)} className="accent-[color:var(--color-gold)]" />
            I don't know my birth time
          </label>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/5 px-3 py-2 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={!birthDate || isCalculating}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-4 text-sm font-bold text-[#241a08] shadow-[0_8px_28px_rgba(201,163,92,0.2)] transition enabled:hover:brightness-110 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isCalculating ? "Calculating your chart…" : "Calculate my Saju chart"}
        </button>
        <p className="mt-3 text-center text-[10px] leading-relaxed text-white/35">Your birth details are calculated in your browser and are not saved by this calculator.</p>
      </form>

      {result && <ChartResult result={result} onReset={resetChart} />}
    </div>
  );
}
