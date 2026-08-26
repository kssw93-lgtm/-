import starSignsJson from "@/data/star-signs.json";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";

export interface StarSignEntry {
  id: string;
  name: string;
  hanja: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  symbol: string;
  text: string;
}

export interface ZodiacAnimalEntry {
  branch: string;
  animal: string;
  hanja: string;
  text: string;
}

/**
 * "별자리 성격", "OO띠 성격"처럼 검색량이 있는 개별 키워드를 노리는 콘텐츠.
 * 새 문구를 짓지 않고, 앱 결과 화면에서 이미 쓰는 star-signs.json/zodiac-animals.json의
 * text를 그대로 재사용해 각자 독립된 URL을 가진 페이지로 뽑아냈을 뿐이다.
 */
export const STAR_SIGNS = starSignsJson as StarSignEntry[];
export const ZODIAC_ANIMALS = zodiacAnimalsJson as ZodiacAnimalEntry[];

export function getStarSignEntry(id: string): StarSignEntry | undefined {
  return STAR_SIGNS.find((s) => s.id === id);
}

export function getZodiacAnimalEntry(branch: string): ZodiacAnimalEntry | undefined {
  return ZODIAC_ANIMALS.find((z) => z.branch === branch);
}

export function formatDateRange(s: StarSignEntry): string {
  return `${s.startMonth}월 ${s.startDay}일 ~ ${s.endMonth}월 ${s.endDay}일`;
}
