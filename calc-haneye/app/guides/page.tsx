import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "계산 가이드",
  description:
    "대출, 퇴직금, 주택 취득세 계산 전에 확인하면 좋은 내용을 안내합니다.",
  path: "/guides",
});

const guides = [
  {
    title: "대출 상환 방식, 무엇이 다를까요?",
    description: "원리금균등·원금균등·만기일시상환의 차이를 비교합니다.",
    href: "/guides/loan-interest-guide",
  },
  {
    title: "퇴직금 계산 전 확인할 5가지",
    description: "입사일부터 평균임금까지, 계산 전에 점검할 항목을 안내합니다.",
    href: "/guides/severance-pay-guide",
  },
  {
    title: "주택 취득세 계산 전 확인할 조건",
    description: "취득 형태, 보유 주택 수, 감면 여부 등 핵심 조건을 안내합니다.",
    href: "/guides/home-acquisition-tax-guide",
  },
];

export default function GuidesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "계산 가이드" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">계산 가이드</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
        계산기를 사용하기 전에 알아두면 좋은 기본 개념과 점검 항목을 안내합니다.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-base font-bold text-ink">{guide.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {guide.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
