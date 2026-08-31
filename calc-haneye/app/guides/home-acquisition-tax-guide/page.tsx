import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { pageMetadata } from "@/lib/utils/seo";

const PATH = "/guides/home-acquisition-tax-guide";

export const metadata: Metadata = pageMetadata({
  title: "주택 취득세 계산 전 확인할 조건",
  description:
    "취득가액, 취득 형태, 보유 주택 수, 감면 여부 등 취득세 계산 전에 확인할 조건을 안내합니다.",
  path: PATH,
});

const sections = [
  { id: "price", label: "1. 취득가액" },
  { id: "type", label: "2. 취득 형태" },
  { id: "home-count", label: "3. 보유 주택 수" },
  { id: "reduction", label: "4. 감면 여부" },
  { id: "property-type", label: "5. 주택 종류와 공동취득 여부" },
  { id: "bands", label: "6억/9억 구간의 기본세율 구조" },
  { id: "other-taxes", label: "지방교육세·농어촌특별세 등 별도 요소" },
];

const faqs = [
  {
    question: "취득가액은 실거래가 기준인가요?",
    answer:
      "일반적으로 취득세는 실제 거래가액과 시가표준액 등을 비교해 정해진 과세표준을 기준으로 계산됩니다. 이 계산기는 사용자가 입력한 취득가액을 그대로 과세표준으로 가정한 단순 참고 계산이므로, 정확한 과세표준은 위택스 또는 관할 지방자치단체를 통해 확인해야 합니다.",
  },
  {
    question: "조정대상지역 여부도 입력해야 하나요?",
    answer:
      "이 계산기는 조정대상지역 여부를 입력받지 않습니다. 다주택·규제지역 중과세율은 1차 지원 범위 밖이며, 1주택 외 조건을 선택하면 수치 결과 대신 범위 밖 안내가 표시됩니다.",
  },
  {
    question: "공동명의로 취득하면 세액이 어떻게 달라지나요?",
    answer:
      "공동취득·지분취득은 지분 비율에 따라 개별 취득세 산정 방식이 달라질 수 있어 이 계산기의 1차 지원 범위에 포함되지 않습니다. 공동명의로 취득하는 경우 관할 지방자치단체 또는 세무전문가에게 확인하는 것이 좋습니다.",
  },
  {
    question: "오피스텔이나 상가도 이 계산기로 계산할 수 있나요?",
    answer:
      "계산할 수 없습니다. 이 계산기는 주택 취득만을 대상으로 하며, 오피스텔·토지·상가 등은 세율 체계가 달라 1차 지원 범위 밖으로 안내됩니다.",
  },
];

export default function HomeAcquisitionTaxGuidePage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "홈", href: "/" },
          { label: "계산 가이드", href: "/guides" },
          { label: "주택 취득세 계산 가이드" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
        주택 취득세 계산 전 확인할 조건
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
        주택 취득세는 취득가액뿐 아니라 취득 형태, 보유 주택 수, 감면 여부
        등 여러 조건에 따라 크게 달라집니다. 계산 전에 아래 조건을 먼저
        확인해 보세요.
      </p>

      <nav aria-label="목차" className="mt-6 rounded-card border border-hairline bg-white p-4">
        <p className="text-sm font-semibold text-ink">목차</p>
        <ul className="mt-2 space-y-1 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-brand hover:underline">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-ink-soft sm:text-base">
        <section id="price">
          <h2 className="text-lg font-bold text-ink">1. 취득가액</h2>
          <p className="mt-2">
            취득세율 구간과 세액은 취득가액에 따라 달라집니다. 실제 계약서상
            거래가액과 과세표준을 정확히 확인해야 합니다.
          </p>
        </section>

        <section id="type">
          <h2 className="text-lg font-bold text-ink">2. 취득 형태</h2>
          <p className="mt-2">
            매매 등 개인 유상취득인지, 상속·증여·법인 취득인지에 따라 적용
            세율과 계산 방식이 크게 달라집니다. 이 계산기는 개인·유상취득만
            수치로 계산합니다.
          </p>
        </section>

        <section id="home-count">
          <h2 className="text-lg font-bold text-ink">3. 보유 주택 수</h2>
          <p className="mt-2">
            세대 기준 보유 주택 수에 따라 다주택 중과세율이 적용될 수
            있습니다. 이 계산기는 1주택인 경우만 기본세율로 계산합니다.
          </p>
        </section>

        <section id="reduction">
          <h2 className="text-lg font-bold text-ink">4. 감면 여부</h2>
          <p className="mt-2">
            생애최초 주택 구입 등 각종 감면 요건을 충족하면 실제 납부세액이
            달라질 수 있습니다. 이 계산기는 감면 미적용 조건만 수치로
            계산합니다.
          </p>
        </section>

        <section id="property-type">
          <h2 className="text-lg font-bold text-ink">
            5. 주택 종류와 공동취득 여부
          </h2>
          <p className="mt-2">
            오피스텔, 토지, 상가 등은 주택과 세율 체계가 다르며, 공동취득·지분
            취득은 지분 비율에 따라 세액 산정 방식이 달라집니다. 이
            계산기는 단독 명의의 주택 취득만 수치로 계산합니다.
          </p>
        </section>

        <section id="bands">
          <h2 className="text-lg font-bold text-ink">
            6억/9억 구간의 기본세율 구조
          </h2>
          <p className="mt-2">
            일반 1주택 유상취득 기준으로 취득가액 6억 원 이하는 1%, 9억 원
            초과는 3%가 적용되며, 그 사이 구간은 취득가액에 비례해 세율이
            단계적으로 늘어나는 구간세율 공식이 적용됩니다.
          </p>
        </section>

        <section id="other-taxes">
          <h2 className="text-lg font-bold text-ink">
            지방교육세·농어촌특별세 등 별도 요소
          </h2>
          <p className="mt-2">
            실제 납부세액에는 기본 취득세 외에 지방교육세, 농어촌특별세 등
            부가세목이 추가로 포함될 수 있습니다. 이 계산기는 기본 취득세만
            계산하므로, 정확한 총 납부세액은 위택스에서 확인해야 합니다.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <CalculationNotice>
          이 가이드는 일반적인 개념 이해를 돕기 위한 참고 정보이며, 실제
          납부 전에는 위택스, 관할 지방자치단체 또는 세무전문가의 최신 안내를
          확인해야 합니다.
        </CalculationNotice>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">자주 묻는 질문</h2>
        <div className="mt-3">
          <Accordion items={faqs} />
        </div>
      </section>

      <div className="mt-10 rounded-card border border-hairline bg-white p-6 text-center">
        <p className="text-sm text-ink-soft">
          직접 계산해 보고 싶다면 주택 취득세 계산기를 이용해 보세요.
        </p>
        <div className="mt-4 flex justify-center">
          <Button href="/calculators/home-acquisition-tax">
            주택 취득세 계산기로 이동
          </Button>
        </div>
      </div>

      <p className="mt-8 text-xs text-ink-muted">
        <Link href="/disclaimer" className="underline underline-offset-2">
          면책고지
        </Link>
        도 함께 확인해 주세요.
      </p>
    </Container>
  );
}
