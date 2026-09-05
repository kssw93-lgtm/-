import SearchBar from '@/components/SearchBar';
import CardGrid from '@/components/CardGrid';
import { searchCards } from '@/lib/pokemonApi';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? '';
  let cards: Awaited<ReturnType<typeof searchCards>>['data'] = [];
  let errorMessage: string | null = null;

  try {
    const result = await searchCards(query || 'pikachu');
    cards = result.data;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-bold">포켓몬 카드 검색</h1>
        <p className="mb-4 text-sm text-slate-500">
          이름으로 포켓몬 카드를 검색하고, 마음에 드는 카드를 내 컬렉션에 저장해보세요.
        </p>
        <SearchBar />
      </section>

      {errorMessage ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{errorMessage}</p>
      ) : (
        <CardGrid cards={cards} />
      )}
    </div>
  );
}
