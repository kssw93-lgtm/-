import { OG_IMAGES } from "@/lib/og";
import Link from "next/link";
import type { Metadata } from "next";
import { ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { computeNewYearFortune } from "@/lib/interpretation/newyear-fortune";
import InFeedAdSlot from "@/components/InFeedAdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { BranchId } from "@/lib/calc/types";

export const metadata: Metadata = {
  title: "2027년 정미년 신년운세 — 띠별 한 해 운세 | 사주달력",
  description: "쥐띠부터 돼지띠까지, 2027년 정미년(丁未年) 띠별 신년운세를 무료로 확인하세요. 세운과 내 띠의 실제 지지 관계로 계산한 종합운·직업운·재물운·애정운.",
  alternates: { canonical: "/newyear/2027" },
  openGraph: {
    images: OG_IMAGES,
    title: "2027년 정미년 신년운세 — 띠별 한 해 운세 | 사주달력",
    description: "쥐띠부터 돼지띠까지, 2027년 정미년(丁未年) 띠별 신년운세를 무료로 확인하세요.",
    url: "/newyear/2027",
  },
};

export default function NewYear2027IndexPage() {
  const fortunes = ZODIAC_ANIMALS.map((z) => ({
    ...z,
    fortune: computeNewYearFortune(z.branch as BranchId, 2027),
  }));

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "2027년 신년운세", path: "/newyear/2027" },
        ])}
      />
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          2027년 丁未年 (정미년)
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          2027년 띠별 신년운세
        </h1>
        <p className="mt-2 text-sm text-white/50">내 띠를 눌러 2027년 한 해의 종합운·직업운·재물운·애정운을 확인해보세요</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {fortunes.map((z) => (
          <Link
            key={z.branch}
            href={`/newyear/2027/${z.branch}`}
            className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 py-4 text-center transition hover:border-[color:var(--color-gold)]/60"
          >
            <span className="text-xs font-semibold text-white/85">{z.animal}</span>
            <span className="text-lg font-black" style={{ color: "#e8cd94" }}>
              {z.fortune.score}점
            </span>
            <span className="px-2 text-[10px] leading-snug text-white/40">{z.fortune.label}</span>
          </Link>
        ))}
      </div>

      <InFeedAdSlot label="2027년 신년운세 목록 인피드 광고" />

      <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <h2 className="mb-2 text-sm font-bold text-[color:var(--color-gold-light)]">2027년 신년운세는 어떻게 계산하나요?</h2>
        <p className="text-[15px] leading-relaxed text-white/80">
          2027년은 60갑자로 정미년(丁未年)이에요. 신년운세는 이 세운(歲運)의 지지(未)와 내 띠(년지) 사이의
          실제 지지 관계 — 육합·삼합·충·형·파·해·원진 — 로 한 해의 흐름을 가늠해요. 무작위 문구가 아니라
          사주 원국 계산에 쓰는 것과 동일한 지지 관계 데이터를 그대로 재사용한 결과예요.
        </p>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 생년월일시로 정확한 사주 보러 가기
      </Link>
    </div>
  );
}
