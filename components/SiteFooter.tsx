import Link from "next/link";

/** 애드센스 심사 요건(신뢰 페이지 링크 필요) + 실제 이용자 편의를 겸한 하단 링크 모음. */
export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 px-6 py-5 text-[11px] text-white/35">
      <Link href="/learn" className="hover:text-white/70 hover:underline">
        사주 배우기
      </Link>
      <Link href="/zodiac" className="hover:text-white/70 hover:underline">
        별자리·띠 성격
      </Link>
      <Link href="/about" className="hover:text-white/70 hover:underline">
        사이트 소개
      </Link>
      <Link href="/privacy" className="hover:text-white/70 hover:underline">
        개인정보처리방침
      </Link>
      <span className="w-full text-center text-white/20">© 2026 천기누설</span>
    </footer>
  );
}
