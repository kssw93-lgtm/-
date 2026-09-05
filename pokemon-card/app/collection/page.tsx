'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCollection, removeFromCollection, type CollectionEntry } from '@/lib/collection';

export default function CollectionPage() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);

  useEffect(() => {
    setEntries(getCollection());
  }, []);

  function handleRemove(id: string) {
    setEntries(removeFromCollection(id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">내 컬렉션</h1>
        <p className="mt-1 text-sm text-slate-500">
          이 브라우저에 저장된 나만의 포켓몬 카드 목록입니다. ({entries.length}장)
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          아직 저장한 카드가 없습니다. 카드 검색에서 마음에 드는 카드를 추가해보세요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {entries.map((entry) => (
            <div key={entry.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[5/7] w-full bg-slate-100">
                <Image src={entry.image} alt={entry.name} fill className="object-contain p-2" sizes="20vw" />
              </div>
              <div className="flex flex-col gap-1 p-3">
                <p className="text-sm font-semibold text-slate-800">{entry.name}</p>
                <button
                  onClick={() => handleRemove(entry.id)}
                  className="mt-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-300"
                >
                  제거
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
