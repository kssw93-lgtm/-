import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HomeAcquisitionTaxCalculator } from "@/components/calculators/HomeAcquisitionTaxCalculator";
import { AdSlot } from "@/components/ads/AdSlot";
import { Accordion } from "@/components/ui/Accordion";
import { CalculatorMeta } from "@/components/calculator/CalculatorMeta";
import { absoluteUrl, pageMetadata } from "@/lib/utils/seo";
import { HOME_ACQUISITION_TAX_REFERENCE } from "@/lib/constants/taxRates";

const PATH = "/calculators/home-acquisition-tax";

export const metadata: Metadata = pageMetadata({
  title: "주택 취득세 계산기",
  description:
    "일반 1주택을 유상 취득하는 경우의 기본 취득세를 참고용으로 계산합니다.",
  path: PATH,
});

const faqs = [
  {
    question: "주택 취득세는 무엇을 기준으로 계산되나요?",
    answer:
      "이 계산기는 취득가액과 취득세 기본세율(개인·유상취득·일반 1주택·감면 미적용 기준)만으로 예상 기본 취득세를 계산합니다. 지방교육세, 농어촌특별세 등 부가세목은 포함하지 않습니다.",
  },
  {
    question: "6억 원과 9억 원 구간에서 세율은 어떻게 달라지나요?",
    answer:
      "취득가액이 6억 원 이하면 1%, 9억 원 초과면 3%가 적용됩니다. 6억 원 초과 9억 원 이하 구간은 취득가액에 비례해 1%에서 3% 사이로 세율이 단계적으로 늘어나는 구간세율 공식이 적용됩니다.",
  },
  {
    question: "생애최초 감면은 자동으로 적용되나요?",
    answer:
      "적용되지 않습니다. 이 계산기의 1차 버전은 감면 미적용 조건만 지원하며, 생애최초 주택 구입 등 감면 가능성이 있는 경우에는 수치를 계산하지 않고 추가 확인이 필요하다고 안내합니다.",
  },
  {
    question: "다주택자도 이 계산기를 사용할 수 있나요?",
    answer:
      "다주택자는 지역과 보유 주택 수에 따라 중과세율이 적용될 수 있어 1차 계산 범위 밖입니다. 보유 주택 수를 2주택 이상으로 선택하면 수치 결과 대신 범위 밖 안내가 표시됩니다.",
  },
  {
    question: "지방교육세와 농어촌특별세도 포함되나요?",
    answer:
      "포함되지 않습니다. 이 계산기는 기본 취득세만 산출하며, 지방교육세·농어촌특별세 등 부가세목은 별도로 확인해야 합니다.",
  },
];

export default function HomeAcquisitionTaxCalculatorPage() {
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "세금·부동산 계산기", href: "/property-tax" },
    { label: "주택 취득세 계산기" },
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
    name: "주택 취득세 계산기",
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
        주택 취득세 계산기
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
        일반 1주택을 유상 취득하는 경우의 기본 취득세를 참고용으로
        계산합니다.
      </p>
      <div className="mt-3">
        <CalculatorMeta
          effectiveDateLabel={`기준일: ${HOME_ACQUISITION_TAX_REFERENCE.effectiveDate}`}
          lastReviewedLabel={`최종 검토일: ${HOME_ACQUISITION_TAX_REFERENCE.lastReviewedAt}`}
        />
      </div>

      <div className="mt-8">
        <HomeAcquisitionTaxCalculator />
      </div>

      <div className="mt-8">
        <AdSlot id="home-acquisition-tax-bottom" />
      </div>

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-ink">계산 기준</h2>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <ul className="list-disc space-y-1 pl-5">
              <li>취득가액 6억 원 이하: 1%</li>
              <li>취득가액 6억 원 초과 9억 원 이하: 취득가액에 비례한 구간세율(1~3%)</li>
              <li>취득가액 9억 원 초과: 3%</li>
            </ul>
            <p>
              이 세율은 {HOME_ACQUISITION_TAX_REFERENCE.scope}에 한정됩니다.{" "}
              {HOME_ACQUISITION_TAX_REFERENCE.notes}
            </p>
            <p>
              출처: {HOME_ACQUISITION_TAX_REFERENCE.sourceName} (
              {HOME_ACQUISITION_TAX_REFERENCE.sourceUrl})
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">사용 방법</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>취득가액을 입력합니다.</li>
            <li>취득 형태, 보유 주택 수, 감면 적용 여부를 선택합니다.</li>
            <li>공동·지분 취득 여부와 주택 유형을 선택합니다.</li>
            <li>모든 조건이 1차 지원 범위 안이면 예상 기본 취득세가 계산됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">가상 예시</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            취득가액 7억 5천만 원, 개인·유상취득, 1주택, 감면 미적용, 공동취득
            아님, 주택 유형을 선택하면 적용 세율 2%, 예상 기본 취득세 1,500만
            원이 계산됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">주의사항</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>이 계산기는 기본 취득세만 산출하며 부가세목·감면·중과는 포함하지 않습니다.</li>
            <li>
              다주택, 법인 취득, 감면 가능성, 상속·증여, 공동취득, 오피스텔·토지·상가
              등은 수치를 계산하지 않고 별도 안내로 처리합니다.
            </li>
            <li>실제 납부세액은 위택스 또는 관할 지방자치단체를 통해 확인하세요.</li>
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
            취득세 계산 전 확인할 조건이 궁금하다면 아래 가이드를 참고하세요.
          </p>
          <Link
            href="/guides/home-acquisition-tax-guide"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
          >
            주택 취득세 계산 전 확인할 조건 가이드 보기 →
          </Link>
        </section>
      </div>
    </Container>
  );
}
