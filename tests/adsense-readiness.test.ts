import { afterEach, describe, expect, it, vi } from "vitest";
import { canLoadAdTag, canRequestAds, isAdEligiblePath, REVIEW_ARTICLE_SLUGS } from "@/lib/ads-policy";
import { DEFAULT_BIRTH_FORM, loadBirthForm, loadToneStyle, saveBirthForm, saveToneStyle, clearBirthForm } from "@/lib/session";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });

describe("광고 요청 경계", () => {
  it.each(["/", "/privacy", "/about", "/faq", "/does-not-exist", "/name-compat", "/naming", "/zodiac/animal-compat/zi/zi", ...REVIEW_ARTICLE_SLUGS.map((s) => `/learn/${s}`)])("%s에 광고를 요청하지 않는다", (path) => {
    expect(isAdEligiblePath(path)).toBe(false);
    expect(canRequestAds(path, "www.sajudalyeok.co.kr")).toBe(false);
  });
  it("메인 앱(/)은 풀이 결과 화면이 spaContent를 넘길 때만 광고를 허용한다", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTENT_PREVIEW", "0");
    vi.stubEnv("NEXT_PUBLIC_DISABLE_ADS", "0");
    expect(isAdEligiblePath("/")).toBe(false);
    expect(isAdEligiblePath("/", true)).toBe(true);
    expect(canRequestAds("/", "www.sajudalyeok.co.kr", true)).toBe(true);
    expect(canRequestAds("/", "localhost", true)).toBe(false);
  });
  it("타로 주제 페이지는 광고를 허용하고, 궁합 조합 페이지는 계속 제외한다", () => {
    expect(isAdEligiblePath("/tarot/love")).toBe(true);
    expect(isAdEligiblePath("/zodiac/animal-compat/zi/zi", true)).toBe(false);
  });
  it("로컬·프리뷰는 실광고를 요청하지 않는다", () => {
    expect(canRequestAds("/learn/saju-basics", "localhost")).toBe(false);
    expect(canRequestAds("/learn/saju-basics", "preview.vercel.app")).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_CONTENT_PREVIEW", "1");
    expect(canRequestAds("/learn/saju-basics", "www.sajudalyeok.co.kr")).toBe(false);
  });
  it("기존 공개 해설의 광고 위치는 유지한다", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTENT_PREVIEW", "0");
    vi.stubEnv("NEXT_PUBLIC_DISABLE_ADS", "0");
    expect(canRequestAds("/learn/saju-basics", "www.sajudalyeok.co.kr")).toBe(true);
  });
});

describe("애드센스 태그 로드(오퍼월용)", () => {
  it("운영 도메인에서는 어떤 페이지든 태그를 불러온다(광고 칸 허용 여부와 별개)", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTENT_PREVIEW", "0");
    vi.stubEnv("NEXT_PUBLIC_DISABLE_ADS", "0");
    expect(canLoadAdTag("www.sajudalyeok.co.kr")).toBe(true);
    expect(isAdEligiblePath("/")).toBe(false);
  });
  it("로컬·프리뷰·광고 끄기 설정에서는 태그를 불러오지 않는다", () => {
    expect(canLoadAdTag("localhost")).toBe(false);
    expect(canLoadAdTag("preview.vercel.app")).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_DISABLE_ADS", "1");
    expect(canLoadAdTag("www.sajudalyeok.co.kr")).toBe(false);
  });
});

describe("저장 제한과 손상 데이터", () => {
  it("저장소가 차단돼도 화면과 계산 흐름을 중단하지 않는다", () => {
    const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };
    vi.stubGlobal("window", { localStorage: blocked, sessionStorage: blocked });
    expect(loadBirthForm()).toBeNull();
    expect(loadToneStyle()).toBe("standard");
    expect(() => saveBirthForm(DEFAULT_BIRTH_FORM)).not.toThrow();
    expect(() => saveToneStyle("mz")).not.toThrow();
    expect(() => clearBirthForm()).not.toThrow();
  });
  it.each(["null", "[]", "{", '{"birthDate":3}', JSON.stringify({ ...DEFAULT_BIRTH_FORM, birthDate: "1993-05-30", hour: 99 })])("잘못된 저장값 %s를 무시한다", (raw) => {
    vi.stubGlobal("window", { localStorage: { getItem: () => raw } });
    expect(loadBirthForm()).toBeNull();
  });
  it("정상 출생 입력은 복원한다", () => {
    const form = { ...DEFAULT_BIRTH_FORM, birthDate: "1993-05-30" };
    vi.stubGlobal("window", { localStorage: { getItem: () => JSON.stringify(form) } });
    expect(loadBirthForm()).toEqual(form);
  });
});
