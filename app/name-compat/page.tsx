import { OG_IMAGES } from "@/lib/og";
import Link from "next/link";
import type { Metadata } from "next";
import NameCompatCalculator from "@/components/NameCompatCalculator";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이름궁합 무료로 확인하기 | 사주달력",
  description: "두 사람의 이름만으로 재미로 보는 이름궁합. 이름을 입력하면 궁합 점수와 한 줄 코멘트를 바로 확인할 수 있어요.",
  alternates: { canonical: "/name-compat" },
  openGraph: {
    images: OG_IMAGES,
    title: "이름궁합 무료로 확인하기 | 사주달력",
    description: "두 사람의 이름만으로 재미로 보는 이름궁합. 이름을 입력하면 궁합 점수와 한 줄 코멘트를 바로 확인할 수 있어요.",
    url: "/name-compat",
  },
};

export default function NameCompatPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "이름궁합", path: "/name-compat" },
        ])}
      />
      <div>
        <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          이름궁합 무료로 확인하기
        </h1>
        <p className="mt-2 text-sm text-white/50">
          궁금한 두 사람의 이름을 입력하면 바로 궁합 점수를 확인할 수 있어요.
        </p>
      </div>

      <NameCompatCalculator />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-white/40">
        ⚠️ 이름궁합은 실제 성명학이나 사주 계산에 기반한 결과가 아니라, 이름을 재료로 삼은 재미용
        콘텐츠예요. 진짜 궁합이 궁금하다면{" "}
        <Link href="/" className="text-[color:var(--color-gold-light)] underline">
          생년월일시로 보는 사주 궁합
        </Link>
        을 확인해보세요.
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 생년월일시로 진짜 궁합 보러 가기
      </Link>
    </div>
  );
}
