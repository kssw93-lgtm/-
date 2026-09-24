import Link from "next/link";

/** 서비스 안내와 관련 콘텐츠를 찾기 위한 하단 링크 모음. */
export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 px-6 py-5 text-[11px] text-white/35">
      <Link href="/learn" className="hover:text-white/70 hover:underline">
        사주 배우기
      </Link>
      <Link href="/zodiac" className="hover:text-white/70 hover:underline">
        별자리·띠 성격
      </Link>
      <Link href="/tarot" className="hover:text-white/70 hover:underline">
        타로점 보기
      </Link>
      <Link href="/tarot-guide" className="hover:text-white/70 hover:underline">
        타로 백과
      </Link>
      <Link href="/about" className="hover:text-white/70 hover:underline">
        사이트 소개
      </Link>
      <Link href="/faq" className="hover:text-white/70 hover:underline">
        자주 묻는 질문
      </Link>
      <Link href="/privacy" className="hover:text-white/70 hover:underline">
        개인정보처리방침
      </Link>
      <span className="w-full text-center text-white/20">© 2026 사주달력 (전 천기누설)</span>
    </footer>
  );
}
