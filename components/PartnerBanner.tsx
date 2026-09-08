/**
 * 운영자가 함께 만드는 다른 서비스(계산한눈에) 홍보 배너. 본문이 끝나고 푸터가 시작되기
 * 전, 사이트 전역에 딱 하나만 노출한다 — 사주 풀이 결과나 주요 CTA 버튼과 겹치지 않는
 * 자리다. 배너 전체가 하나의 링크라 내부에 별도 버튼/링크 태그를 중첩하지 않는다.
 */
export default function PartnerBanner() {
  return (
    <a
      href="https://calc-haneye.kr/"
      target="_blank"
      rel="noopener noreferrer"
      className="no-print mx-6 mt-2 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-[color:var(--color-gold)]/40 hover:bg-white/[0.07] sm:mx-auto sm:w-full sm:max-w-md sm:flex-row sm:items-center sm:gap-4"
    >
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[color:var(--color-gold)]/15 text-2xl">
        🧮
      </span>
      <div className="flex-1">
        <p className="text-[11px] tracking-wide text-white/40">운영자가 함께 만드는 서비스 · 계산한눈에</p>
        <p className="mt-1 text-base font-bold text-[color:var(--color-gold-light)]">일상 속 돈 계산이 필요할 때</p>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          대출 이자부터 연봉 실수령액, 퇴직금까지 한눈에 계산해 보세요.
        </p>
      </div>
      <span className="inline-flex flex-none items-center gap-1 self-start rounded-full border border-[color:var(--color-gold)]/40 px-4 py-2 text-xs font-semibold text-[color:var(--color-gold-light)] sm:self-center">
        계산한눈에 보러가기 →
      </span>
    </a>
  );
}
