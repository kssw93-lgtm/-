import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | 천기누설",
  description: "천기누설에 궁금한 점이나 오류를 알려주세요.",
};

// TODO: 공개해도 괜찮은 문의용 연락처(전용 이메일 등)로 교체해주세요.
const CONTACT_EMAIL = "contact@example.com";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          Contact
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">문의하기</h1>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-[15px] leading-relaxed text-white/85">
        <p>결과가 이상하거나, 건의하고 싶은 기능이 있거나, 제휴·광고 관련 문의가 있다면 아래 이메일로 편하게 연락해 주세요.</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block w-fit rounded-full bg-[color:var(--color-gold)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--color-gold-light)]"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-sm text-white/50">
          개인정보 관련 문의도 같은 채널로 받고 있어요. 자세한 내용은{" "}
          <Link href="/privacy" className="text-[color:var(--color-gold-light)] underline">
            개인정보처리방침
          </Link>
          을 확인해 주세요.
        </p>
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
