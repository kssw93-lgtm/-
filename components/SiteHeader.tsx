import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
      <Link href="/" className="flex min-w-0 items-center gap-2.5 transition hover:opacity-80" aria-label="사주달력 홈">
        <Image src="/brand-mark.svg" alt="" width={32} height={32} priority />
        <span className="font-brand flex min-w-0 items-baseline gap-1.5 text-[16px] font-bold tracking-wide text-[color:var(--color-gold-light)]">
          사주달력
          <span className="truncate text-[11px] font-medium text-white/45">천기누설</span>
        </span>
      </Link>

      <nav aria-label="주요 메뉴" className="flex flex-none items-center gap-1.5 text-[11px] font-medium text-white/60">
        <Link href="/learn" className="rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white">
          사주 배우기
        </Link>
        <Link href="/tarot" className="rounded-full border border-[color:var(--color-gold)]/25 px-2.5 py-2 text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/10">
          타로
        </Link>
      </nav>
    </header>
  );
}
