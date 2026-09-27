"use client";

import { useState } from "react";
import { computeNameCompat, NameCompatInputError, type NameCompatResult } from "@/lib/interpretation/name-compat";

export default function NameCompatCalculator() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [result, setResult] = useState<NameCompatResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResult(computeNameCompat(nameA, nameB));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof NameCompatInputError ? err.message : "궁합을 계산할 수 없어요. 다시 시도해주세요.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold text-white/60">첫 번째 이름</span>
          <input
            value={nameA}
            onChange={(e) => setNameA(e.target.value)}
            maxLength={10}
            placeholder="예: 홍길동"
            className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none focus:border-[color:var(--color-gold)]/60"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold text-white/60">두 번째 이름</span>
          <input
            value={nameB}
            onChange={(e) => setNameB(e.target.value)}
            maxLength={10}
            placeholder="예: 김철수"
            className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none focus:border-[color:var(--color-gold)]/60"
          />
        </label>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <button
          type="submit"
          className="mt-1 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-3.5 text-sm font-bold text-[#241a08] transition hover:brightness-110 active:scale-[0.98]"
        >
          이름궁합 확인하기
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/15 to-white/5 p-6 text-center">
          <p className="text-sm text-white/60">
            {result.nameA} <span className="text-white/30">×</span> {result.nameB}
          </p>
          <p className="mt-3 text-5xl font-black" style={{ color: "#e8cd94" }}>
            {result.score}
            <span className="text-2xl">점</span>
          </p>
          <p className="mt-2 text-lg font-bold">
            {result.emoji} {result.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/75">{result.summary}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {result.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
