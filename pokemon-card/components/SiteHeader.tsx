import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-pokeblue">
          <span className="rounded-full bg-pokeyellow px-2 py-0.5 text-sm text-slate-900">⚡</span>
          포켓몬 카드 도감
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-pokeblue">카드 검색</Link>
          <Link href="/collection" className="hover:text-pokeblue">내 컬렉션</Link>
        </nav>
      </div>
    </header>
  );
}
