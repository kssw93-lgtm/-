export type StemId =
  | "jia" | "yi" | "bing" | "ding" | "wu"
  | "ji" | "geng" | "xin" | "ren" | "gui";

export type BranchId =
  | "zi" | "chou" | "yin" | "mao" | "chen" | "si"
  | "wu" | "wei" | "shen" | "you" | "xu" | "hai";

export type ElementId = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yang" | "yin";
export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";

export interface Pillar {
  stem: StemId;
  branch: BranchId;
  hanja: string;
}

/** 시간 미상인 경우 hour_pillar 필드는 null. 계산 규칙서 04번. */
export type MaybePillar = Pillar | null;

export interface BirthInput {
  name?: string;
  year: number;
  month: number;
  day: number;
  /** null이면 출생시간 모름 (계산 규칙서 04번) */
  hour: number | null;
  minute: number;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
}

export interface NormalizedBirth {
  /** 절기/일주 계산에 쓰이는 Asia/Seoul(현재 기준) 기준 정규화된 UTC 시각(ms) */
  utcMillis: number;
  /** 정규화 후의 로컬(KST) 날짜/시각 표기 */
  localYear: number;
  localMonth: number;
  localDay: number;
  localHour: number | null;
  localMinute: number;
}

export interface SolarTermInstant {
  year: number;
  term: string;
  /** UTC epoch millis */
  instantUtcMillis: number;
}

export interface FourPillars {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: MaybePillar;
}

export type TenGod =
  | "bigyeon" | "geopjae"
  | "siksin" | "sanggwan"
  | "jeongjae" | "pyeonjae"
  | "jeonggwan" | "pyeongwan"
  | "jeongin" | "pyeonin";

export interface HiddenStemEntry {
  stem: StemId;
  role: "primary" | "secondary" | "residual";
}

export interface HiddenStemTenGod extends HiddenStemEntry {
  tenGod: TenGod;
}

export interface RelationHit {
  type:
    | "stem_combine"
    | "branch_six_combine"
    | "branch_clash"
    | "branch_three_combine"
    | "branch_directional_combine"
    | "branch_punishment"
    | "branch_break"
    | "branch_harm"
    | "branch_resentment";
  members: string[];
  element?: ElementId;
}

export interface RootednessResult {
  branch: BranchId;
  rooted: boolean;
  matchingHiddenStems: StemId[];
}

export interface LuckPillar {
  index: number;
  pillar: Pillar;
  startAgePrecise: number;
  startAgeDisplay: number;
  startDate: string;
  endDate: string;
}

export interface SajuResult {
  input: BirthInput;
  /** 입력이 음력이었어도 항상 변환된 표준 양력 날짜(별자리 계산 등에 사용) */
  solarBirthDate: { year: number; month: number; day: number };
  pillars: FourPillars;
  elements: {
    stemElements: ElementId[];
    branchElements: ElementId[];
  };
  yinYang: {
    stemYinYang: YinYang[];
    branchYinYang: YinYang[];
  };
  hiddenStems: Record<BranchId, HiddenStemEntry[]>;
  tenGods: {
    stems: (TenGod | null)[];
    hiddenStems: Record<string, HiddenStemTenGod[]>;
  };
  relations: RelationHit[];
  rootedness: RootednessResult[];
  monthOrder: { branch: BranchId; season: "spring" | "summer" | "autumn" | "winter" };
  voidBranches: BranchId[];
  luckDirection: "forward" | "backward";
  majorLuck: LuckPillar[];
  usingMockData: boolean;
}
