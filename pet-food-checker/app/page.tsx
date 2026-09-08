"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Filter, { FilterValue } from "@/components/Filter";
import FoodCard from "@/components/FoodCard";
import foods from "@/data/foods.json";
import type { FoodItem } from "@/types/food";

const FOOD_LIST = foods as FoodItem[];

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("전체");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOOD_LIST.filter((food) => {
      const matchesQuery = q === "" || food.name.toLowerCase().includes(q);
      const matchesFilter = filter === "전체" || food.safety === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-gray-50 pb-10">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">🐶 펫푸드 체커</h1>
        <p className="mt-1 text-sm text-gray-500">
          강아지가 먹어도 되는 음식인지 바로 확인하세요.
        </p>
      </header>

      <SearchBar value={query} onChange={setQuery} />
      <Filter value={filter} onChange={setFilter} />

      <section className="mt-1 flex flex-col gap-3 px-4">
        {results.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-400">
            검색 결과가 없어요. 다른 음식 이름으로 검색해보세요.
          </p>
        ) : (
          results.map((food) => <FoodCard key={food.id} food={food} />)
        )}
      </section>

      <p className="mt-8 px-4 text-center text-xs text-gray-400">
        본 정보는 참고용이며, 응급 상황에는 반드시 동물병원에 문의하세요.
      </p>

      <nav className="mt-4 flex justify-center gap-4 px-4 text-xs text-gray-400">
        <a href="/privacy" className="underline">
          개인정보처리방침
        </a>
        <a href="/terms" className="underline">
          이용약관
        </a>
      </nav>
    </main>
  );
}
