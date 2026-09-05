const STORAGE_KEY = 'pokemon-card-collection';

export interface CollectionEntry {
  id: string;
  name: string;
  image: string;
  addedAt: string;
}

function readAll(): CollectionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CollectionEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: CollectionEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getCollection(): CollectionEntry[] {
  return readAll();
}

export function isInCollection(id: string): boolean {
  return readAll().some((entry) => entry.id === id);
}

export function addToCollection(entry: Omit<CollectionEntry, 'addedAt'>): CollectionEntry[] {
  const entries = readAll();
  if (entries.some((e) => e.id === entry.id)) return entries;
  const next = [...entries, { ...entry, addedAt: new Date().toISOString() }];
  writeAll(next);
  return next;
}

export function removeFromCollection(id: string): CollectionEntry[] {
  const next = readAll().filter((entry) => entry.id !== id);
  writeAll(next);
  return next;
}
