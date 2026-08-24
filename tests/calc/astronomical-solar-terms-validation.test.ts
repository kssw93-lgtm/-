import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { kasiToUtcMillis } from "@/lib/calc/solar-terms";
import { computeSolarTermInstant } from "@/lib/calc/astronomical-solar-terms";

interface RawSolarTermRecord {
  year: number;
  termName: string;
  locdate: string;
  kst: string;
}

const SOLAR_TERMS_DIR = path.join(__dirname, "..", "..", "data", "solar-terms");

function loadKnownYear(year: number): RawSolarTermRecord[] {
  const raw = fs.readFileSync(path.join(SOLAR_TERMS_DIR, `${year}.json`), "utf-8");
  return JSON.parse(raw) as RawSolarTermRecord[];
}

/**
 * KASI 자체 데이터의 이례적 항목으로 조사·확인된 3건(코드 주석의 astronomical-solar-terms.ts
 * 참조 — 라이브 API 재조회, 윤년 패턴 대조, 인접 연도 패턴 대조 세 가지로 교차검증함).
 * 이 3건만 제외하면 나머지 693개는 전부 2분 이내로 일치한다.
 */
const KNOWN_KASI_ANOMALIES = new Set(["2011|대한", "2011|입동", "2015|하지"]);

describe("천문 계산(VSOP87) 절기 vs KASI 실측 검증 (2000~2028년, 696개 전수비교)", () => {
  const years = Array.from({ length: 29 }, (_, i) => 2000 + i);

  for (const year of years) {
    const known = loadKnownYear(year);
    it(`${year}년: 24절기 전부 KASI 실측과 오차 2분 이내(이례적 항목 3건 제외)`, () => {
      for (const record of known) {
        if (KNOWN_KASI_ANOMALIES.has(`${year}|${record.termName}`)) continue;
        const knownMillis = kasiToUtcMillis(record.locdate, record.kst);
        const computedMillis = computeSolarTermInstant(year, record.termName);
        const diffMinutes = Math.abs(knownMillis - computedMillis) / 60000;
        expect(
          diffMinutes,
          `${year}년 ${record.termName}: KASI=${new Date(knownMillis).toISOString()}, 계산=${new Date(computedMillis).toISOString()}`
        ).toBeLessThan(2);
      }
    });
  }

  it("전체 693개(이례적 항목 제외) 평균/최대 오차 요약(정보용 — 로그 출력)", () => {
    const diffs: number[] = [];
    for (const year of years) {
      for (const record of loadKnownYear(year)) {
        if (KNOWN_KASI_ANOMALIES.has(`${year}|${record.termName}`)) continue;
        const knownMillis = kasiToUtcMillis(record.locdate, record.kst);
        const computedMillis = computeSolarTermInstant(year, record.termName);
        diffs.push(Math.abs(knownMillis - computedMillis) / 60000);
      }
    }
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const max = Math.max(...diffs);
    // eslint-disable-next-line no-console
    console.log(`[절기 검증] ${diffs.length}개, 평균 오차 ${avg.toFixed(3)}분, 최대 오차 ${max.toFixed(3)}분`);
    expect(diffs.length).toBe(29 * 24 - KNOWN_KASI_ANOMALIES.size);
  });
});
