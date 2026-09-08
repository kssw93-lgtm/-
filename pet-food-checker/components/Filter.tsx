"use client";

import type { SafetyLevel } from "@/types/food";

export type FilterValue = "전체" | SafetyLevel;

const FILTERS: { label: FilterValue; activeClass: string }[] = [
  { label: "전체", activeClass: "bg-gray-800 text-white" },
  { label: "치명적", activeClass: "bg-red-600 text-white" },
  { label: "위험", activeClass: "bg-orange-500 text-white" },
  { label: "주의", activeClass: "bg-yellow-500 text-white" },
  { label: "안전", activeClass: "bg-green-600 text-white" },
];

interface FilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function Filter({ value, onChange }: FilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3">
      {FILTERS.map((f) => (
        <button
          key={f.label}
          type="button"
          onClick={() => onChange(f.label)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === f.label ? f.activeClass : "bg-gray-100 text-gray-600"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
