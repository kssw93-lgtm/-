'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="포켓몬 이름으로 검색 (예: Pikachu)"
        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-pokeblue focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-pokeblue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        검색
      </button>
    </form>
  );
}
