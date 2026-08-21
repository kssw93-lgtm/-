/**
 * scripts/fetch-kasi-data.ts
 *
 * 개발 지시서 v1.0 04번 참조.
 * KASI(공공데이터포털) 절기·음양력 API를 연도 범위로 순회 호출해서
 * 로컬 JSON(/data/solar-terms, /data/lunar-calendar, /data/day-pillars)으로 저장한다.
 *
 * 계산 엔진은 런타임에 이 API를 직접 호출하지 않는다(데이터 테이블 69번,
 * "외부 데이터 직접 의존 금지"). 이 스크립트는 데이터 최초 수집·갱신 시에만 1회성으로 실행한다.
 *
 * 실행: npx ts-node scripts/fetch-kasi-data.ts --from=1950 --to=2050
 */

import fs from "fs";
import path from "path";

// 서비스키는 반드시 .env에서 읽는다. 코드에 직접 넣지 않는다.
// .env 예시: KASI_SERVICE_KEY=발급받은인증키(인코딩된 상태 그대로)
const SERVICE_KEY = process.env.KASI_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error(
    "❌ KASI_SERVICE_KEY가 없습니다. 프로젝트 루트에 .env 파일을 만들고 다음을 추가하세요:\n" +
      "KASI_SERVICE_KEY=발급받은인증키"
  );
  process.exit(1);
}

const SOLAR_TERM_ENDPOINT =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/get24DivisionsInfo";
const LUNAR_CAL_ENDPOINT =
  "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo";

const OUT_DIR = path.join(__dirname, "..", "data");
const SOLAR_TERMS_DIR = path.join(OUT_DIR, "solar-terms");
const LUNAR_CAL_DIR = path.join(OUT_DIR, "lunar-calendar");
const DAY_PILLARS_DIR = path.join(OUT_DIR, "day-pillars");

for (const dir of [SOLAR_TERMS_DIR, LUNAR_CAL_DIR, DAY_PILLARS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 매우 단순한 XML → 필요한 필드만 뽑는 파서.
// 실제 프로젝트에서는 xml2js 등 검증된 라이브러리 사용 권장.
function extractTag(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`, "g");
  const results: string[] = [];
  let m;
  while ((m = regex.exec(xml)) !== null) results.push(m[1]);
  return results;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface SolarTermRecord {
  year: number;
  termName: string;
  locdate: string; // YYYYMMDD
  kst: string; // HHMM, 분단위
}

async function fetchSolarTermsForYear(year: number): Promise<SolarTermRecord[]> {
  const url = `${SOLAR_TERM_ENDPOINT}?serviceKey=${SERVICE_KEY}&solYear=${year}&numOfRows=30`;
  const res = await fetch(url);
  const xml = await res.text();

  const resultCode = extractTag(xml, "resultCode")[0];
  if (resultCode !== "00") {
    console.warn(`⚠ ${year}년 절기 응답 이상: ${extractTag(xml, "resultMsg")[0]}`);
    return [];
  }

  const names = extractTag(xml, "dateName");
  const locdates = extractTag(xml, "locdate");
  const ksts = extractTag(xml, "kst");

  return names.map((termName, i) => ({
    year,
    termName,
    locdate: locdates[i],
    kst: ksts[i],
  }));
}

interface LunarRecord {
  solarDate: string; // YYYY-MM-DD
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  dayPillarRef: string; // lunIljin — 일진 교차검증용으로만 사용. 세차/월건은 저장하지 않음(개발지시서 04번 참조)
}

async function fetchLunarForDate(solYear: number, solMonth: number, solDay: number): Promise<LunarRecord | null> {
  const mm = String(solMonth).padStart(2, "0");
  const dd = String(solDay).padStart(2, "0");
  const url = `${LUNAR_CAL_ENDPOINT}?serviceKey=${SERVICE_KEY}&solYear=${solYear}&solMonth=${mm}&solDay=${dd}`;
  const res = await fetch(url);
  const xml = await res.text();

  const resultCode = extractTag(xml, "resultCode")[0];
  if (resultCode !== "00") return null;

  const lunYear = extractTag(xml, "lunYear")[0];
  const lunMonth = extractTag(xml, "lunMonth")[0];
  const lunDay = extractTag(xml, "lunDay")[0];
  const leap = extractTag(xml, "lunLeapmonth")[0]; // "평" | "윤"
  const iljin = extractTag(xml, "lunIljin")[0]; // 예: "임술(壬戌)" — 일진(day pillar) 교차검증용

  if (!lunYear) return null;

  return {
    solarDate: `${solYear}-${mm}-${dd}`,
    lunarYear: Number(lunYear),
    lunarMonth: Number(lunMonth),
    lunarDay: Number(lunDay),
    isLeapMonth: leap === "윤",
    dayPillarRef: iljin,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const fromArg = args.find((a) => a.startsWith("--from="));
  const toArg = args.find((a) => a.startsWith("--to="));
  const fromYear = fromArg ? Number(fromArg.split("=")[1]) : new Date().getFullYear() - 5;
  const toYear = toArg ? Number(toArg.split("=")[1]) : new Date().getFullYear() + 5;

  console.log(`절기 데이터 수집: ${fromYear} ~ ${toYear}`);
  for (let year = fromYear; year <= toYear; year++) {
    const records = await fetchSolarTermsForYear(year);
    fs.writeFileSync(
      path.join(SOLAR_TERMS_DIR, `${year}.json`),
      JSON.stringify(records, null, 2)
    );
    console.log(`  ${year}: ${records.length}개 절기 저장`);
    await sleep(200); // API 호출 간 최소 딜레이 — 트래픽 한도 보호
  }

  console.log(
    `\n⚠ 음양력/일진 데이터는 날짜 1개당 API 호출 1회라 1900~2100년 전체를 이 스크립트로 매일 돌리는 건 비효율적입니다.\n` +
      `우선 테스트에 필요한 소수 날짜만 아래 sampleDates에 추가해서 실행하고,\n` +
      `전체 범위 수집이 필요해지면 별도 배치(날짜 단위 반복 + 트래픽 한도 고려한 스케줄링)로 분리하는 것을 권장합니다.`
  );

  // 예시: 테스트에 필요한 날짜만 우선 수집 (경계값 테스트용, 개발지시서 08번 참조)
  const sampleDates: [number, number, number][] = [
    [2026, 2, 17],
    [2026, 2, 4], // 입춘 당일
    [1961, 8, 10], // 표준시 변경 경계
  ];

  const lunarResults: LunarRecord[] = [];
  for (const [y, m, d] of sampleDates) {
    const record = await fetchLunarForDate(y, m, d);
    if (record) lunarResults.push(record);
    await sleep(200);
  }

  fs.writeFileSync(
    path.join(LUNAR_CAL_DIR, "sample.json"),
    JSON.stringify(lunarResults, null, 2)
  );
  fs.writeFileSync(
    path.join(DAY_PILLARS_DIR, "sample.json"),
    JSON.stringify(
      lunarResults.map((r) => ({ solarDate: r.solarDate, dayPillarRef: r.dayPillarRef })),
      null,
      2
    )
  );

  console.log("\n✅ 완료. /data/solar-terms, /data/lunar-calendar, /data/day-pillars 확인하세요.");
}

main().catch((err) => {
  console.error("수집 중 오류:", err);
  process.exit(1);
});
