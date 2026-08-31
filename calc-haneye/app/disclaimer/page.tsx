import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteName } from "@/lib/constants/site";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "면책고지",
  description: `${siteName} 계산 결과 이용 시 반드시 확인해야 할 면책 고지입니다.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "면책고지" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">면책고지</h1>
      <p className="mt-2 text-xs text-ink-muted">최종 수정일: 2026-08-31</p>

      <div className="mt-6 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base">
        <section>
          <h2 className="text-lg font-bold text-ink">모든 결과는 참고용 예상 계산입니다</h2>
          <p className="mt-2">
            {siteName}의 대출 이자, 퇴직금, 주택 취득세 계산기가 제공하는
            모든 수치는 사용자가 입력한 값을 기준으로 산출한 참고용 예상
            계산입니다. 확정된 대출 조건, 확정 급여, 확정 세액이 아닙니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">금융·세무·법률 자문이 아닙니다</h2>
          <p className="mt-2">
            {siteName}는 금융, 세무, 노무, 법률 자문을 제공하지 않습니다.
            계산 결과나 안내 문구를 특정 금융상품 가입, 세금 신고·납부, 퇴직금
            수령, 계약 체결의 근거로 단독 사용해서는 안 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">제도와 기준은 변경될 수 있습니다</h2>
          <p className="mt-2">
            대출 금리, 취득세율 등 세제, 근로 조건, 금융상품 조건은 법령
            개정이나 정책 변화에 따라 예고 없이 변경될 수 있습니다. 본
            사이트에 표시된 기준일 이후 제도가 변경되었을 수 있으므로, 반드시
            최신 공식 자료를 함께 확인해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">
            입력값의 정확성에 따라 결과가 달라집니다
          </h2>
          <p className="mt-2">
            계산 결과의 정확도는 사용자가 입력한 값의 정확성에 크게
            좌우됩니다. 원금, 금리, 기간, 임금, 날짜, 취득가액 등을 잘못
            입력하면 실제와 다른 결과가 표시될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">실제 절차 전 확인 권장</h2>
          <p className="mt-2">
            실제 대출 계약, 세금 신고·납부, 퇴직금 수령 등 의사결정을 하기
            전에는 반드시 금융기관, 고용노동부, 위택스, 관할 지방자치단체,
            또는 세무·노무 전문가를 통해 최신 공식 안내를 확인하시기
            바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">책임의 한계</h2>
          <p className="mt-2">
            {siteName}는 본 계산기 이용으로 발생한 직접적·간접적 손해에
            대해 관계 법령이 허용하는 범위에서 책임을 지지 않습니다.
          </p>
        </section>
      </div>
    </Container>
  );
}
