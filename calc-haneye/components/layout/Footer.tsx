import Link from "next/link";
import { Container } from "./Container";
import { contactEmail, siteName } from "@/lib/constants/site";

const footerLinks = [
  { label: "서비스 소개", href: "/about" },
  { label: "문의", href: "/contact" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
  { label: "면책고지", href: "/disclaimer" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-surface-subtle">
      <Container className="py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-bold text-ink">{siteName}</p>
            <p className="mt-1 text-sm text-ink-soft">
              금융·세금 계산은 참고용 예상 결과입니다.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              문의:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="underline underline-offset-2 hover:text-ink"
              >
                {contactEmail}
              </a>
            </p>
          </div>

          <nav aria-label="정책 및 안내" className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-soft hover:text-ink hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-ink-muted">
          제도와 기준은 변경될 수 있습니다. 실제 계약·신고·의사결정 전에는 금융기관,
          세무전문가, 고용노동부 또는 관할기관의 최신 안내를 확인하세요.
        </p>

        <p className="mt-4 text-xs text-ink-muted">
          © {year} {siteName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
