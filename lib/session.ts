import type { Category } from "@/lib/interpretation/template-select";
import type { ToneStyleId } from "@/lib/interpretation/tone-style";

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

export type Screen = "s1" | "style" | "s2" | "s3" | "s4" | "s5" | "s6" | "compat-partner" | "compat-result";

/** 화면 흐름 설계서 08번: 세션 유지 범위 (localStorage, 서버 저장 없음) */
const STORAGE_KEY = "saju_birth_form_v1";
const INTRO_SEEN_KEY = "saju_intro_seen_v1";

export function loadBirthForm(): BirthFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BirthFormState) : null;
  } catch {
    return null;
  }
}

export function saveBirthForm(state: BirthFormState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(INTRO_SEEN_KEY) === "1";
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTRO_SEEN_KEY, "1");
}

const STYLE_KEY = "saju_tone_style_v1";

export function loadToneStyle(): ToneStyleId {
  if (typeof window === "undefined") return "standard";
  const raw = window.sessionStorage.getItem(STYLE_KEY);
  return raw === "mz" || raw === "joseon" ? raw : "standard";
}

export function saveToneStyle(style: ToneStyleId): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STYLE_KEY, style);
}

export type { Category, ToneStyleId };
