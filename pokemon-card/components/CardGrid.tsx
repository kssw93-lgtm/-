import type { PokemonCard } from '@/types/pokemon';
import CardItem from './CardItem';

export default function CardGrid({ cards }: { cards: PokemonCard[] }) {
  if (cards.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">검색 결과가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
