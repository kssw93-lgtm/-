"use client";

import type { Species } from "@/types/food";

interface SpeciesToggleProps {
  value: Species;
  onChange: (value: Species) => void;
}

const OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: "dog", label: "강아지", emoji: "🐶" },
  { value: "cat", label: "고양이", emoji: "🐱" },
];

export default function SpeciesToggle({ value, onChange }: SpeciesToggleProps) {
  return (
    <div className="flex gap-2 px-4 pb-1 pt-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
            value === opt.value
              ? "border-brand bg-brand/10 text-brand"
              : "border-gray-200 bg-white text-gray-400"
          }`}
        >
          {opt.emoji} {opt.label}
        </button>
      ))}
    </div>
  );
}
