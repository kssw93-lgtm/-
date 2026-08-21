import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사이트 소개 | 천기누설",
  description: "천기누설은 어떤 사이트이고, 어떻게 무료로 운영되는지 소개합니다.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          About
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          천기누설 소개
        </h1>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-[15px] leading-relaxed text-white/85">
        <p>
          천기누설은 생년월일시를 입력하면 사주팔자를 계산하고, 그 결과를 연애운·재회운·직업운·재물운·종합사주·궁합 등
          다양한 주제로 풀어서 보여주는 무료 사주 서비스예요.
        </p>
        <p>
          <strong className="text-[color:var(--color-gold-light)]">계산은 실제 명리학 규칙과 천문 데이터를 기반으로 해요.</strong>
          {" "}
          연월일시로부터 천간·지지·오행·십신·격국·신살·대운/세운/월운까지 정해진 규칙에 따라 계산하고, 그 계산 결과에
          맞춰 미리 준비된 해석 문장을 매칭해서 보여드려요. 그래서 같은 생년월일시와 같은 항목을 다시 확인해도 항상
          같은(또는 같은 범주의) 결과가 나와요 — 매번 다른 말을 지어내는 방식이 아니에요.
        </p>
        <p>
          <strong className="text-[color:var(--color-gold-light)]">로그인도, 서버 저장도 없어요.</strong> 입력하신 생년월일시 등
          정보는 이 브라우저 안에서만 사용되고, 저희 서버에 저장되지 않아요. 계정을 만들 필요도 없어요.
        </p>
        <p>
          <strong className="text-[color:var(--color-gold-light)]">무료로 운영하는 대신 광고가 포함돼요.</strong> 이 사이트는
          비용 없이 계속 운영하기 위해 광고 수익(Google 애드센스)으로 운영돼요. 일부 상세 결과는 짧은 광고 시청 후에
          열람할 수 있어요.
        </p>
        <p>
          <strong className="text-[color:var(--color-gold-light)]">말투도 골라볼 수 있어요.</strong> 같은 사주 해석이라도 딱딱하게
          듣고 싶은지, 친구처럼 편하게 듣고 싶은지, 조선시대풍으로 듣고 싶은지 골라서 볼 수 있어요. 다만 말투가
          달라져도 바탕이 되는 명리학적 해석 내용은 동일해요.
        </p>
        <p className="text-sm text-white/50">
          이 사이트의 결과는 전통 명리학 이론을 바탕으로 한 정보 제공 및 오락 콘텐츠이며, 의학적·법률적·재정적 전문
          상담을 대체하지 않아요. 중요한 결정은 관련 분야 전문가와 상담하시길 권해드려요.
        </p>
      </div>

      <div className="flex gap-3 text-xs text-white/40">
        <Link href="/learn" className="hover:text-white/70 hover:underline">
          사주 배우기
        </Link>
        <Link href="/privacy" className="hover:text-white/70 hover:underline">
          개인정보처리방침
        </Link>
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
