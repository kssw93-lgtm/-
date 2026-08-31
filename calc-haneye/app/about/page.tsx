import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calculators } from "@/lib/constants/calculatorMetadata";
import { siteName } from "@/lib/constants/site";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "서비스 소개",
  description: `${siteName}가 제공하는 계산기와 서비스 원칙을 소개합니다.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "서비스 소개" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">서비스 소개</h1>

      <div className="mt-6 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base">
        <section>
          <h2 className="text-lg font-bold text-ink">{siteName}는 무엇을 제공하나요?</h2>
          <p className="mt-2">
            {siteName}는 한국 사용자가 대출 이자, 예상 퇴직금, 일반 1주택
            취득세를 로그인 없이 빠르게 계산해 볼 수 있는 무료 웹사이트입니다.
            입력값을 바탕으로 참고용 예상 결과를 즉시 확인할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">1차 제공 계산기</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {calculators.map((calculator) => (
              <li key={calculator.slug}>{calculator.title}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">서비스 원칙</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>쉽고 명확한 참고용 계산을 제공합니다.</li>
            <li>입력값을 서버나 데이터베이스에 저장하지 않습니다.</li>
            <li>로그인, 회원가입, 결제, 구독 기능을 두지 않습니다.</li>
            <li>계산기가 다루지 않는 조건은 정직하게 안내합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">결과 이용 시 유의사항</h2>
          <p className="mt-2">
            이 사이트의 모든 결과는 확정 세액, 확정 급여, 확정 대출 조건이
            아닙니다. 금융·세무·법률 자문을 대체하지 않으며, 실제 의사결정
            전에는 금융기관, 세무·노무 전문가 또는 관할기관의 최신 안내를
            확인해야 합니다.
          </p>
        </section>
      </div>
    </Container>
  );
}
