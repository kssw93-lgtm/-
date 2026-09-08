"use client";

import { useState } from "react";
import type { FoodItem, SafetyLevel, Species } from "@/types/food";

const SAFETY_STYLE: Record<
  SafetyLevel,
  { badge: string; border: string; icon: string }
> = {
  치명적: { badge: "bg-red-600 text-white", border: "border-red-200", icon: "☠️" },
  위험: { badge: "bg-orange-500 text-white", border: "border-orange-200", icon: "⚠️" },
  주의: { badge: "bg-yellow-500 text-white", border: "border-yellow-200", icon: "🔶" },
  안전: { badge: "bg-green-600 text-white", border: "border-green-200", icon: "✅" },
};

export default function FoodCard({
  food,
  species,
}: {
  food: FoodItem;
  species: Species;
}) {
  const [open, setOpen] = useState(false);
  const info = food[species];
  const style = SAFETY_STYLE[info.safety];

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`w-full rounded-2xl border ${style.border} bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {style.icon}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{food.name}</p>
            <p className="text-xs text-gray-400">{food.category}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
        >
          {info.safety}
        </span>
      </div>

      {open && (
        <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm text-gray-600">
          {info.toxic_component && (
            <p>
              <span className="font-medium text-gray-800">위험 성분</span>{" "}
              {info.toxic_component}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-800">증상</span>{" "}
            {info.symptoms}
          </p>
          <p>
            <span className="font-medium text-gray-800">대처</span>{" "}
            {info.emergency}
          </p>
          {info.safe_amount && (
            <p>
              <span className="font-medium text-gray-800">적정량</span>{" "}
              {info.safe_amount}
            </p>
          )}
          <p className="text-gray-500">{info.notes}</p>

          {info.benefits && (
            <p className="rounded-lg bg-green-50 p-2 text-green-800">
              <span className="font-medium">영양 효능</span> {info.benefits}
            </p>
          )}

          {species === "dog" && info.dose_by_size && (
            <div className="rounded-lg bg-gray-50 p-2">
              <p className="mb-1 font-medium text-gray-800">
                체구별 위험 섭취량 참고치
              </p>
              <p>
                <span className="font-medium">소형견(~5kg)</span>{" "}
                {info.dose_by_size.small}
              </p>
              <p>
                <span className="font-medium">중형견(~15kg)</span>{" "}
                {info.dose_by_size.medium}
              </p>
              <p>
                <span className="font-medium">대형견(~30kg)</span>{" "}
                {info.dose_by_size.large}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                실제 체중에 비례해 조정하는 참고용 수치이며, 정확한 진단은
                반드시 동물병원에 문의하세요.
              </p>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
