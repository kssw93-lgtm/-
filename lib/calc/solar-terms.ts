import solarTermsIndex from "@/data/solar-terms/index.json";
import type { SolarTermInstant } from "./types";

/** 개발 지시서 04번: KASI 24절기 API 응답 구조 그대로의 소스 인터페이스 */
export interface SolarTermSource {
  getYearTerms(year: number): SolarTermInstant[];
  /** 특정 절기의 절입 시각(UTC epoch millis)을 찾는다. 연도가 바뀌는 절입 근처를 위해 전후년도까지 탐색한다. */
  findTermInstant(year: number, termName: string): SolarTermInstant | null;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** KASI 응답의 locdate(YYYYMMDD) + kst(HHMM, 분단위)를 UTC epoch millis로 변환한다. */
export function kasiToUtcMillis(locdate: string, kst: string): number {
  const year = Number(locdate.slice(0, 4));
  const month = Number(locdate.slice(4, 6));
  const day = Number(locdate.slice(6, 8));
  const hour = Number(kst.slice(0, 2));
  const minute = Number(kst.slice(2, 4));
  // KASI 값은 현재 기준 Asia/Seoul(UTC+9) 로컬시각이다(데이터테이블 32번: 초 단위는 미제공, 분 단위까지).
  return Date.UTC(year, month - 1, day, hour, minute) - KST_OFFSET_MS;
}

interface RawSolarTermRecord {
  year: number;
  termName: string;
  locdate: string;
  kst: string;
}

export class JsonSolarTermSource implements SolarTermSource {
  private byYear = new Map<number, SolarTermInstant[]>();

  constructor(loader: (year: number) => RawSolarTermRecord[] | undefined) {
    this.loader = loader;
  }

  private loader: (year: number) => RawSolarTermRecord[] | undefined;

  getYearTerms(year: number): SolarTermInstant[] {
    const cached = this.byYear.get(year);
    if (cached) return cached;
    const raw = this.loader(year);
    if (!raw || raw.length === 0) {
      throw new Error(
        `${year}년 절기 데이터가 없습니다. /data/solar-terms/${year}.json 을 KASI 데이터로 채워야 합니다.`
      );
    }
    const parsed = raw.map((r) => ({
      year: r.year,
      term: r.termName,
      instantUtcMillis: kasiToUtcMillis(r.locdate, r.kst),
    }));
    this.byYear.set(year, parsed);
    return parsed;
  }

  findTermInstant(year: number, termName: string): SolarTermInstant | null {
    // 월주/대운 계산은 연도 경계 부근을 위해 전년·익년 데이터도 함께 조회한다(findAdjacentTerms).
    // 그 인접 연도가 지원 범위 밖이라 데이터가 없는 경우는 "해당 연도에 이 절기 없음"으로 취급하고,
    // 실제로 필요한 절기를 못 찾았을 때만 findAdjacentTerms가 최종 오류를 던진다.
    let terms: SolarTermInstant[];
    try {
      terms = this.getYearTerms(year);
    } catch {
      return null;
    }
    const found = terms.find((t) => t.term === termName);
    return found ?? null;
  }
}

type SolarTermsIndex = Record<string, RawSolarTermRecord[]>;

const INDEX = solarTermsIndex as SolarTermsIndex;

/**
 * KASI SpcdeInfoService/get24DivisionsInfo API를 개발계정(무료) 키로 수집한 실제 절기 데이터.
 * 이 API 키의 계정 등급에서는 2000~2028년 구간만 데이터를 제공한다(1900~1999, 2029년 이후는
 * resultCode=00이지만 totalCount=0으로 응답 — data.go.kr 운영계정 승인 전 개발계정 범위 제한으로 추정).
 * 서비스 지원 범위를 넓히려면 data.go.kr에서 해당 API의 운영계정 활용신청(무료) 승인 후
 * scripts/fetch-kasi-data.ts 를 더 넓은 --from/--to로 재실행하면 된다(코드 수정 불필요).
 */
export const SUPPORTED_BIRTH_YEAR_RANGE = { min: 2000, max: 2028 } as const;

export function createDefaultSolarTermSource(): SolarTermSource {
  return new JsonSolarTermSource((year) => INDEX[String(year)]);
}
