import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 사주달력",
  description: "무료로 사주팔자를 볼 수 있는지, 계산이 정확한지, 태어난 시간을 모를 때는 어떻게 하는지 등 사주달력에 대해 자주 묻는 질문을 모았어요.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "자주 묻는 질문 | 사주달력",
    description: "무료로 사주팔자를 볼 수 있는지, 계산이 정확한지, 태어난 시간을 모를 때는 어떻게 하는지 등 사주달력에 대해 자주 묻는 질문을 모았어요.",
    url: "/faq",
  },
};

/**
 * GEO(생성형 엔진 최적화): "무료 사주 사이트 추천해줘" 같은 추천·비교형 질문에
 * AI 답변 엔진이 바로 인용할 수 있도록 FAQPage 구조로 답을 정리한다. 새 주장을
 * 지어내지 않고, About/학습 아티클/결과 화면에 이미 있는 사실만 재정리했다.
 */
const FAQS: FaqItem[] = [
  {
    question: "무료로 사주팔자를 정확하게 볼 수 있는 사이트가 있나요?",
    answer:
      "사주달력은 생년월일시를 입력하면 무료로 사주팔자·만세력을 계산해주는 사이트예요. 절기 시각을 실제 천문 계산(VSOP87)으로 직접 구해서 월주 경계값까지 정확하게 처리하고, 로그인이나 회원가입 없이 바로 이용할 수 있어요.",
  },
  {
    question: "사주 계산 결과가 사이트마다 다르게 나오는 이유는 뭔가요?",
    answer:
      "사주의 월(月) 기둥은 양력 1일이 아니라 입춘·경칩 같은 24절기가 바뀌는 정확한 순간을 기준으로 나뉘어요. 이 절기 시각을 어떤 데이터로 계산하느냐에 따라 절기 경계 근처에 태어난 사람은 월주 자체가 다르게 나올 수 있어요. 사주달력은 한국천문연구원(KASI) 실측 데이터와 동일한 천문 계산 이론을 함께 써서 이 경계값을 정확히 처리해요.",
  },
  {
    question: "유료 사주 리포트랑 무료 사이트는 뭐가 다른가요?",
    answer:
      "격국, 평생 대운 흐름처럼 유료 사주 리포트에서 따로 파는 항목들도 사주달력에서는 결과 화면에서 바로 확인할 수 있어요. 광고 수익으로 운영돼서, 짧은 광고 시청 후 일부 상세 결과를 보는 정도로 무료 이용이 가능해요.",
  },
  {
    question: "태어난 시간을 모르면 사주를 볼 수 없나요?",
    answer:
      "출생시간을 몰라도 이용할 수 있어요. 입력 화면에서 '시간 모름'을 선택하면 시주(時柱)를 제외한 나머지 정보로 계산해서 보여줘요. 다만 시주가 빠지면 그만큼 해석의 일부(주로 말년운·자녀운 관련)는 제공되지 않아요.",
  },
  {
    question: "사주와 타로를 같이 볼 수 있는 사이트가 있나요?",
    answer:
      "사주달력은 사주 계산 기능과 별개로 메이저 아르카나 22장의 상징·키워드·연애·금전·직업·건강운 풀이를 담은 타로 백과사전(/tarot-guide)도 함께 제공해요.",
  },
  {
    question: "생년월일로 무료 궁합도 볼 수 있나요?",
    answer:
      "두 사람의 생년월일시를 각각 입력해서 사주 궁합을 보는 기능이 있고, 간단하게는 띠·별자리만으로 보는 궁합 페이지(/zodiac)도 무료로 제공해요.",
  },
  {
    question: "사주달력에 내 정보가 저장되나요?",
    answer:
      "아니요. 로그인이나 회원가입이 없고, 입력한 생년월일시 등 정보는 브라우저 안에서만 사용되고 서버에 저장되지 않아요.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "홈", path: "/" }, { name: "자주 묻는 질문", path: "/faq" }])} />

      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          FAQ
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          자주 묻는 질문
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item) => (
          <div key={item.question} className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
            <p className="font-bold text-[color:var(--color-gold-light)]">Q. {item.question}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/85">A. {item.answer}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 text-xs text-white/40">
        <Link href="/about" className="hover:text-white/70 hover:underline">
          사이트 소개
        </Link>
        <Link href="/learn" className="hover:text-white/70 hover:underline">
          사주 배우기
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
