import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 천기누설",
  description: "천기누설의 개인정보처리방침과 광고(쿠키) 사용에 대한 안내입니다.",
};

const EFFECTIVE_DATE = "2026년 8월 22일";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          Privacy Policy
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-xs text-white/40">시행일: {EFFECTIVE_DATE}</p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-[15px] leading-relaxed text-white/85">
        <section>
          <h2 className="mb-1.5 text-sm font-bold text-[color:var(--color-gold-light)]">1. 수집하는 개인정보</h2>
          <p>
            천기누설은 회원가입과 로그인 기능이 없어요. 사주 계산을 위해 입력하신 이름(선택), 생년월일시, 성별 등의
            정보는 서버로 전송되어 저장되지 않고, 이용 중인 기기의 브라우저(로컬/세션 저장소) 안에서만 계산과 재사용
            편의를 위해 임시로 보관돼요. 브라우저 저장 데이터를 지우거나 탭을 닫으면 함께 사라질 수 있어요.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-sm font-bold text-[color:var(--color-gold-light)]">2. 광고 및 쿠키 (Google 애드센스)</h2>
          <p>
            이 사이트는 Google 애드센스를 통해 광고를 게재해요. Google을 비롯한 광고 제휴사는 쿠키를 사용해 이용자의
            이전 방문 기록을 바탕으로 광고를 게재할 수 있어요. Google의 광고 쿠키 사용은{" "}
            <a
              href="https://policies.google.com/technologies/ads?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-gold-light)] underline"
            >
              Google 광고 정책 페이지
            </a>
            에서 자세히 확인할 수 있고,{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-gold-light)] underline"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 언제든 거부할 수 있어요.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-sm font-bold text-[color:var(--color-gold-light)]">3. 제3자 제공</h2>
          <p>
            서버에 개인정보를 저장하지 않기 때문에, 이용자의 사주 입력 정보를 제3자에게 판매하거나 제공하지 않아요.
            다만 광고 게재 과정에서 Google 등 광고 제휴사가 자체적으로 쿠키·기기 정보를 수집할 수 있으며, 이는 위
            2항의 Google 정책을 따라요.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-sm font-bold text-[color:var(--color-gold-light)]">4. 이용자의 권리</h2>
          <p>
            브라우저 설정에서 쿠키 저장을 차단하거나 기존 쿠키를 삭제할 수 있고, 개발자 도구 또는 브라우저 설정에서
            언제든 로컬/세션 저장소를 초기화할 수 있어요.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-sm font-bold text-[color:var(--color-gold-light)]">5. 방침 변경</h2>
          <p>이 방침은 서비스 개선이나 법령 변경에 따라 수정될 수 있으며, 변경 시 이 페이지에 반영해요.</p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주 무료로 보러 가기
      </Link>
    </div>
  );
}
