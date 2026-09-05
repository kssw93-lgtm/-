export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  rarity?: string;
  set: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
  };
  number: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    prices?: Record<string, { market?: number }>;
  };
}

export interface CardSearchResponse {
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
