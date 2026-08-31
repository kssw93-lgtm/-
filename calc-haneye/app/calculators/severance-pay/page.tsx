import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SeverancePayCalculator } from "@/components/calculators/SeverancePayCalculator";
import { AdSlot } from "@/components/ads/AdSlot";
import { Accordion } from "@/components/ui/Accordion";
import { absoluteUrl, pageMetadata } from "@/lib/utils/seo";

const PATH = "/calculators/severance-pay";

export const metadata: Metadata = pageMetadata({
  title: "퇴직금 계산기",
  description:
    "입사일, 퇴사일, 최근 3개월 임금 정보를 바탕으로 예상 퇴직금을 확인하세요.",
  path: PATH,
});

const faqs = [
  {
    question: "퇴직금은 언제 받을 수 있나요?",
    answer:
      "일반적으로 계속근로기간 1년 이상인 근로자가 퇴직할 때 지급 대상이 됩니다. 정확한 지급 시기와 요건은 근로기준법 및 관련 규정, 근로계약·취업규칙에 따라 다르므로 고용노동부 또는 관할기관 안내를 확인하세요.",
  },
  {
    question: "1년 미만 근무하면 계산 결과가 왜 참고용인가요?",
    answer:
      "계속근로기간이 1년 미만이면 법정 퇴직금 수급 요건을 충족하지 않을 수 있습니다. 이 계산기는 참고용 수치를 함께 보여주지만, 실제 지급 여부는 근로 형태와 계약 조건에 따라 달라질 수 있어 별도로 확인해야 합니다.",
  },
  {
    question: "상여금과 연차수당은 포함해야 하나요?",
    answer:
      "상여금과 미사용 연차수당이 평균임금 산정에 포함되는지는 실제 임금 구성과 법정 기준에 따라 달라집니다. 이 계산기는 사용자가 반영 여부를 직접 선택할 수 있는 단순 참고 옵션만 제공하며, 실제 법정 산정 방식과 차이가 날 수 있습니다.",
  },
  {
    question: "실제 퇴직금과 계산 결과가 다를 수 있나요?",
    answer:
      "네, 다를 수 있습니다. 실제 퇴직금은 평균임금·통상임금 판단, 휴직·결근, 중간정산, 퇴직연금 가입 여부, 근로계약 및 취업규칙 등 다양한 조건에 따라 달라집니다.",
  },
];

export default function SeverancePayCalculatorPage() {
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "금융 계산기", href: "/finance" },
    { label: "퇴직금 계산기" },
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
    name: "퇴직금 계산기",
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
        퇴직금 계산기
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
        입사일, 퇴사일, 최근 3개월 임금 정보를 바탕으로 예상 퇴직금을
        확인하세요.
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        이 계산기는 평균임금 산정 원칙에 대한 단순화된 참고 계산을 제공하며,
        법령 자문을 대체하지 않습니다.
      </p>

      <div className="mt-8">
        <SeverancePayCalculator />
      </div>

      <div className="mt-8">
        <AdSlot id="severance-pay-bottom" />
      </div>

      <div className="mt-14 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-ink">계산 기준</h2>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <p>
              계속근로일수는 입사일과 퇴사일을 모두 포함해 계산하며, 계속근로
              1년에 대해 평균임금 30일분 이상을 지급한다는 기본 원칙을
              참고해 다음 계산식을 사용합니다.
            </p>
            <p className="rounded-lg bg-surface-subtle px-4 py-3 font-medium text-ink">
              예상 퇴직금 = 1일 평균임금 × 30일 × (계속근로일수 ÷ 365)
            </p>
            <p>
              1일 평균임금은 입력한 퇴직 전 3개월 임금 합계를 입력한 3개월
              일수로 나눈 값입니다. 연간 상여금과 미사용 연차수당은
              사용자가 반영을 선택한 경우에만 3개월 환산액으로 단순
              합산되며, 실제 법정 산정 방식과 차이가 날 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">사용 방법</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>입사일과 퇴사일을 입력합니다.</li>
            <li>퇴직 전 3개월 임금 합계를 입력합니다.</li>
            <li>퇴직 전 3개월의 실제 역일수를 확인해 입력합니다(기본값 92일).</li>
            <li>필요한 경우 상여금·연차수당 반영 여부를 선택한 뒤 계산합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">가상 예시</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            2022년 1월 1일 입사, 2025년 1월 1일 퇴사, 퇴직 전 3개월 임금
            합계 900만 원, 3개월 일수 92일을 입력하면 1일 평균임금과 재직
            기간을 기준으로 한 예상 퇴직금을 확인할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">주의사항</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>이 결과는 참고용 예상 계산이며 확정 퇴직금이 아닙니다.</li>
            <li>계속근로 1년 미만인 경우 법정 수급 요건을 충족하지 않을 수 있습니다.</li>
            <li>
              휴직·결근, 중간정산, 퇴직연금, 근로계약·취업규칙 등의 조건은
              반영하지 않습니다.
            </li>
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
            퇴직금 계산 전 확인할 항목이 궁금하다면 아래 가이드를 참고하세요.
          </p>
          <Link
            href="/guides/severance-pay-guide"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
          >
            퇴직금 계산 전 확인할 5가지 가이드 보기 →
          </Link>
        </section>
      </div>
    </Container>
  );
}
