import type { BirthFormState, Category, RelationshipStatus } from "@/lib/session";

/**
 * "이 결과를 이번 브라우저 세션에서 이미 열어봤는지"를 기록한다. 새로고침이나
 * 뒤로 갔다 다시 들어오는 정도로는 광고를 반복하지 않되, 탭을 닫으면(세션 종료)
 * 초기화되도록 sessionStorage를 쓴다(localStorage가 아님 — 그러면 다음 날
 * 다시 와도 광고 없이 영구히 열려버린다).
 */
const STORAGE_KEY = "saju_result_unlock_v1";

function readUnlockedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

function persistUnlockedSet(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // 프라이빗 모드 등 세션 스토리지를 못 쓰는 환경 — 이번 렌더링 동안만 동작하고
    // 새로고침하면 다시 광고를 보게 될 수 있다. 크래시 없이 조용히 넘어간다.
  }
}

export function isResultUnlocked(key: string): boolean {
  return readUnlockedSet().has(key);
}

export function markResultUnlocked(key: string): void {
  const set = readUnlockedSet();
  if (set.has(key)) return;
  set.add(key);
  persistUnlockedSet(set);
}

/**
 * 결과를 고유하게 결정하는 실제 입력값을 그대로 직렬화해 키로 쓴다(해시하지 않음 —
 * 충돌 가능성을 아예 없애고, 필요하면 키 자체를 읽어 디버깅할 수 있게).
 * 이름만 바꿔도 다른 키가 되도록 name을 포함한다(요구사항: "이름만 바꾸거나
 * 실제 계산 입력이 달라져 새로운 결과가 생성된 경우에는 새로운 광고 대상이다").
 * 말투(toneStyle)는 계산 입력이 아니라 같은 결과를 다르게 표현하는 스타일일
 * 뿐이라 키에 포함하지 않는다 — 말투만 바꿔도 광고를 또 보게 하지 않기 위함.
 */
function birthFormKeyPart(form: BirthFormState) {
  return {
    name: form.name.trim(),
    birthDate: form.birthDate,
    calendarType: form.calendarType,
    isLeapMonth: form.calendarType === "lunar" ? form.isLeapMonth : false,
    timeUnknown: form.timeUnknown,
    hour: form.timeUnknown ? null : form.hour,
    minute: form.timeUnknown ? null : form.minute,
    gender: form.gender,
  };
}

export function buildSoloResultKey(
  form: BirthFormState,
  category: Category,
  relationshipStatus: RelationshipStatus | null
): string {
  return JSON.stringify({
    kind: "solo",
    ...birthFormKeyPart(form),
    category,
    relationshipStatus: category === "love" ? relationshipStatus : null,
  });
}

export function buildCompatResultKey(form: BirthFormState, partnerForm: BirthFormState): string {
  return JSON.stringify({
    kind: "compat",
    a: birthFormKeyPart(form),
    b: birthFormKeyPart(partnerForm),
  });
}

/** 오늘의 운세는 같은 사람이라도 날짜가 바뀌면 실제로 다른 결과라 dateKey를 포함한다. */
export function buildDailyResultKey(form: BirthFormState, dateKey: string): string {
  return JSON.stringify({
    kind: "daily",
    ...birthFormKeyPart(form),
    dateKey,
  });
}
