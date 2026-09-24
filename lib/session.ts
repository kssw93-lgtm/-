import type { Category } from "@/lib/interpretation/template-select";
import type { ToneStyleId } from "@/lib/interpretation/tone-style";
import type { RelationshipStatus } from "@/lib/interpretation";

export interface BirthFormState {
  name: string;
  birthDate: string; // YYYY-MM-DD
  calendarType: "solar" | "lunar";
  isLeapMonth: boolean;
  timeUnknown: boolean;
  hour: number;
  minute: number;
  gender: "male" | "female";
}

export const DEFAULT_BIRTH_FORM: BirthFormState = {
  name: "",
  birthDate: "",
  calendarType: "solar",
  isLeapMonth: false,
  timeUnknown: false,
  hour: 12,
  minute: 0,
  gender: "female",
};

export type Screen =
  | "s1" | "style" | "s2" | "love-status" | "s3" | "ad" | "s5"
  | "compat-partner" | "compat-result" | "daily-ad" | "daily-result";

/**
 * 화면 흐름 설계서 08번: 세션 유지 범위 (브라우저 로컬 저장, 서버 저장 없음).
 * 원래 sessionStorage(탭을 닫으면 사라짐)를 썼는데, "오늘의 운세"를 다음날 다시
 * 볼 때도 매번 생년월일을 새로 입력해야 해서야 매일 찾아올 이유가 없다는 문제가
 * 있었다. localStorage로 바꿔 브라우저에만(서버 전송 없이) 남겨두고, 사용자가
 * "다른 사람 정보로 보기"를 누르면 명시적으로 지운다.
 */
const STORAGE_KEY = "saju_birth_form_v1";

export function loadBirthForm(): BirthFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || typeof value.name !== "string" ||
        typeof value.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.birthDate) ||
        !["solar", "lunar"].includes(value.calendarType) || !["male", "female"].includes(value.gender) ||
        typeof value.timeUnknown !== "boolean" || typeof value.isLeapMonth !== "boolean" ||
        !Number.isInteger(value.hour) || value.hour < 0 || value.hour > 23 ||
        !Number.isInteger(value.minute) || value.minute < 0 || value.minute > 59) return null;
    return value as BirthFormState;
  } catch {
    return null;
  }
}

export function saveBirthForm(state: BirthFormState): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* 저장 제한이어도 계산은 계속한다. */ }
}

/** "다른 사람 정보로 보기" — 저장된 생년월일 정보를 지우고 처음부터 새로 입력받는다. */
export function clearBirthForm(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* 화면 상태는 별도로 초기화한다. */ }
}

const STYLE_KEY = "saju_tone_style_v1";

export function loadToneStyle(): ToneStyleId {
  if (typeof window === "undefined") return "standard";
  try {
    const raw = window.sessionStorage.getItem(STYLE_KEY);
    return raw === "mz" || raw === "joseon" ? raw : "standard";
  } catch {
    return "standard";
  }
}

export function saveToneStyle(style: ToneStyleId): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(STYLE_KEY, style); } catch { /* 현재 화면의 선택은 유지한다. */ }
}

export type { Category, ToneStyleId, RelationshipStatus };
