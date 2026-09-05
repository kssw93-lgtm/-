import type { CardSearchResponse } from '@/types/pokemon';

const API_BASE = 'https://api.pokemontcg.io/v2';

export async function searchCards(query: string, page = 1): Promise<CardSearchResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: '20',
    orderBy: '-set.releaseDate',
  });

  if (query.trim()) {
    params.set('q', `name:"${query.trim()}*"`);
  }

  const res = await fetch(`${API_BASE}/cards?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`포켓몬 카드 API 요청 실패: ${res.status}`);
  }

  return res.json();
}

export async function getCardById(id: string): Promise<{ data: CardSearchResponse['data'][number] }> {
  const res = await fetch(`${API_BASE}/cards/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`카드 조회 실패: ${res.status}`);
  }

  return res.json();
}
