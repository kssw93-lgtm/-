import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LoanInterestCalculator } from "@/components/calculators/LoanInterestCalculator";
import { AdSlot } from "@/components/ads/AdSlot";
import { Accordion } from "@/components/ui/Accordion";
import { absoluteUrl, pageMetadata } from "@/lib/utils/seo";

const PATH = "/calculators/loan-interest";

export const metadata: Metadata = pageMetadata({
  title: "대출 이자 계산기",
  description:
    "대출 원금, 금리, 기간, 상환 방식을 입력해 월 예상 납입액과 총 이자를 확인하세요.",
  path: PATH,
});

const faqs = [
  {
    question: "원리금균등상환과 원금균등상환의 차이는 무엇인가요?",
    answer:
      "원리금균등상환은 매월 동일한 금액(원금+이자)을 납입하며, 초기에는 이자 비중이 크고 갈수록 원금 비중이 커집니다. 원금균등상환은 매월 동일한 원금을 갚고 이자는 남은 원금에 비례해 줄어들어, 첫 달 납입액이 가장 크고 점차 감소합니다.",
  },
  {
    question: "연 이자율 0%도 계산할 수 있나요?",
    answer:
      "네, 계산할 수 있습니다. 연 이자율을 0으로 입력하면 이자 없이 원금만 대출 기간에 걸쳐 분할 상환하는 결과를 확인할 수 있습니다.",
  },
  {
    question: "실제 은행 대출 이자와 결과가 다른 이유는 무엇인가요?",
    answer:
      "이 계산기는 사용자가 입력한 원금, 가정 금리, 기간, 상환 방식만으로 계산합니다. 실제 대출은 우대금리, 변동금리, 거치기간, 중도상환수수료, 보증료, 인지세, DSR·LTV 등 다양한 조건의 영향을 받기 때문에 결과가 달라질 수 있습니다.",
  },
  {
    question: "중도상환수수료와 보증료도 포함되나요?",
    answer:
      "포함되지 않습니다. 이 계산기는 원금, 금리, 기간, 상환 방식만을 기준으로 한 이자와 원리금만 계산하며, 중도상환수수료·보증료·인지세 등 부대비용은 반영하지 않습니다.",
  },
];

export default function LoanInterestCalculatorPage() {
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "금융 계산기", href: "/finance" },
    { label: "대출 이자 계산기" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : absoluteUrl(PATH),
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "대출 이자 계산기",
    url: absoluteUrl(PATH),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Container className="py-10 sm:py-14">
      {[breadcrumbJsonLd, appJsonLd, faqJsonLd].map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
        대출 이자 계산기
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
        대출 원금, 금리, 기간, 상환 방식을 입력해 월 예상 납입액과 총 이자를
        확인하세요.
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        이 계산기는 사용자가 입력한 원금·금리·기간·상환 방식만을 기준으로
        계산하며, 별도의 실제 시장 금리 정보를 사용하지 않습니다.
      </p>

      <div className="mt-8">
        <LoanInterestCalculator />
      </div>

      <div className="mt-8">
        <AdSlot id="loan-interest-bottom" />
      </div>

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-ink">계산 기준</h2>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <p>
              월 이자율은 연 이자율을 12로 나눈 값을 사용하며, 상환 방식별로
              아래와 같이 계산합니다.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>원리금균등상환: 매월 동일한 원리금(원금+이자)을 납입</li>
              <li>원금균등상환: 매월 동일한 원금과, 남은 원금에 대한 이자를 함께 납입</li>
              <li>만기일시상환: 만기 전까지 이자만 납입하고, 만기에 원금을 일시 상환</li>
            </ul>
            <p>
              화면에 표시되는 금액은 원 단위로 반올림한 예상값이며, 다음
              항목은 포함하지 않습니다: 거치 기간, 변동금리, 우대금리, 대출
              실행일, 중도상환수수료, 인지세, 보증료, 대출 가능 여부,
              DSR·LTV, 실제 금융기관 상품 조건.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">사용 방법</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>대출 원금을 원 단위로 입력합니다.</li>
            <li>확인하고 싶은 연 이자율(%)을 입력합니다.</li>
            <li>대출 기간을 개월 수로 입력합니다.</li>
            <li>상환 방식을 선택한 뒤 계산하기 버튼을 누릅니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">가상 예시</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            대출 원금 1억 원, 연 이자율 4%, 대출 기간 36개월, 원리금균등상환을
            선택하면 매월 동일한 금액을 납입하며 총 이자와 총 상환액을 함께
            확인할 수 있습니다. 동일한 조건에서 상환 방식만 바꿔보면 방식별
            총 이자 차이를 비교해 볼 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">주의사항</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>이 결과는 참고용 예상 계산이며 확정 대출 조건이 아닙니다.</li>
            <li>실제 적용 금리, 우대금리, 부대비용은 금융기관과 상품별로 다릅니다.</li>
            <li>대출 가능 여부와 한도는 이 계산기로 판단할 수 없습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">자주 묻는 질문</h2>
          <div className="mt-3">
            <Accordion items={faqs} />
          </div>
        </section>

        <section className="rounded-card border border-hairline bg-white p-6">
          <h2 className="text-lg font-bold text-ink">관련 가이드</h2>
          <p className="mt-2 text-sm text-ink-soft">
            상환 방식별 특징이 궁금하다면 아래 가이드를 참고하세요.
          </p>
          <Link
            href="/guides/loan-interest-guide"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
          >
            대출 상환 방식, 무엇이 다를까요? 가이드 보기 →
          </Link>
        </section>
      </div>
    </Container>
  );
}
