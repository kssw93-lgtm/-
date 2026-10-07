import { OG_IMAGES } from "@/lib/og";
import Link from "next/link";
import type { Metadata } from "next";
import NamingGuideCalculator from "@/components/NamingGuideCalculator";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "아기 이름 짓기 — 출생 후 사주 오행 작명 가이드 | 사주달력",
  description: "신생아 출생 신고 전, 정확한 생년월일시로 사주에 부족한 오행을 찾아 이름에 보완하면 좋은 발음오행과 예시 이름을 무료로 확인하세요.",
  alternates: { canonical: "/naming" },
  openGraph: {
    images: OG_IMAGES,
    title: "아기 이름 짓기 — 출생 후 사주 오행 작명 가이드 | 사주달력",
    description: "신생아 출생 신고 전, 정확한 생년월일시로 사주에 부족한 오행을 찾아 이름에 보완하면 좋은 발음오행과 예시 이름을 무료로 확인하세요.",
    url: "/naming",
  },
};

export default function NamingPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "아기 이름 짓기", path: "/naming" },
        ])}
      />
      <div>
        <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          아기 이름 짓기 — 사주 오행 작명 가이드
        </h1>
        <p className="mt-2 text-sm text-white/50">
          출생 신고 전 아기의 정확한 생년월일시를 입력하면, 실제 사주 원국에 부족한 오행을 찾아 이름에
          담으면 좋은 소리(발음오행)와 예시 이름을 알려드려요.
        </p>
        <p className="mt-2 text-xs text-white/35">
          💡 사주 기반 작명은 실제 태어난 순간의 사주로 부족한 오행을 찾는 방식이라, 출산 전이 아니라
          아기가 태어난 뒤(출생 신고 기한인 한 달 이내) 활용하는 도구예요. 정확한 시간을 모르면 &lsquo;시간
          모름&rsquo;을 선택해도 계산할 수 있어요.
        </p>
      </div>

      <NamingGuideCalculator />

      <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <h2 className="mb-2 text-sm font-bold text-[color:var(--color-gold-light)]">발음오행 작명이란?</h2>
        <p className="text-[15px] leading-relaxed text-white/80">
          이름 첫 글자의 초성이 어느 오행에 속하는지로 사주에 부족한 기운을 보완하는 전통 작명 방식이에요.
          이 페이지는 훈민정음 해례본 제자해의 아설순치후(牙舌脣齒喉) 오행 배속을 기준으로 삼아요 — 아음(ㄱㅋ)은
          목, 설음(ㄴㄷㄹㅌ)은 화, 순음(ㅁㅂㅍ)은 토, 치음(ㅅㅈㅊ)은 금, 후음(ㅇㅎ)은 수로 봐요.
        </p>
        <p className="mt-3 text-xs text-white/40">
          ⚠️ 실제 작명소에서는 여기에 획수 성명학(81수리), 한자의 뜻(자원오행)까지 함께 고려하는 경우가
          많고, 발음오행의 기준 자체도 작명소마다 다를 수 있어요. 이 결과는 여러 작명 방식 중 하나를 참고용으로
          보여드리는 것이니, 실제 이름을 정할 때는 참고 자료 중 하나로만 활용해주세요.
        </p>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 사주도 자세히 보러 가기
      </Link>
    </div>
  );
}
