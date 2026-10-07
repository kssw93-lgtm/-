import { OG_IMAGES } from "@/lib/og";
import Link from "next/link";
import type { Metadata } from "next";
import { getSonEomneunNalOfMonth } from "@/lib/calc/son-eomneun-nal";
import InFeedAdSlot from "@/components/InFeedAdSlot";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/** "이번 달"·"다음 달" 기준이 날짜가 바뀌면 달라지므로 정적 페이지를 주기적으로
 * 다시 생성한다. */
export const revalidate = 21600; // 6시간

function monthLabel(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

export function generateMetadata(): Metadata {
  const now = new Date();
  const title = `손없는날 계산기 — ${monthLabel(now.getFullYear(), now.getMonth() + 1)} 이사·결혼 길일 | 사주달력`;
  const description = "이번 달과 다음 달의 손없는날(음력 9·10·19·20·29·30일)을 한눈에 확인하세요. 이사, 결혼, 개업 날짜를 정할 때 참고하기 좋아요.";
  return {
    title,
    description,
    alternates: { canonical: "/lucky-day" },
    openGraph: { images: OG_IMAGES, title, description, url: "/lucky-day" },
  };
}

function MonthSection({ year, month }: { year: number; month: number }) {
  const entries = getSonEomneunNalOfMonth(year, month);
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-white/70">{monthLabel(year, month)}</h2>
      {entries.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/40">
          이 달은 데이터 지원 범위(1950~2028년) 밖이에요.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {entries.map((e) => {
            const [, m, d] = e.solarDate.split("-");
            return (
              <div
                key={e.solarDate}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/10 py-3 text-center"
              >
                <span className="text-lg font-black" style={{ color: "#e8cd94" }}>
                  {Number(m)}.{Number(d)}
                </span>
                <span className="text-[10px] text-white/50">{e.dayOfWeek}요일</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LuckyDayPage() {
  const now = new Date();
  const months = [0, 1, 2].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "손없는날 계산기", path: "/lucky-day" },
        ])}
      />
      <div>
        <h1 className="font-brand text-2xl font-bold leading-snug text-[color:var(--color-gold-light)]">
          손없는날 계산기
        </h1>
        <p className="mt-2 text-sm text-white/50">
          이사·결혼·개업처럼 중요한 날을 잡을 때 참고하는 손없는날, 이번 달부터 앞으로 두 달치를 확인해보세요.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <MonthSection year={months[0].year} month={months[0].month} />
        <InFeedAdSlot label="손없는날 목록 인피드 광고" />
        <MonthSection year={months[1].year} month={months[1].month} />
        <MonthSection year={months[2].year} month={months[2].month} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5">
        <h2 className="mb-2 text-sm font-bold text-[color:var(--color-gold-light)]">손없는날이란?</h2>
        <p className="text-[15px] leading-relaxed text-white/80">
          민속 신앙에서 &ldquo;손(損)&rdquo;은 날짜에 따라 동서남북을 옮겨 다니며 사람을 해코지한다는 잡귀를
          뜻해요. 음력 날짜의 끝자리가 9 또는 0인 날(9·10·19·20·29·30일)에는 손이 하늘로 올라가 머무르지
          않는다고 여겨 &ldquo;손없는날&rdquo;이라 불러요. 그래서 예로부터 이사, 결혼, 개업처럼 손 타는 걸
          꺼리는 큰일을 이날에 맞춰 잡는 경우가 많았어요.
        </p>
        <p className="mt-3 text-xs text-white/40">
          ⚠️ 손없는날은 과학적으로 검증된 사실이 아니라 전통 민속 신앙에 기반한 개념이에요. 참고용으로만
          활용해주세요.
        </p>
      </div>

      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110"
      >
        내 생년월일시로 사주 보러 가기
      </Link>
    </div>
  );
}
