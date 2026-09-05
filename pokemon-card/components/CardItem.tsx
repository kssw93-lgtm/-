'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { PokemonCard } from '@/types/pokemon';
import { addToCollection, isInCollection, removeFromCollection } from '@/lib/collection';

export default function CardItem({ card }: { card: PokemonCard }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInCollection(card.id));
  }, [card.id]);

  function toggleCollection() {
    if (saved) {
      removeFromCollection(card.id);
    } else {
      addToCollection({ id: card.id, name: card.name, image: card.images.small });
    }
    setSaved(!saved);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[5/7] w-full bg-slate-100">
        <Image
          src={card.images.small}
          alt={card.name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-sm font-semibold text-slate-800">{card.name}</p>
        <p className="text-xs text-slate-500">{card.set.name} · {card.number}</p>
        {card.rarity && (
          <span className="w-fit rounded-full bg-pokeyellow/40 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {card.rarity}
          </span>
        )}
        <button
          onClick={toggleCollection}
          className={`mt-auto rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            saved
              ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              : 'bg-pokeblue text-white hover:bg-blue-800'
          }`}
        >
          {saved ? '컬렉션에서 제거' : '컬렉션에 추가'}
        </button>
      </div>
    </div>
  );
}
