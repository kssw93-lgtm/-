import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { contactEmail, siteName } from "@/lib/constants/site";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "문의",
  description: `${siteName}에 오류 제보나 개선 의견을 보내는 방법을 안내합니다.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "문의" }]} />
      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">문의</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
        계산 결과 오류 제보, 개선 의견, 서비스 관련 문의는 아래 이메일로 보내
        주세요.
      </p>

      <Card className="mt-6 flex items-center gap-3">
        <Mail aria-hidden="true" className="h-5 w-5 text-brand" />
        <a
          href={`mailto:${contactEmail}`}
          className="text-base font-semibold text-brand hover:underline"
        >
          {contactEmail}
        </a>
      </Card>

      <p className="mt-6 text-xs leading-relaxed text-ink-muted">
        현재 {siteName}는 별도의 문의 폼이나 자동 메일 전송 기능 없이, 위
        이메일 주소를 통한 직접 연락만 지원합니다. 세무·법률 자문이 필요한
        내용은 답변드릴 수 없으니 관련 전문가 또는 관할기관에 문의해 주세요.
      </p>
    </Container>
  );
}
