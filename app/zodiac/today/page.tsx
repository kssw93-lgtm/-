import { OG_IMAGES } from "@/lib/og";
import Link from "next/link";
import type { Metadata } from "next";
import { STAR_SIGNS, ZODIAC_ANIMALS } from "@/lib/content/zodiac-pages";
import { computeAnimalDailyFortune } from "@/lib/interpretation/daily-branch-fortune";
import { computeStarDailyMood } from "@/lib/interpretation/daily-star-mood";
import InFeedAdSlot from "@/components/InFeedAdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { BranchId } from "@/lib/calc/types";

/** 오늘의 운세는 날짜가 바뀌면 내용도 바뀌어야 하므로, 정적 페이지를 일정 주기로
 * 다시 생성한다. */
export const revalidate = 1800;

function todayDateLabel(now: Date): string {
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

export function generateMetadata(): Metadata {
  const dateLabel = todayDateLabel(new Date());
  const title = `오늘의 띠별·별자리 운세 (${dateLabel}) | 사주달력`;
  const description = "쥐띠부터 돼지띠까지, 양자리부터 물고기자리까지 — 오늘의 띠별 운세와 별자리 운세를 무료로 확인하세요.";
  return {
    title,
    description,
    alternates: { canonical: "/zodiac/today" },
    openGraph: { images: OG_IMAGES, title, description, url: "/zodiac/today" },
  };
}

export default function ZodiacTodayPage() {
  const now = new Date();
  const dateLabel = todayDateLabel(now);
  const animalFortunes = ZODIAC_ANIMALS.map((z) => ({
    ...z,
    daily: computeAnimalDailyFortune(z.branch as BranchId, now),
  }));
  const starMoods = STAR_SIGNS.map((s) => ({
    ...s,
    daily: computeStarDailyMood(s.id, now),
  }));

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "별자리·띠 성격", path: "/zodiac" },
          { name: "오늘의 운세", path: "/zodiac/today" },
        ])}
      />
      <div className="text-center">
        <span className="rounded-full border border-[color:var(--color-gold)]/40 bg-black/30 px-4 py-1 text-xs tracking-[0.15em] text-[color:var(--color-gold-light)]">
          {dateLabel}
        </span>
        <h1 className="font-brand mt-4 text-2xl font-bold text-[color:var(--color-gold-light)]">
          오늘의 띠별 · 별자리 운세
        </h1>
        <p className="mt-2 text-sm text-white/50">내 띠나 별자리를 눌러 오늘의 운세를 확인해보세요</p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-white/70">🐾 오늘의 띠별 운세</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {animalFortunes.map((z) => (
            <Link
              key={z.branch}
              href={`/zodiac/animal/${z.branch}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 py-4 text-center transition hover:border-[color:var(--color-gold)]/60"
            >
              <span className="text-xs font-semibold text-white/85">{z.animal}</span>
              <span className="text-lg font-black" style={{ color: "#e8cd94" }}>
                {z.daily.score}점
              </span>
              <span className="px-2 text-[10px] leading-snug text-white/40">{z.daily.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <InFeedAdSlot label="오늘의 운세 목록 인피드 광고" />

      <div>
        <h2 className="mb-3 text-sm font-bold text-white/70">♈ 오늘의 별자리 운세</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {starMoods.map((s) => (
            <Link
              key={s.id}
              href={`/zodiac/star/${s.id}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--color-gold)]/20 bg-white/5 py-4 text-center transition hover:border-[color:var(--color-gold)]/60"
            >
              <span className="text-xs font-semibold text-white/85">
                {s.symbol} {s.name}
              </span>
              <span className="text-lg font-black" style={{ color: "#e8cd94" }}>
                {s.daily.score}점
              </span>
              <span className="px-2 text-[10px] leading-snug text-white/40">{s.daily.mood}</span>
            </Link>
          ))}
        </div>
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
