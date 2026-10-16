import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACCESS_PASS_MS,
  AD_COOLDOWN_MS,
  grantAccessPass,
  hasAccessPass,
  isAdCooldownActive,
  isResultUnlocked,
  markResultUnlocked,
  startAdCooldown,
} from "@/lib/result-unlock";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

function stubBrowser() {
  vi.stubGlobal("window", { localStorage: memoryStorage(), sessionStorage: memoryStorage() });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("보상형 광고 이용권(8시간)", () => {
  it("이용권이 없으면 결과는 잠겨 있다", () => {
    stubBrowser();
    expect(hasAccessPass()).toBe(false);
    expect(isResultUnlocked("a")).toBe(false);
  });

  it("보상을 받아 이용권을 얻으면 다른 결과도 8시간 동안 바로 열린다", () => {
    stubBrowser();
    const now = 1_000_000;
    grantAccessPass(now);
    expect(hasAccessPass(now + ACCESS_PASS_MS - 1)).toBe(true);
    expect(hasAccessPass(now + ACCESS_PASS_MS + 1)).toBe(false);
    vi.spyOn(Date, "now").mockReturnValue(now + 1000);
    expect(isResultUnlocked("처음 보는 다른 결과")).toBe(true);
    vi.restoreAllMocks();
  });

  it("광고가 없어 열린 경우에는 30분만 광고 시도를 건너뛰고 이용권은 주지 않는다", () => {
    stubBrowser();
    const now = 5_000_000;
    startAdCooldown(now);
    expect(isAdCooldownActive(now + AD_COOLDOWN_MS - 1)).toBe(true);
    expect(isAdCooldownActive(now + AD_COOLDOWN_MS + 1)).toBe(false);
    expect(hasAccessPass(now + 1)).toBe(false);
  });

  it("이용권이나 쿨다운이 없어도 이번 세션에 열어본 결과는 다시 광고를 요구하지 않는다", () => {
    stubBrowser();
    markResultUnlocked("same-result");
    expect(isResultUnlocked("same-result")).toBe(true);
    expect(isResultUnlocked("other-result")).toBe(false);
  });

  it("저장소가 막혀 있어도 예외 없이 잠긴 상태로 동작한다", () => {
    const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };
    vi.stubGlobal("window", { localStorage: blocked, sessionStorage: blocked });
    expect(() => grantAccessPass()).not.toThrow();
    expect(() => startAdCooldown()).not.toThrow();
    expect(isResultUnlocked("x")).toBe(false);
  });
});
