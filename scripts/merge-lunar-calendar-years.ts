/**
 * scripts/merge-lunar-calendar-years.ts
 *
 * fetch-lunar-calendar-full.ts가 연도별로 나눠 저장한 data/lunar-calendar/by-year/*.json을
 * 하나의 배열로 합쳐 data/lunar-calendar/full-1950-2028.json으로 만든다.
 * lib/calc/index.ts가 이 파일을 통째로 읽어 KasiLunarCalendarSource에 넘긴다.
 *
 * 실행: npx tsx scripts/merge-lunar-calendar-years.ts
 */

import fs from "fs";
import path from "path";

const BY_YEAR_DIR = path.join(__dirname, "..", "data", "lunar-calendar", "by-year");
const OUT_FILE = path.join(__dirname, "..", "data", "lunar-calendar", "full-1950-2028.json");

interface LunarToSolarRecord {
  solarDate: string;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

const files = fs
  .readdirSync(BY_YEAR_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort((a, b) => Number(a.replace(".json", "")) - Number(b.replace(".json", "")));

const merged: LunarToSolarRecord[] = [];
for (const file of files) {
  const records = JSON.parse(fs.readFileSync(path.join(BY_YEAR_DIR, file), "utf-8")) as LunarToSolarRecord[];
  merged.push(...records);
}

merged.sort((a, b) => a.solarDate.localeCompare(b.solarDate));

fs.writeFileSync(OUT_FILE, JSON.stringify(merged));

console.log(`✅ ${files.length}개 연도 파일 → ${merged.length}건 병합 완료: ${OUT_FILE}`);
