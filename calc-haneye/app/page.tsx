import Link from "next/link";
import {
  Calculator,
  House,
  Landmark,
  Lock,
  Receipt,
  ScrollText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorCard } from "@/components/CalculatorCard";
import {
  getCalculatorsByCategory,
} from "@/lib/constants/calculatorMetadata";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata = pageMetadata({
  title: "계산한눈에 - 대출 이자·퇴직금·취득세 계산기",
  description:
    "대출 이자, 퇴직금, 주택 취득세를 입력값 기반으로 빠르게 계산하는 무료 생활 금융 계산기.",
  path: "/",
});

const financeCalculators = getCalculatorsByCategory("finance");
const propertyTaxCalculators = getCalculatorsByCategory("property-tax");
const popularCalculators = [...financeCalculators, ...propertyTaxCalculators];

const trustItems = [
  {
    icon: Lock,
    title: "로그인 없이 바로 계산",
    description: "회원가입이나 로그인 절차 없이 바로 계산기를 이용할 수 있습니다.",
  },
  {
    icon: ShieldCheck,
    title: "입력값을 서버에 저장하지 않음",
    description: "입력하신 값은 브라우저에서만 계산되며 서버로 전송·저장되지 않습니다.",
  },
  {
    icon: ScrollText,
    title: "기준과 한계를 함께 안내",
    description: "각 계산기가 다루는 조건과 다루지 않는 조건을 명확히 안내합니다.",
  },
];

const guideCards = [
  {
    title: "대출 상환 방식 이해하기",
    href: "/guides/loan-interest-guide",
  },
  {
    title: "퇴직금 계산 시 확인할 항목",
    href: "/guides/severance-pay-guide",
  },
  {
    title: "주택 취득세 계산 전 체크할 조건",
    href: "/guides/home-acquisition-tax-guide",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-hairline bg-white">
        <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              복잡한 금융·세금 계산,
              <br />
              필요한 숫자만 빠르게.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              대출 이자, 퇴직금, 주택 취득세를 입력값 기반으로 간편하게 계산해
              보세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/calculators/loan-interest" size="lg">
                대출 이자 계산하기
              </Button>
              <Button
                href="/calculators/home-acquisition-tax"
                variant="secondary"
                size="lg"
              >
                취득세 계산하기
              </Button>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
            <HeroIconTile icon={Calculator} label="빠른 계산" className="translate-y-4" />
            <HeroIconTile icon={Landmark} label="대출 이자" />
            <HeroIconTile icon={House} label="취득세" />
            <HeroIconTile
              icon={WalletCards}
              label="퇴직금"
              className="translate-y-4"
            />
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-ink">많이 찾는 계산기</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCalculators.map((calculator) => (
              <CalculatorCard key={calculator.slug} calculator={calculator} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-hairline bg-white py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2">
            <CategoryBlock
              title="금융 계산기"
              icon={Landmark}
              items={financeCalculators}
            />
            <CategoryBlock
              title="세금·부동산 계산기"
              icon={Receipt}
              items={propertyTaxCalculators}
            />
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-ink">필요한 계산만, 부담 없이</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {trustItems.map((item) => (
              <Card key={item.title}>
                <item.icon aria-hidden="true" className="h-6 w-6 text-brand" />
                <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline bg-white py-14 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-ink">
            계산 전에 알아두면 좋은 내용
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {guideCards.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block rounded-card border border-hairline bg-white p-5 shadow-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <h3 className="text-base font-bold text-ink">{guide.title}</h3>
                <span className="mt-3 inline-block text-sm font-semibold text-brand">
                  가이드 보기 →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            지금 필요한 계산부터 시작하세요.
          </h2>
          <div className="mt-6 flex justify-center">
            <Button href="/calculators/loan-interest" size="lg">
              대출 이자 계산기로 이동
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function HeroIconTile({
  icon: Icon,
  label,
  className = "",
}: {
  icon: typeof Calculator;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-card border border-hairline bg-white shadow-card ${className}`}
    >
      <Icon aria-hidden="true" className="h-8 w-8 text-brand" />
      <span className="text-xs font-medium text-ink-soft">{label}</span>
    </div>
  );
}

function CategoryBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Landmark;
  items: ReturnType<typeof getCalculatorsByCategory>;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-brand" />
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {item.title}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
