import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { CalculationNotice } from "@/components/calculator/CalculationNotice";
import { pageMetadata } from "@/lib/utils/seo";

const PATH = "/guides/loan-interest-guide";

export const metadata: Metadata = pageMetadata({
  title: "대출 상환 방식, 무엇이 다를까요?",
  description:
    "원리금균등상환, 원금균등상환, 만기일시상환의 차이와 월 납입 흐름을 비교합니다.",
  path: PATH,
});

const sections = [
  { id: "equal-payment", label: "원리금균등상환" },
  { id: "equal-principal", label: "원금균등상환" },
  { id: "bullet-payment", label: "만기일시상환" },
  { id: "comparison", label: "월 납입 흐름 비교" },
  { id: "who", label: "어떤 방식을 살펴볼까요" },
];

const faqs = [
  {
    question: "상환 방식은 나중에 바꿀 수 있나요?",
    answer:
      "일반적으로 상환 방식은 대출 실행 시 정해지며, 이후 변경은 금융기관과 상품 약관에 따라 가능 여부가 다릅니다. 정확한 변경 가능 여부는 이용 중인 금융기관에 확인해야 합니다.",
  },
  {
    question: "총 이자가 가장 적은 방식은 무엇인가요?",
    answer:
      "동일한 원금·금리·기간이라면 일반적으로 원금균등상환의 총 이자가 가장 적고, 만기일시상환의 총 이자가 가장 많은 경향이 있습니다. 다만 실제 상품 조건에 따라 달라질 수 있으므로 계산기로 직접 비교해 보는 것이 좋습니다.",
  },
  {
    question: "초기 상환 부담이 적은 방식은 무엇인가요?",
    answer:
      "원리금균등상환은 매월 동일한 금액을 납입해 예측이 쉽고, 만기일시상환은 만기 전까지 이자만 납입해 월 부담이 가장 적은 편입니다. 다만 만기일시상환은 만기에 원금 전액을 한 번에 상환해야 하는 부담이 있습니다.",
  },
  {
    question: "계산기로 무엇을 미리 확인할 수 있나요?",
    answer:
      "대출 이자 계산기를 사용하면 동일한 원금·금리·기간 조건에서 상환 방식별 월 납입액, 총 상환액, 총 이자를 미리 비교해 볼 수 있습니다. 다만 실제 상품 조건과는 차이가 있을 수 있습니다.",
  },
];

export default function LoanInterestGuidePage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "홈", href: "/" },
          { label: "계산 가이드", href: "/guides" },
          { label: "대출 상환 방식 가이드" },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
        대출 상환 방식, 무엇이 다를까요?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
        대출은 상환 방식에 따라 매월 납입액과 총 이자가 크게 달라집니다. 세
        가지 대표적인 상환 방식의 특징을 비교해 보세요.
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
        <section id="equal-payment">
          <h2 className="text-lg font-bold text-ink">원리금균등상환</h2>
          <p className="mt-2">
            매월 동일한 금액(원금+이자)을 납입하는 방식입니다. 초기에는 이자
            비중이 크고, 시간이 지날수록 원금 비중이 커집니다. 매월 납입액이
            일정해 예산 관리가 쉬운 편입니다.
          </p>
        </section>

        <section id="equal-principal">
          <h2 className="text-lg font-bold text-ink">원금균등상환</h2>
          <p className="mt-2">
            매월 동일한 원금을 상환하고, 이자는 남은 원금에 비례해 계산되어
            점차 줄어드는 방식입니다. 첫 달 납입액이 가장 크고 만기에 가까울
            수록 납입액이 줄어듭니다.
          </p>
        </section>

        <section id="bullet-payment">
          <h2 className="text-lg font-bold text-ink">만기일시상환</h2>
          <p className="mt-2">
            만기 전까지는 매월 이자만 납입하고, 만기에 원금 전액을 한 번에
            상환하는 방식입니다. 월 납입 부담은 가장 적지만, 만기 시 목돈
            상환 부담이 있습니다.
          </p>
        </section>

        <section id="comparison">
          <h2 className="text-lg font-bold text-ink">월 납입 흐름 비교</h2>
          <p className="mt-2">
            동일한 원금·금리·기간을 기준으로 하면, 초기 월 납입액은
            원금균등상환이 가장 크고 만기일시상환이 가장 적은 경향이
            있습니다. 반대로 총 이자는 원금균등상환이 가장 적고 만기일시상환이
            가장 많은 경향이 있습니다. 정확한 수치는 대출 이자 계산기로 직접
            비교해 보세요.
          </p>
        </section>

        <section id="who">
          <h2 className="text-lg font-bold text-ink">어떤 방식을 살펴볼 수 있나요</h2>
          <p className="mt-2">
            매월 일정한 예산 관리를 원한다면 원리금균등상환을, 총 이자를
            줄이고 싶고 초기 상환 여력이 있다면 원금균등상환을, 초기 상환
            부담을 최소화하고 싶다면 만기일시상환을 살펴볼 수 있습니다. 다만
            실제 선택은 소득, 자금 계획, 금융기관 상품 조건을 종합적으로
            고려해야 합니다.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <CalculationNotice>
          위 설명은 일반적인 경향을 안내하는 참고 정보이며, 실제 상품 조건과
          금리는 금융기관별로 다를 수 있습니다. 정확한 조건은 이용 중이거나
          이용 예정인 금융기관에 확인하세요.
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
          직접 계산해 보고 싶다면 대출 이자 계산기를 이용해 보세요.
        </p>
        <div className="mt-4 flex justify-center">
          <Button href="/calculators/loan-interest">대출 이자 계산기로 이동</Button>
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
