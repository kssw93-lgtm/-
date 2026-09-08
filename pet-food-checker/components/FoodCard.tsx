"use client";

import { useState } from "react";
import type { FoodItem } from "@/types/food";

const SAFETY_STYLE: Record<
  FoodItem["safety"],
  { badge: string; border: string; icon: string }
> = {
  치명적: { badge: "bg-red-600 text-white", border: "border-red-200", icon: "☠️" },
  위험: { badge: "bg-orange-500 text-white", border: "border-orange-200", icon: "⚠️" },
  주의: { badge: "bg-yellow-500 text-white", border: "border-yellow-200", icon: "🔶" },
  안전: { badge: "bg-green-600 text-white", border: "border-green-200", icon: "✅" },
};

export default function FoodCard({ food }: { food: FoodItem }) {
  const [open, setOpen] = useState(false);
  const style = SAFETY_STYLE[food.safety];

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
          {food.safety}
        </span>
      </div>

      {open && (
        <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm text-gray-600">
          {food.toxic_component && (
            <p>
              <span className="font-medium text-gray-800">위험 성분</span>{" "}
              {food.toxic_component}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-800">증상</span>{" "}
            {food.symptoms}
          </p>
          <p>
            <span className="font-medium text-gray-800">대처</span>{" "}
            {food.emergency}
          </p>
          {food.safe_amount && (
            <p>
              <span className="font-medium text-gray-800">적정량</span>{" "}
              {food.safe_amount}
            </p>
          )}
          <p className="text-gray-500">{food.notes}</p>
        </div>
      )}
    </button>
  );
}
