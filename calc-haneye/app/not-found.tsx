import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Compass aria-hidden="true" className="h-10 w-10 text-brand" />
      <h1 className="text-2xl font-bold text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        요청하신 페이지가 존재하지 않거나 이동되었습니다. 주소를 다시 확인해
        주세요.
      </p>
      <Button href="/">홈으로 돌아가기</Button>
      <p className="text-xs text-ink-muted">
        찾으시는 계산기가 있다면{" "}
        <Link href="/finance" className="underline underline-offset-2">
          금융 계산기
        </Link>{" "}
        또는{" "}
        <Link href="/property-tax" className="underline underline-offset-2">
          세금·부동산 계산기
        </Link>{" "}
        목록을 확인해 보세요.
      </p>
    </Container>
  );
}
