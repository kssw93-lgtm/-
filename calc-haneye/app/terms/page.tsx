import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteName } from "@/lib/constants/site";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "이용약관",
  description: `${siteName}의 이용약관입니다.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "이용약관" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">이용약관</h1>
      <p className="mt-2 text-xs text-ink-muted">최종 수정일: 2026-08-31</p>

      <div className="mt-6 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base">
        <section>
          <h2 className="text-lg font-bold text-ink">1. 서비스 이용 목적</h2>
          <p className="mt-2">
            {siteName}는 대출 이자, 퇴직금, 주택 취득세를 참고용으로
            계산해 볼 수 있는 무료 계산 도구를 제공합니다. 본 서비스는
            금융·세무·법률 자문을 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. 서비스의 성격</h2>
          <p className="mt-2">
            본 서비스가 제공하는 모든 계산 결과는 사용자가 입력한 값을
            기준으로 산출된 참고용 예상 계산입니다. 실제 금융상품 조건, 급여,
            세액과 다를 수 있으며, 이를 근거로 한 계약·신고·납부·의사결정에
            대한 책임은 사용자 본인에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. 금지 행위</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>서비스를 무단으로 복제, 크롤링하여 상업적으로 재배포하는 행위</li>
            <li>계산 결과를 확정된 법적·금융적 사실인 것처럼 허위로 안내하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. 서비스 변경 가능성</h2>
          <p className="mt-2">
            {siteName}는 서비스 개선을 위해 계산기 기능, 화면 구성, 콘텐츠를
            사전 고지 없이 변경, 중단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">5. 책임 제한</h2>
          <p className="mt-2">
            {siteName}는 무료로 제공되는 참고용 계산 서비스이며, 계산 결과의
            정확성, 최신성, 특정 목적에의 적합성을 보증하지 않습니다. 서비스
            이용으로 발생한 손해에 대해 관계 법령이 허용하는 범위에서 책임을
            지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">6. 약관 변경</h2>
          <p className="mt-2">
            본 약관은 필요 시 개정될 수 있으며, 개정 시 본 페이지를 통해
            공지합니다.
          </p>
        </section>
      </div>
    </Container>
  );
}
