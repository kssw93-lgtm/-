"use client";

import { useState } from "react";
import type { PastLife } from "@/lib/interpretation";

/** 재미 콘텐츠: 원국의 우세 기운을 "조선시대 전생" 컨셉으로 보여준다. 탭하면 펼쳐진다. */
export default function PastLifeCard({ pastLife }: { pastLife: PastLife }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center transition hover:border-[color:var(--color-gold)]/60 active:scale-[0.98]"
      >
        <span className="text-3xl">📜</span>
        <span className="font-brand text-base font-bold text-[color:var(--color-gold-light)]">
          나의 조선시대 전생 보기
        </span>
        <span className="text-xs text-white/50">두루마리를 펼쳐 전생을 확인해봐</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/30 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6 text-center">
      <p className="text-xs tracking-[0.2em] text-white/40">前生</p>
      <p className="font-brand mt-3 text-lg font-bold text-[color:var(--color-gold-light)]">{pastLife.title}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/80">{pastLife.text}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {pastLife.tags.map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
