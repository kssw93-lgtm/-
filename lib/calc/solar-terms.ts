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
 * 2000~2028년: KASI SpcdeInfoService/get24DivisionsInfo API로 수집한 실측 데이터.
 * 이 API는 2000~2028년 구간만 데이터를 제공한다(1900~1999, 2029년 이후는 resultCode=00이지만
 * totalCount=0으로 응답). 2026-08-24 기준 data.go.kr 운영계정 활용신청이 승인된 키로도 동일하게
 * 1999/2029/2030년이 totalCount=0으로 확인됐다 — 즉 이 제한은 개발계정/운영계정 등급 차이가
 * 아니라, KASI가 이 API 자체에 2000~2028년 데이터만 공개해 둔 원본 데이터 범위 제한이다.
 *
 * 1950~1999년: 위 제한을 풀기 위해 천문 계산(VSOP87 + 실측 ΔT, lib/calc/astronomical-solar-terms.ts)
 * 으로 직접 산출해 KASI 데이터와 동일한 형식으로 저장했다. 2000~2028년 KASI 실측 693개(이례적
 * 3건 제외)와 비교해 평균 오차 0.26분, 최대 0.63분으로 검증됨
 * (tests/calc/astronomical-solar-terms-validation.test.ts).
 *
 * 2029년 이후로 더 확장하려면: 다른 KASI 서비스나 별도 데이터 출처를 검토하거나, 위와 동일한
 * 천문 계산 방식을 그대로 확장하면 된다(같은 검증 파이프라인 재사용 가능).
 */
export const SUPPORTED_BIRTH_YEAR_RANGE = { min: 1950, max: 2028 } as const;

export function createDefaultSolarTermSource(): SolarTermSource {
  return new JsonSolarTermSource((year) => INDEX[String(year)]);
}
