/**
 * scripts/generate-computed-solar-terms.ts
 *
 * KASI가 데이터를 제공하지 않는 연도(1950~1999)의 24절기를 천문 계산(VSOP87 + 실측 ΔT,
 * lib/calc/astronomical-solar-terms.ts — KASI 실측 2000~2028년 693개와 평균 0.26분 오차로
 * 검증됨)으로 구해 기존 KASI 파일과 동일한 형식({year, termName, locdate, kst})으로 저장한다.
 * 런타임에는 이 계산을 다시 하지 않고, 미리 생성된 JSON을 그대로 읽는다(기존 KASI 데이터와
 * 동일한 읽기 경로 재사용).
 *
 * 실행: npx tsx scripts/generate-computed-solar-terms.ts --from=1950 --to=1999
 */
import fs from "fs";
import path from "path";
import { computeYearTermsAstronomical } from "../lib/calc/astronomical-solar-terms";

const OUT_DIR = path.join(__dirname, "..", "data", "solar-terms");

function toKstParts(utcMillis: number): { locdate: string; kst: string } {
  const kstMillis = utcMillis + 9 * 60 * 60 * 1000;
  const d = new Date(kstMillis);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return { locdate: `${y}${m}${day}`, kst: `${h}${min}` };
}

function main() {
  const args = process.argv.slice(2);
  const fromArg = args.find((a) => a.startsWith("--from="));
  const toArg = args.find((a) => a.startsWith("--to="));
  const fromYear = fromArg ? Number(fromArg.split("=")[1]) : 1950;
  const toYear = toArg ? Number(toArg.split("=")[1]) : 1999;

  console.log(`천문 계산 절기 데이터 생성: ${fromYear} ~ ${toYear}`);
  for (let year = fromYear; year <= toYear; year++) {
    const terms = computeYearTermsAstronomical(year);
    const records = terms.map(({ term, instantUtcMillis }) => {
      const { locdate, kst } = toKstParts(instantUtcMillis);
      return { year, termName: term, locdate, kst };
    });
    fs.writeFileSync(
      path.join(OUT_DIR, `${year}.json`),
      JSON.stringify(records, null, 2) + "\n"
    );
    console.log(`  ${year}: ${records.length}개 절기 저장 (계산)`);
  }
  console.log("\n완료.");
}

main();
