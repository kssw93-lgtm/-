"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { languageSwitchPath } from "@/lib/i18n/locale-routes";

export default function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const languageHref = languageSwitchPath(pathname ?? "/");
  const languageLabel = isEnglish ? "Korean" : "English";
  const compactLanguageLabel = isEnglish ? "KO" : "EN";

  return (
    <header className="flex min-h-[60px] items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-2">
      <Link href={isEnglish ? "/en" : "/"} className="flex min-w-0 items-center gap-2.5 transition hover:opacity-80" aria-label={isEnglish ? "Saju Dalyeok home" : "사주달력 홈"}>
        <Image src="/brand-mark.svg" alt="" width={32} height={32} priority />
        <span className="font-brand flex min-w-0 items-baseline gap-1.5 text-[16px] font-bold tracking-wide text-[color:var(--color-gold-light)]">
          {isEnglish ? "SAJU DALYEOK" : "사주달력"}
          <span className="truncate text-[11px] font-medium text-white/45">{isEnglish ? "Korean Saju" : "천기누설"}</span>
        </span>
      </Link>

      <nav aria-label={isEnglish ? "Main navigation" : "주요 메뉴"} className="flex flex-none items-center gap-1.5 text-[11px] font-medium text-white/60">
        {isEnglish ? (
          <>
            <Link href="/en/learn" className="hidden rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">Learn Saju</Link>
            <Link href="/en/tarot" className="hidden rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">Tarot</Link>
            <Link href="/en/about" className="hidden rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">About</Link>
            <Link href={languageHref} lang="ko" aria-label="Switch to Korean" title="Korean version" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[color:var(--color-gold)]/35 bg-[color:var(--color-gold)]/[0.08] px-3 text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/15">
              <span className="sm:hidden">{compactLanguageLabel}</span>
              <span className="hidden sm:inline">{languageLabel}</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/learn" className="hidden rounded-full px-2.5 py-2 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">사주 배우기</Link>
            <Link href="/tarot" className="hidden rounded-full border border-[color:var(--color-gold)]/25 px-2.5 py-2 text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/10 sm:inline-flex">타로</Link>
            <Link href={languageHref} lang="en" aria-label="Switch to English" title="English version" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[color:var(--color-gold)]/35 bg-[color:var(--color-gold)]/[0.08] px-3 font-semibold text-[color:var(--color-gold-light)] transition hover:bg-[color:var(--color-gold)]/15">
              <span className="sm:hidden">{compactLanguageLabel}</span>
              <span className="hidden sm:inline">{languageLabel}</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
