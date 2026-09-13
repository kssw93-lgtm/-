/**
 * scripts/fetch-lunar-calendar-full.ts
 *
 * KASI 음양력 API(LrsrCldInfoService/getLunCalInfo)를 날짜 단위로 순회 호출해서
 * SUPPORTED_BIRTH_YEAR_RANGE(1950~2028, lib/calc/solar-terms.ts)와 동일한 범위의
 * 양력→음력 변환 데이터를 로컬에 수집한다.
 *
 * fetch-kasi-data.ts의 sampleDates(테스트용 3건)와 달리 이 스크립트는 실제 서비스에서
 * 쓸 전체 범위를 수집하는 1회성 배치 작업이다. 날짜 1개당 API 호출 1개라 총 호출 수가
 * 크므로(약 2만8천여 건) 연도 단위로 진행 상황을 파일에 저장해 재실행 시 이어서 할 수 있게 한다.
 *
 * 실행: npx tsx scripts/fetch-lunar-calendar-full.ts
 * (중단됐다 다시 실행해도 이미 완료된 연도는 건너뛴다)
 */

import fs from "fs";
import path from "path";

const SERVICE_KEY = process.env.KASI_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error(
    "❌ KASI_SERVICE_KEY가 없습니다. 프로젝트 루트 .env에 KASI_SERVICE_KEY=발급받은인증키 를 추가하세요."
  );
  process.exit(1);
}

const LUNAR_CAL_ENDPOINT =
  "https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo";

const FROM_YEAR = 1950;
const TO_YEAR = 2028;

const OUT_DIR = path.join(__dirname, "..", "data", "lunar-calendar", "by-year");
fs.mkdirSync(OUT_DIR, { recursive: true });

const DELAY_MS = 220;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractTag(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`, "g");
  const results: string[] = [];
  let m;
  while ((m = regex.exec(xml)) !== null) results.push(m[1]);
  return results;
}

interface LunarToSolarRecord {
  solarDate: string;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y: number, m: number): number {
  const days = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[m - 1];
}

async function fetchLunarForDate(
  solYear: number,
  solMonth: number,
  solDay: number
): Promise<LunarToSolarRecord | null> {
  const mm = String(solMonth).padStart(2, "0");
  const dd = String(solDay).padStart(2, "0");
  const url = `${LUNAR_CAL_ENDPOINT}?serviceKey=${SERVICE_KEY}&solYear=${solYear}&solMonth=${mm}&solDay=${dd}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      const xml = await res.text();

      const resultCode = extractTag(xml, "resultCode")[0];
      if (resultCode !== "00") {
        console.warn(
          `  ⚠ ${solYear}-${mm}-${dd} 응답 이상(시도 ${attempt}/${MAX_RETRIES}): ${extractTag(xml, "resultMsg")[0] ?? "unknown"}`
        );
        if (attempt < MAX_RETRIES) {
          await sleep(1000 * attempt);
          continue;
        }
        return null;
      }

      const lunYear = extractTag(xml, "lunYear")[0];
      const lunMonth = extractTag(xml, "lunMonth")[0];
      const lunDay = extractTag(xml, "lunDay")[0];
      const leap = extractTag(xml, "lunLeapmonth")[0];

      if (!lunYear) return null;

      return {
        solarDate: `${solYear}-${mm}-${dd}`,
        lunarYear: Number(lunYear),
        lunarMonth: Number(lunMonth),
        lunarDay: Number(lunDay),
        isLeapMonth: leap === "윤",
      };
    } catch (err) {
      console.warn(`  ⚠ ${solYear}-${mm}-${dd} 네트워크 오류(시도 ${attempt}/${MAX_RETRIES}): ${err}`);
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
        continue;
      }
      return null;
    }
  }
  return null;
}

function yearFilePath(year: number): string {
  return path.join(OUT_DIR, `${year}.json`);
}

function isYearComplete(year: number): boolean {
  const file = yearFilePath(year);
  if (!fs.existsSync(file)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as LunarToSolarRecord[];
    const expectedDays = isLeapYear(year) ? 366 : 365;
    return Array.isArray(data) && data.length === expectedDays;
  } catch {
    return false;
  }
}

async function fetchYear(year: number): Promise<void> {
  const records: LunarToSolarRecord[] = [];
  let failCount = 0;

  for (let month = 1; month <= 12; month++) {
    const dim = daysInMonth(year, month);
    for (let day = 1; day <= dim; day++) {
      const record = await fetchLunarForDate(year, month, day);
      if (record) {
        records.push(record);
      } else {
        failCount++;
      }
      await sleep(DELAY_MS);
    }
  }

  fs.writeFileSync(yearFilePath(year), JSON.stringify(records, null, 2));
  const expectedDays = isLeapYear(year) ? 366 : 365;
  console.log(
    `✅ ${year}: ${records.length}/${expectedDays}일 수집 완료${failCount > 0 ? ` (실패 ${failCount}건)` : ""}`
  );
}

async function main() {
  console.log(`음양력 전체 범위 수집 시작: ${FROM_YEAR}~${TO_YEAR} (기존 완료 연도는 건너뜀)`);
  const startedAt = Date.now();

  for (let year = FROM_YEAR; year <= TO_YEAR; year++) {
    if (isYearComplete(year)) {
      console.log(`⏭  ${year}: 이미 완료됨, 건너뜀`);
      continue;
    }
    await fetchYear(year);
  }

  const elapsedMin = ((Date.now() - startedAt) / 60000).toFixed(1);
  console.log(`\n전체 완료. 소요 시간: ${elapsedMin}분`);
  console.log(`다음 단계: npx tsx scripts/merge-lunar-calendar-years.ts 로 병합하세요.`);
}

main().catch((err) => {
  console.error("수집 중 치명적 오류:", err);
  process.exit(1);
});
